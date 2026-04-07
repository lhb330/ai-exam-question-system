import { request, requestPage } from '@/core/request/http'
import type { KnowledgeBaseVector, KnowledgeBaseVectorDTO, KnowledgeBaseVectorVO } from '@/types'

export function getById(id: number) {
  return request<KnowledgeBaseVectorVO>({ url: `/kb/vector/${id}`, method: 'get' })
}

export function list() {
  return request<KnowledgeBaseVectorVO[]>({ url: '/kb/vector/list', method: 'get' })
}

export function page(params: KnowledgeBaseVectorDTO) {
  return requestPage<KnowledgeBaseVectorVO>({ url: '/kb/vector/page', method: 'get', params })
}

export function create(data: KnowledgeBaseVector) {
  return request<KnowledgeBaseVectorVO>({ url: '/kb/vector', method: 'post', data })
}

export function update(data: KnowledgeBaseVector) {
  return request<KnowledgeBaseVectorVO>({ url: '/kb/vector', method: 'put', data })
}

export function deleteById(id: number) {
  return request<boolean>({ url: `/kb/vector/${id}`, method: 'delete' })
}
