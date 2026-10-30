<template>
  <div class="chat-page">
    <!-- Theme Toggle Button -->
    <div class="theme-toggle" @click="toggleTheme" title="Toggle Theme">
      <svg
        v-if="isDark"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </div>

    <!--  Background elements for atmosphere  -->
    <div class="bg-gradient-1"></div>
    <div class="bg-gradient-2"></div>

    <!--  当前会话  -->
    <div class="chat-current" ref="chatPageRef" @scroll="handleScroll">
      <div class="container chat-content" ref="chatListDom">
        <!-- 聊天框 -->
        <div class="chat-wrap">
          <div class="list">
            <!--  引导语    -->
            <div class="chat-item system-intro animate-in">
              <div class="avatar-system" />
              <div class="content-wrap content-wrap-system">
                <div class="content">
                  <p class="greeting">
                    Hi, I'm the AI Avatar of <strong>Youwei Huang</strong>.
                  </p>
                  <p class="sub-greeting">
                    Feel free to ask me anything about my professional
                    background!
                  </p>
                  <div class="suggestion-grid">
                    <div
                      class="suggestion-item"
                      v-for="(item, index) in questions"
                      :key="index"
                      @click="sendMessage(item)"
                    >
                      <span class="icon">💡</span> {{ item }}
                    </div>
                  </div>
                  <p class="tip">
                    (Select a topic above to start chatting instantly)
                  </p>
                </div>
              </div>
            </div>
            <!--   会话内容   -->
            <div
              :class="['chat-item', role[item.role], 'animate-in']"
              v-for="(item, i) of messageList"
              :key="i"
            >
              <template v-if="item.content">
                <div :class="`avatar-${role[item.role]}`" />
                <div class="content-wrap">
                  <div class="content">
                    <template v-if="item.role === 'user'">
                      <div v-html="md.render(item.content)" />
                    </template>
                    <div v-if="item.role !== 'user'">
                      <MdPreview
                        v-if="item.content"
                        :html-render="true"
                        :no-img-zoom-in="true"
                        v-model="item.content"
                        :theme="isDark ? 'dark' : 'light'"
                        class="md-preview-custom"
                        style="padding: 0; background: none"
                      />
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="bottom-spacer"></div>
        </div>
      </div>
    </div>

    <!-- Input Area Fixed at Bottom -->
    <div class="bottom-area">
      <div
        class="chat-input-container"
        :class="{ disabled: sending, shake: false }"
      >
        <el-input
          :disabled="sending"
          v-model="messageContent"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 4 }"
          :placeholder="placeholder"
          @keydown="keydownHandle"
          class="custom-textarea"
        />
        <button
          class="send-btn"
          @click="sendMessage()"
          :class="{ disabled: sending }"
        >
          <div v-if="!sending" class="icon-send">
            <el-icon size="18"><Promotion /></el-icon>
          </div>
          <div v-else class="loading-dots">
            <span></span><span></span><span></span>
          </div>
        </button>
      </div>
      <div class="copyright">Powered by LLM & Vue 3</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch, onMounted, onUnmounted } from "vue";
import { md } from "@/utils";
import type { ChatMessage } from "@/apis";
import { MdPreview } from "md-editor-v3";
import { sse } from "@/utils/service";
import { readResponseStream } from "@/utils/responses";
import { Promotion } from "@element-plus/icons-vue";

const isDark = ref(true);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  updateTheme();
};

const updateTheme = () => {
  const html = document.documentElement;
  if (isDark.value) {
    html.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    html.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};


let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  // Check local storage or system preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    isDark.value = savedTheme === "dark";
  } else {
    isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  updateTheme();

  if (chatListDom.value && chatPageRef.value) {
    resizeObserver = new ResizeObserver(() => {
      if (autoScrollEnabled.value) {
        scrollToBottom(sending.value ? "auto" : "smooth");
      }
    });
    resizeObserver.observe(chatListDom.value);
  }
});

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect();
});


const sending = ref(false);

// 输入框的内容
const messageContent = ref("");

// placeholder 提示语
const messageList = ref<ChatMessage[]>([]);
// Only successful exchanges are sent back as model context.
const conversation: ChatMessage[] = [];

const placeholder = ref("Type your question here...");
const loadingMessage = "Thinking...";
const questions = [
  "What are you currently working on?",
  "What are your research interests?",
  "Tell me about your education.",
  "Where are you based?",
  "What are your notable achievements?",
];
const errorMessage = `<font color=red>**Network Error**: Unable to connect. Please check your network settings.</font>`;

// 聊天角色
const role = { user: "user", assistant: "assistant", system: "system" };
// 发送提问问题
const sendMessage = async (content: string = messageContent.value) => {
  if (!content.trim() || sending.value) return false;
  try {
    // User sends message - Force scroll to bottom
    autoScrollEnabled.value = true;
    nextTick(() => scrollToBottom());

    sending.value = true;
    messageList.value.push({ role: "user", content });
    messageContent.value = "";
    const param = { input: [...conversation, { role: "user", content }], stream: true };
    messageList.value.push({ role: "assistant", content: loadingMessage });

    nextTick(() => scrollToBottom());

    const response = await sse("/v1/responses", param);
    let answer = "";
    await readResponseStream(response, (delta) => {
      answer += delta;
      appendLastMessageContent(delta);
      if (autoScrollEnabled.value) nextTick(() => scrollToBottom("auto"));
    });
    if (!answer.trim()) throw new Error("Empty response");
    conversation.push({ role: "user", content }, { role: "assistant", content: answer });
  } catch (e: any) {
    appendLastMessageContent(errorMessage);
  } finally {
    sending.value = false;
  }
};

// 将最新的流数据加入到message队列中，等待渲染
const appendLastMessageContent = (content: string) => {
  const end =
    messageList.value.length - 1 >= 0 ? messageList.value.length - 1 : 0;
  if (messageList.value[end].content === loadingMessage)
    messageList.value[end].content = "";
  messageList.value[end].content += content;
};

// --- Smart Scroll Logic ---
const chatPageRef = ref<HTMLElement>(); // 滚动容器
const chatListDom = ref<HTMLElement>(); // 内容容器
const autoScrollEnabled = ref(true); // 是否开启自动滚动

const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  const { scrollTop, scrollHeight, clientHeight } = target;

  // Define a threshold (e.g., 50px from bottom)
  const isAtBottom = scrollHeight - scrollTop - clientHeight <= 100;

  if (isAtBottom) {
    autoScrollEnabled.value = true;
  } else {
    // If user scrolls up, disable auto-scroll
    autoScrollEnabled.value = false;
  }
};

// Force scroll to bottom
const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
  if (!chatPageRef.value) return;
  chatPageRef.value.scrollTo({
    top: chatPageRef.value.scrollHeight,
    behavior: behavior,
  });
};

// Watch for manual additions mostly
watch(
  () => messageList.value.length,
  () => {
    if (autoScrollEnabled.value) {
      nextTick(() => scrollToBottom());
    }
  },
);

function keydownHandle(event) {
  if (event.keyCode === 13 && !event.ctrlKey && !event.metaKey) {
    event.stopPropagation();
    event.preventDefault();
    sendMessage();
  } else if (event.keyCode === 13 && (event.ctrlKey || event.metaKey)) {
    messageContent.value += "\n";
  }
}
</script>
