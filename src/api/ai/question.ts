import { request, requestPage } from '@/core/request/http'
import type {
  AiGenerateQuestionDTO,
  AiQuestionBatch,
  AiQuestionBatchDTO,
  AiQuestionBatchVO,
  AiQuestionVector,
  AiQuestionVectorDTO,
  AiQuestionVectorVO
} from '@/types'

export function fetchAiQuestionBatchPage(params: AiQuestionBatchDTO) {
  return requestPage<AiQuestionBatchVO>({ url: '/ai/question-batch/page', method: 'get', params })
}

export function getAiQuestionBatchById(id: number) {
  return request<AiQuestionBatchVO>({ url: `/ai/question-batch/${id}`, method: 'get' })
}

export function listAiQuestionBatch() {
  return request<AiQuestionBatchVO[]>({ url: '/ai/question-batch/list', method: 'get' })
}

export function createAiQuestionBatch(data: AiQuestionBatch) {
  return request<AiQuestionBatchVO>({ url: '/ai/question-batch', method: 'post', data })
}

export function updateAiQuestionBatch(data: AiQuestionBatch) {
  return request<AiQuestionBatchVO>({ url: '/ai/question-batch', method: 'put', data })
}

export function deleteAiQuestionBatchById(id: number) {
  return request<boolean>({ url: `/ai/question-batch/${id}`, method: 'delete' })
}

export function fetchAiQuestionVectorPage(data: AiQuestionVectorDTO) {
  return requestPage<AiQuestionVectorVO>({ url: '/ai/question/page', method: 'post', data })
}

export function getAiQuestionVectorById(id: number) {
  return request<AiQuestionVectorVO>({ url: `/ai/question/${id}`, method: 'get' })
}

export function listAiQuestionVector() {
  return request<AiQuestionVectorVO[]>({ url: '/ai/question/list', method: 'get' })
}

export function createAiQuestionVector(data: AiQuestionVector) {
  return request<AiQuestionVectorVO>({ url: '/ai/question', method: 'post', data })
}

export function updateAiQuestionVector(data: AiQuestionVector) {
  return request<AiQuestionVectorVO>({ url: '/ai/question', method: 'put', data })
}

export function deleteAiQuestionVectorById(id: number) {
  return request<boolean>({ url: `/ai/question/${id}`, method: 'delete' })
}

export function generateAiQuestionBatch(data: AiGenerateQuestionDTO) {
  return request<Record<string, unknown>>({ url: '/ai/question/generate', method: 'post', data })
}
