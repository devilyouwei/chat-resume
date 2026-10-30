import { EventSourceParserStream } from 'eventsource-parser/stream'

export async function readResponseStream(response: Response, onDelta: (text: string) => void) {
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.error?.message || `Request failed (${response.status})`)
  }
  if (!response.body || !response.headers.get('content-type')?.includes('text/event-stream')) {
    throw new Error('Expected a Responses event stream')
  }
  const reader = response.body.pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream()).getReader()
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) throw new Error('Response stream ended before completion')
      const event = JSON.parse(value.data)
      switch (event.type) {
        case 'response.output_text.delta':
          if (typeof event.delta !== 'string') throw new Error('Invalid response delta')
          onDelta(event.delta)
          break
        case 'response.completed':
          return
        case 'response.failed':
        case 'response.incomplete':
        case 'error':
          throw new Error(event.response?.error?.message || event.message || 'Response did not complete')
      }
    }
  } finally {
    await reader.cancel().catch(() => {})
    reader.releaseLock()
  }
}
