import test from 'node:test'
import assert from 'node:assert/strict'
import { readResponseStream } from '../src/utils/responses.ts'

const event = data => `event: ${data.type}\r\ndata: ${JSON.stringify(data)}\r\n\r\n`
function response(text) {
  const bytes = new TextEncoder().encode(text)
  let offset = 0
  return new Response(new ReadableStream({
    pull(controller) {
      if (offset < bytes.length) controller.enqueue(bytes.slice(offset, ++offset))
      else controller.close()
    }
  }), { headers: { 'Content-Type': 'text/event-stream' } })
}
test('handles split Chinese UTF-8, lifecycle events, deltas and completion', async () => {
  let text = ''
  await readResponseStream(response(
    event({ type: 'response.created' }) +
    event({ type: 'response.output_text.delta', delta: '你好' }) +
    event({ type: 'response.output_text.delta', delta: '！' }) +
    event({ type: 'response.completed' })
  ), delta => { text += delta })
  assert.equal(text, '你好！')
})
test('HTTP errors and unexpected content types are rejected', async () => {
  await assert.rejects(readResponseStream(Response.json({ error: { message: 'Provider unavailable' } }, { status: 502 }), () => {}), /Provider unavailable/)
  await assert.rejects(readResponseStream(new Response('html'), () => {}), /Expected/)
})
test('failed, incomplete, error and premature EOF are not successful replies', async () => {
  for (const type of ['response.failed', 'response.incomplete', 'error']) {
    await assert.rejects(readResponseStream(response(event({ type })), () => {}))
  }
  await assert.rejects(readResponseStream(response(event({ type: 'response.output_text.delta', delta: 'partial' })), () => {}), /before completion/)
  await assert.rejects(readResponseStream(response('data: invalid\n\n'), () => {}))
})
test('completion cancels an otherwise open transport', async () => {
  let canceled = false
  const body = new ReadableStream({
    start(controller) { controller.enqueue(new TextEncoder().encode(event({ type: 'response.completed' }))) },
    cancel() { canceled = true }
  })
  await readResponseStream(new Response(body, { headers: { 'Content-Type': 'text/event-stream' } }), () => {})
  assert.equal(canceled, true)
})
