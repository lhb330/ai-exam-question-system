import { request, requestPage } from '@/core/request/http'
import type { AiChatMessage, AiChatMessageDTO, AiChatMessageVO } from '@/types'

export function getById(id: number) {
  return request<AiChatMessageVO>({ url: `/ai/chat-message/${id}`, method: 'get' })
}

export function list() {
  return request<AiChatMessageVO[]>({ url: '/ai/chat-message/list', method: 'get' })
}

export function page(params: AiChatMessageDTO) {
  return requestPage<AiChatMessageVO>({ url: '/ai/chat-message/page', method: 'get', params })
}

export function create(data: AiChatMessage) {
  return request<AiChatMessageVO>({ url: '/ai/chat-message', method: 'post', data })
}

export function update(data: AiChatMessage) {
  return request<AiChatMessageVO>({ url: '/ai/chat-message', method: 'put', data })
}

export function deleteById(id: number) {
  return request<boolean>({ url: `/ai/chat-message/${id}`, method: 'delete' })
}

export function fetchChatHistory(_sessionId: string) {
  return list()
}
