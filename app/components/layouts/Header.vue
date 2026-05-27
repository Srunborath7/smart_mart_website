<template>
  <header class="header">

    <!-- MENU -->
    <button class="menu-btn" @click="toggleSidebar">☰</button>

    <div class="container-fluid d-flex align-items-center justify-content-around gap-3 w-100">

      <h2 class="mb-0">Dashboard</h2>

      <div class="ms-auto d-flex align-items-center gap-3">

        <!-- CHAT ICON -->
        <div class="icon" @click="openChat">
          <AppIcon name="MessageSquareQuote" />
        </div>

        <span>{{ auth.user?.name }}</span>

        <button class="btn btn-sm btn-light" @click="auth.logout()">
          Logout
        </button>

      </div>
    </div>

    <!-- CHAT BOX -->
    <div v-if="showChat" class="chat-box">

      <!-- HEADER -->
      <div class="chat-header">
        <div>💬 Chat Room</div>
        <button class="close" @click="closeChat">✕</button>
      </div>

      <!-- BODY -->
      <div ref="chatBody" class="chat-body">

        <div
          v-for="(msg, i) in messages"
          :key="msg.id || i"
          class="msg"
          :class="{ 'my-msg': msg.sender_name === auth.user?.name }"
        >
          <div class="msg-name">
            {{ msg.sender_name }}
          </div>

          <div class="msg-text">
            {{ msg.message }}
          </div>

          <div class="msg-time">
            {{ formatTime(msg.createdAt) }}
          </div>
        </div>

      </div>

      <!-- FOOTER -->
      <div class="chat-footer">
        <input
          v-model="message"
          placeholder="Type message..."
          @keyup.enter="sendMessage"
        />
        <button @click="sendMessage">Send</button>
      </div>

    </div>

  </header>
</template>

<script setup>
import AppIcon from '../icons/AppIcon.vue'
import { useApi } from '~/composables/api/useApi.js'

const { toggleSidebar } = useSidebar()
const auth = useAuthStore()

const { $socket } = useNuxtApp() || {}
const api = useApi()

const showChat = ref(false)
const message = ref("")
const messages = ref([])
const roomId = ref(null)

const chatBody = ref(null)
let socketReady = false

// ---------------- FORMAT TIME ----------------
const formatTime = (date) => {
  if (!date) return ""
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })
}

// ---------------- SCROLL ----------------
const scrollBottom = () => {
  nextTick(() => {
    if (chatBody.value) {
      chatBody.value.scrollTop = chatBody.value.scrollHeight
    }
  })
}

// ---------------- LOAD ROOM ----------------
const loadRoom = async () => {
  const res = await api("/chat-rooms")
  roomId.value = res.data?.[0]?.id
}

// ---------------- LOAD MESSAGES ----------------
const loadMessages = async () => {
  const res = await api(`/chat?room_id=${roomId.value}`)
  messages.value = res.data || []
}

// ---------------- OPEN CHAT ----------------
const openChat = async () => {

  if (!roomId.value) {
    await loadRoom()
  }

  showChat.value = true

  await loadMessages()
  scrollBottom()

  if ($socket && roomId.value) {
    $socket.emit("joinRoom", roomId.value)
  }

  if (!socketReady && $socket) {
    $socket.on("receiveMessage", (data) => {
      messages.value.push(data)
      scrollBottom()
    })

    socketReady = true
  }
}

// ---------------- CLOSE CHAT ----------------
const closeChat = () => {
  showChat.value = false
}

// ---------------- SEND MESSAGE ----------------
const sendMessage = async () => {

  if (!message.value.trim()) return

  await api("/chat", {
    method: "POST",
    body: {
      room_id: roomId.value,
      sender_name: auth.user?.name || "Admin",
      sender_role: auth.user?.role || "admin",
      message: message.value
    }
  })

  message.value = ""
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #a70000;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 1000;
}

.menu-btn {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
}

.icon {
  cursor: pointer;
}
.icon:hover {
  opacity: 0.8;
}

/* CHAT BOX */
.chat-box {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 340px;
  height: 450px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* HEADER */
.chat-header {
  background: #a70000;
  color: white;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
}

/* BODY */
.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f7f7f7;
}

/* MESSAGE */
.msg {
  max-width: 75%;
  padding: 10px 12px;
  border-radius: 14px;
  background: #e4e6eb;
  color: black;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.my-msg {
  background: #a70000;
  color: white;
  align-self: flex-end;
}

.msg-name {
  font-size: 12px;
  font-weight: bold;
}

.msg-text {
  font-size: 14px;
}

.msg-time {
  font-size: 10px;
  opacity: 0.7;
  text-align: right;
}

/* FOOTER */
.chat-footer {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
  background: white;
}

.chat-footer input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
}

.chat-footer button {
  margin-left: 8px;
  background: #a70000;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

/* MOBILE */
@media (max-width: 768px) {
  .menu-btn {
    display: block;
  }

  .chat-box {
    width: 95%;
    right: 10px;
  }
}
</style>