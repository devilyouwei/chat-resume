<template>
  <div class='chat-page'>
    <!--  当前会话  -->
    <div class='chat-current' ref='chatPageRef'>

      <div class='container chat-content' ref='chatListDom'>
        <!-- 聊天框 -->
        <div class='chat-wrap'>
          <div class='list'>
            <!--  引导语    -->
            <div class='chat-item'>
              <div class='avatar-system' />
              <div class='content-wrap content-wrap-system'>
                <div class='content'>
                  <p>Hi，我是黄有为的大模型数字分身，你可以询问任何关于我个人的问题！例如：</p>
                  <ul>
                    <li v-for="(item, index) in questions" :key="index" @click="sendMessage(item)">
                      {{ item }}
                    </li>
                  </ul>
                  <p class="tip">（点击上述问题直接发送）</p>
                </div>
              </div>
            </div>
            <!--   会话内容   -->
            <div :class='`chat-item ${role[item.role]}`' v-for='(item, i) of messageList' :key='i'>
              <template v-if='item.content'>
                <div :class='`avatar-${role[item.role]}`' />
                <div class='content-wrap'>
                  <div class='content'>
                    <template v-if="item.role === 'user'">
                      <div v-html='md.render(item.content)' />
                    </template>
                    <div v-if="item.role !== 'user'">
                      <MdPreview v-if='item.content' :html-render='true' :no-img-zoom-in='true' v-model='item.content'
                        style='padding: 0; background: none' />
                    </div>
                  </div>
                </div>
              </template>
            </div>

          </div>
          <div class='bottom tab'>
            <div class='chat-input' :class='{ disabled: sending }'>
              <el-input :disabled='sending' v-model='messageContent' type='textarea'
                :autosize='{ minRows: 3, maxRows: 3 }' :placeholder='placeholder' @keydown="keydownHandle" />
              <button class='send-btn' @click='sendMessage()' :class='{ disabled: sending }'>
                <img :src="getAssetsImage('send.png')" alt='发送' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang='ts'>
import { nextTick, onMounted, ref, watch } from 'vue';
import { getAssetsImage, md } from '@/utils';
import type { ChatMessage } from '@/apis';
import { MdPreview } from 'md-editor-v3';
import { sse } from '@/utils/service'
import { EventSourceParserStream } from 'eventsource-parser/stream'


const sending = ref(false)

// 输入框的内容
const messageContent = ref('');

// placeholder 提示语
const messageList = ref<ChatMessage[]>([]);
const placeholder = ref('想跟黄有为聊点啥呢？');
const loadingMessage = '🤔让我想一想该怎么回答好呢...'
const firstMessage = '你好，请简单介绍下自己吧~'
const questions = [
  '你目前的工作是什么？',
  '你的研究领域有哪些？',
  '介绍下你的教育背景？',
  '你是哪里人？',
  '你发表过哪些成果或著作？'
]
const errorMessage = '<font color=red>**网络错误**：根据相关法律法规，我无法接收来自中国大陆的请求，请切换至海外网络，谢谢！</font>'

// 聊天角色
const role = { user: 'user', assistant: 'assistant', system: 'system' };
// 发送提问问题
const sendMessage = async (content: string = messageContent.value) => {
  console.log(content)
  if (!content.trim() || sending.value) return false
  try {
    nextTick(() => scrollToBottom())
    sending.value = true
    messageList.value.push({ role: 'user', content })
    messageContent.value = ''
    const param = { input: [...messageList.value], stream: true }
    messageList.value.push({ role: 'assistant', content: loadingMessage })
    nextTick(() => scrollToBottom())
    const { body, status } = await sse('/chat', param)
    if (body) {
      const reader = body
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new EventSourceParserStream())
        .getReader()

      await readStream(reader, status)
    }
  } catch (e: any) {
    appendLastMessageContent(errorMessage)
  } finally {
    sending.value = false
  }
}

// 读取流数据
const readStream = async (reader, status: number) => {
  /* eslint-disable no-constant-condition*/
  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    const { data, status, msg } = JSON.parse(value.data)
    if (status === 1) {
      if (!data) break
      appendLastMessageContent(data.content)
      nextTick(() => scrollToBottom())
    } else {
      messageList.value.pop()
      throw new Error(msg)
    }
  }
}

// 将最新的流数据加入到message队列中，等待渲染
const appendLastMessageContent = (content: string) => {
  const end = messageList.value.length - 1 >= 0 ? messageList.value.length - 1 : 0
  if (messageList.value[end].content === loadingMessage) messageList.value[end].content = ''
  messageList.value[end].content += content
}


// 新的message进来，页面保持滚动到最底部
const chatPageRef = ref();  // 滚动条所在DOM
const chatListDom = ref<HTMLDivElement>(); // 内容DOM
const scrollToBottom = () => {
  if (!chatListDom.value) return;
  chatPageRef.value.scrollTo(0, chatListDom.value.scrollHeight);
};
watch(() => messageList.value, () => {
  nextTick(() => scrollToBottom());
});



function keydownHandle(event) {
  // console.log(event);

  if (event.keyCode === 13 && !event.ctrlKey && !event.metaKey) {
    // 如果只按下了Enter键，则执行事件a的逻辑
    // 这里可以添加事件a的处理逻辑
    event.stopPropagation()
    event.preventDefault()
    sendMessage()
  } else if (event.keyCode === 13 && (event.ctrlKey || event.metaKey)) {
    messageContent.value += '\n'
    const inputElement = event.target
    requestAnimationFrame(() => {
      inputElement.scrollTop = inputElement.scrollHeight - inputElement.clientHeight
    })
  }
}

// onMounted(() => sendMessage(firstMessage));

</script>

<style lang='scss' scoped>
.chat-page {
  width: 100%;
  height: 100vh;
  background: $color-bg-chat linear-gradient(180deg, #F4F5F7 0%, #DEE9FF 100%);
}

.chat-history {
  overflow-x: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 199;
  background: #f3f5fcb2;
  backdrop-filter: blur(20px);

  .widget-close {
    position: absolute;
    top: 8px;
    left: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    color: #fff;
    font-size: 28px;
    background: #cc525f;
  }

  h3 {
    padding: 16px;
    font-size: 36px;
    line-height: 50px;
    font-weight: 700;
    text-align: center;
  }

  .time-mk {
    padding: 8px;
    margin-bottom: 8px;
    font-size: 24px;
    line-height: 34px;
    font-weight: 700;
  }

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    margin-bottom: 8px;
    color: rgba(0, 0, 0, 0.87);
    border-radius: 8px;
    cursor: pointer;
    background: #fff;
    transition: all 0.3s cubic-bezier(0.36, 0.66, 0.04, 1);

    .action {
      display: none;
      align-items: center;

      i {
        margin: 0 5px;
        display: flex;
        align-items: center;
      }
    }

    &:hover {
      .time {
        display: none;
      }

      .action {
        display: flex;
      }
    }

    img {
      width: auto;
      height: 20px;
    }
  }
}

.chat-current {
  height: calc(100vh - 120px);
  overflow-y: auto;

  .widget-chat {
    position: fixed;
    top: 100px;
    right: 10px;
    width: 50px;
    height: 70px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    border-radius: 8px 0px 0px 8px;
    background: #fff;

    button {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      padding: 0;
      font-size: 12px;
      border: 0;
      outline: 0;
      background: none;

      img {
        width: 32px;
        height: 32px;
      }
    }

    .el-divider--horizontal {
      margin: 0;
    }
  }

  .chat-content {
    width: 90%;
    max-width: 800px;
  }
}

/* 诊断遮罩 */
.full-dialog {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background: $color-bg-chat linear-gradient(180deg, #F4F5F7 0%, #FFFFFF 66%, #DEE9FF 100%);

  &.transparent {
    background: transparent;
  }
}

/* 聊天框 start */
pre {
  font-family: -apple-system, 'Noto Sans', 'Helvetica Neue', Helvetica, 'Nimbus Sans L', Arial,
    'Liberation Sans', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans CJK SC', 'Source Han Sans SC',
    'Source Han Sans CN', 'Microsoft YaHei', 'Wenquanyi Micro Hei', 'WenQuanYi Zen Hei', 'ST Heiti',
    SimHei, 'WenQuanYi Zen Hei Sharp', sans-serif;
}

.chat-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 140px);
  margin: 0 auto;
  border-top: 1px solid transparent;
  box-sizing: border-box;
}

.chat-item {
  display: grid;
  grid-template-columns: 40px auto 40px;
  grid-column-gap: 8px;
  margin: 20px 0;

  .content-wrap {
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    gap: 8px;

    .content {
      position: relative;
      padding: 12px 20px;
      border-radius: 10px;
      color: #333;
      font-size: 16px;
      background: #fff;

      &.card-content {
        background: transparent;
      }

      .sprite-copy {
        position: absolute;
        bottom: -4px;
        right: 10px;
      }

      p {
        margin-bottom: 10px;

        &.tip {
          color: #666;
          font-weight: normal;
          font-size: 12.5px;
          margin: 0;
          padding: 0;
          float: right;
        }
      }

      ul {

        padding-left: 30px;

        li {
          cursor: pointer;
          line-height: 28px;
          list-style-type: disc;
          transition: all 0.3s ease-in-out;

          &:hover {
            color: #2e67fa;
            padding-left: 10px;
            font-weight: bold;
          }
        }
      }
    }

    &-system {
      align-items: normal;

      .content {
        padding: 20px 20px 10px 20px;

        p {
          font-weight: 500;
          font-size: 18px;
          color: #333333;
          line-height: 24px;
          text-align: left;
          font-style: normal;
        }

        h6 {
          height: 32px;
          margin: 6px 0 2px;
          font-weight: 500;
          font-size: 18px;
          color: #3360fd;
          line-height: 32px;
          text-align: left;
          font-style: normal;
        }

        div {
          display: flex;
          flex-direction: column;
          padding: 17px 10px;
          background: #f4f5f7;
          border-radius: 8px;

          a {
            color: #666;
          }
        }
      }
    }
  }

  &.user {
    direction: rtl;

    .content-wrap {
      direction: ltr;
      align-items: flex-end;

      .content {
        color: #fff;
        background: $color-chat-theme;

        .sprite-copy {
          bottom: -4px;
          left: 10px;
          visibility: hidden;
        }

        &:hover .sprite-copy {
          visibility: visible;
        }

      }
    }
  }

  .avatar {
    &-user {
      width: 35px;
      height: 35px;
      //margin: 0 7px 7px;
      content: 'ME';
      color: #fff;
      border-radius: 50%;
      background: url("@/assets/images/user.png") no-repeat center/ 100% 100%;
    }

    &-assistant,
    &-system {
      margin-top: 8px;
      width: 40px;
      height: 40px;
      border-radius: 100%;
      background: url('@/assets/images/avatar.png') no-repeat center/ 100% 100%;
    }
  }

}

.bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  .chat-input {
    position: relative;
    width: 90%;
    max-width: 800px;
    padding: 12px 0;
    margin: 0 auto;
    box-sizing: border-box;

    &.disabled:after {
      position: absolute;
      top: 0;
      left: 0;
      content: '';
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    &.shake {
      animation: shake 1s ease-in-out infinite;

      .el-textarea {
        border: 1px solid #3360FD;
        animation: border-flash 1s infinite;
      }
    }

    .el-input {
      height: 45px;
      line-height: 40px;
    }

    .send-btn {
      position: absolute;
      bottom: 24px;
      right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 26px;
      border: 0;
      outline: 0;
      background: linear-gradient(270deg, #46A3FF 0%, rgba(7, 55, 195, 0.82) 100%);
      border-radius: 10px;

      &.disabled {
        background: #ccc;
      }

      img {
        height: 20px;
      }
    }
  }
}

.tab-btns {
  display: flex;
  align-items: center;
  column-gap: 12px;
  width: 800px;
  margin: 0 auto;
  box-sizing: border-box;

  &.shake {
    animation: shake 1s ease-in-out infinite;

    li {
      border: 1px solid #3360FD;
      animation: border-flash 1s infinite;
    }
  }

  li {
    flex: none;
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 11px;
    width: 130px;
    height: 46px;
    font-size: 16px;
    color: #333;
    font-weight: bold;
    border-radius: 8px;
    background: #fff;
    box-sizing: border-box;
    cursor: pointer;

    &.active {
      border: 1px solid #3360FD;
      background: #EBECFB;
    }


    img {
      width: 32px;
      height: 32px;
    }

  }
}

.list .tab-btns {
  margin-left: 46px;
}

.tips {
  width: 330px;
  height: 46px;
  margin: 10px auto;
  padding: 7px 0;
  font-size: 16px;
  color: #333333;
  text-align: center;
  background: rgba(203, 220, 255, 0.4);
  border-radius: 8px;
  box-sizing: border-box;

  a {
    display: inline-block;
    width: 5em;
    text-align: center;
    line-height: 32px;
    color: #3360FD;

    &.btn {
      background: #fff;
    }
  }
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }

  10%,
  90% {
    transform: translateX(-10px);
  }

  20%,
  80% {
    transform: translateX(10px);
  }

  30%,
  50%,
  70% {
    transform: translateX(-10px);
  }

  40%,
  60% {
    transform: translateX(10px);
  }
}

@keyframes border-flash {
  0% {
    border-color: transparent;
  }

  50% {
    border-color: #3360FD;
  }

  100% {
    border-color: transparent;
  }
}

/* 聊天框 end */
</style>
<style lang='scss'>
.chat-wrap .chat-input textarea {
  box-shadow: none !important;
  resize: none;
  font-size: 18px;
}

.md-editor-preview-wrapper {
  padding: 0 !important;
}
</style>
