<template>
  <header class="header">
    <button class="menu-btn" @click="toggleSidebar">
      ☰
    </button>

    <div class="container-fluid d-flex align-items-center justify-content-between w-100">

      <h2 class="mb-0">Dashboard</h2>

      <div class="d-flex align-items-center gap-3">
        <div class="message-icon" @click="openMessages">

          <AppIcon name="MessageSquareQuote" />

          <span v-if="unreadCount > 0" class="badge">
            {{ unreadCount }}
          </span>

        </div>

        <span>{{ auth.user?.name }}</span>

      </div>

    </div>

  </header>
  <div v-if="showChat && !selectedRoom" class="room-page">
    <div class="room-top">

      <h4>Smart Mart Messages</h4>

      <button class="close-btn" @click="closeChat">
        ✕
      </button>

    </div>
    <div class="room-list">

      <div v-for="room in rooms" :key="room.id" class="room-item" @click="openRoom(room)">
        <div class="room-avatar">
          {{ room.name.charAt(0).toUpperCase() }}
        </div>
        <div class="room-info">

          <div class="room-name">
            {{ room.name }}
          </div>

          <div class="room-desc">
            {{ room.description }}
          </div>

        </div>

      </div>

    </div>

  </div>

  <div v-if="selectedRoom" class="chat-page">
    <div class="chat-header">

      <div class="chat-left">

        <button class="back-btn" @click="selectedRoom = null">
          ←
        </button>

        <div class="chat-avatar">
          {{ selectedRoom.name.charAt(0).toUpperCase() }}
        </div>

        <div>

          <div class="chat-room-name">
            {{ selectedRoom.name }}
          </div>

          <div class="chat-status">
            online
          </div>

        </div>

      </div>

      <button class="close-btn" @click="closeChat">
        ✕
      </button>

    </div>

    <div ref="chatBody" class="chat-body">

      <div v-for="(msg, i) in messages" :key="msg.id || i" class="message" :class="{
        mine: msg.sender_name === auth.user?.name
      }">

        <div class="message-sender">
          {{ msg.sender_name }}
        </div>

        <div class="message-text">
          {{ msg.message }}
        </div>

        <div class="message-time">
          {{ formatTime(msg.createdAt) }}
        </div>

      </div>

    </div>

    <div class="chat-footer">

      <input v-model="message" placeholder="Type message..." @keyup.enter="sendMessage" />

      <button @click="sendMessage">
        Send
      </button>

    </div>

  </div>

</template>

<script setup>
import AppIcon from '../icons/AppIcon.vue'
import { useApi } from '~/composables/api/useApi.js'

const { toggleSidebar } = useSidebar()
const auth = useAuthStore()

const { $socket } = useNuxtApp() || {}
const api = useApi()


const showChat = ref(false)

const rooms = ref([])
const selectedRoom = ref(null)

const messages = ref([])
const message = ref("")

const unreadCount = ref(0)

const chatBody = ref(null)

let socketReady = false
const formatTime = (date) => {

  if (!date) return ""

  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })
}

const scrollBottom = () => {

  nextTick(() => {

    if (chatBody.value) {
      chatBody.value.scrollTop =
        chatBody.value.scrollHeight
    }

  })
}

const loadRooms = async () => {

  const res = await api("/chat-rooms")

  rooms.value = res.data || []
}


const openMessages = async () => {

  showChat.value = true

  await loadRooms()

  unreadCount.value = 0

  if (!socketReady && $socket) {

    $socket.on("receiveMessage", (data) => {

      if (
        selectedRoom.value &&
        data.room_id === selectedRoom.value.id
      ) {

        messages.value.push(data)

        scrollBottom()

      } else {

        unreadCount.value++

      }

    })

    socketReady = true
  }
}

const openRoom = async (room) => {

  selectedRoom.value = room

  const res = await api(`/chat/room/${room.id}`)

  messages.value = res.data || []

  if ($socket) {
    $socket.emit("joinRoom", room.id)
  }

  scrollBottom()
}

const sendMessage = async () => {

  if (!message.value.trim()) return

  if (!selectedRoom.value) return

  await api("/chat", {
    method: "POST",
    body: {
      room_id: selectedRoom.value.id,
      sender_name: auth.user?.name || "Admin",
      sender_role: auth.user?.role || "ADMIN",
      message: message.value
    }
  })

  message.value = ""
}

const closeChat = () => {

  showChat.value = false

  selectedRoom.value = null
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
  z-index: 999;
}

.menu-btn {
  display: none;
  border: none;
  background: none;
  color: white;
  font-size: 24px;
}

.message-icon {
  position: relative;
  cursor: pointer;
}
.message-icon:hover {
  opacity: 0.8;
}

.badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background: red;
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.room-page {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 360px;
  height: 560px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 9999;
}

.room-top {
  height: 65px;
  background: #a70000;
  color: white;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.room-list {
  flex: 1;
  overflow-y: auto;
}

.room-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  cursor: pointer;
  border-bottom: 1px solid #f2f2f2;
}

.room-item:hover {
  background: #f7f7f7;
}

.room-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #a70000;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.room-info {
  flex: 1;
}

.room-name {
  font-weight: 600;
}

.room-desc {
  font-size: 13px;
  color: #666;
  margin-top: 2px;
}

.chat-page {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 360px;
  height: 560px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 9999;
}

.chat-header {
  height: 65px;
  background: #a70000;
  color: white;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  border: none;
  background: none;
  color: white;
  font-size: 20px;
}

.chat-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: white;
  color: #a70000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.chat-room-name {
  font-weight: 600;
}

.chat-status {
  font-size: 12px;
  opacity: 0.8;
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  max-width: 75%;
  padding: 10px 12px;
  border-radius: 16px;
  background: white;
  align-self: flex-start;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.mine {
  margin-left: auto;
  background: #a70000;
  color: white;
}

.message-sender {
  font-size: 12px;
  font-weight: bold;
}

.message-text {
  margin-top: 4px;
  word-break: break-word;
}

.message-time {
  font-size: 10px;
  opacity: 0.7;
  margin-top: 5px;
  text-align: right;
}

.chat-footer {
  display: flex;
  gap: 10px;
  padding: 12px;
  border-top: 1px solid #eee;
  background: white;
}

.chat-footer input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 14px;
  padding: 10px 14px;
  outline: none;
}

.chat-footer button {
  border: none;
  background: #a70000;
  color: white;
  padding: 10px 16px;
  border-radius: 12px;
}

.close-btn {
  border: none;
  background: none;
  color: white;
  font-size: 18px;
}

@media(max-width:768px) {

  .menu-btn {
    display: block;
  }

  .room-page,
  .chat-page {
    width: 100%;
    height: 100dvh;
    right: 0;
    bottom: 0;
    border-radius: 0;
  }

}
</style>