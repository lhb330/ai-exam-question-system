import { defineStore } from 'pinia'
import { fetchChatHistory } from '@/api/ai/chat'
import type { AiChatMessageVO } from '@/types'

export const useAiChatStore = defineStore('ai-chat', {
  state: () => ({
    sessionId: '',
    messages: [] as AiChatMessageVO[]
  }),
  actions: {
    async loadMessages(sessionId: string) {
      this.sessionId = sessionId
      this.messages = await fetchChatHistory(sessionId)
    }
  }
})
