import { request, requestPage } from '@/core/request/http'
import type { KnowledgePoint, KnowledgePointDTO, KnowledgePointVO } from '@/types'

export function getById(id: number) {
  return request<KnowledgePointVO>({ url: `/kb/point/${id}`, method: 'get' })
}

export function list() {
  return request<KnowledgePointVO[]>({ url: '/kb/point/list', method: 'get' })
}

export function page(data: KnowledgePointDTO) {
  return requestPage<KnowledgePointVO>({ url: '/kb/point/page', method: 'post', data })
}

export function create(data: KnowledgePoint) {
  return request<KnowledgePointVO>({ url: '/kb/point', method: 'post', data })
}

export function update(data: KnowledgePoint) {
  return request<KnowledgePointVO>({ url: '/kb/point', method: 'put', data })
}

export function deleteById(id: number) {
  return request<boolean>({ url: `/kb/point/${id}`, method: 'delete' })
}

export function fetchKnowledgePoints() {
  return list()
}

export function getKpParent() {
  return request<KnowledgePointVO[]>({ url: `/kb/point/parent`, method: 'get' })
}

export function getKpChild(data: Array<number>) {
  return request<KnowledgePointVO[]>({ url: `/kb/point/child`, method: 'post',data })
}
