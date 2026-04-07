import type { PageRequest } from '@/types/pageRequest'

export interface AiChatMessage {
  id: number
  conversationId: string
  messageType: string
  content: string
  role: string
  createTime: string
  version: number
}
export interface AiChatMessageDTO extends AiChatMessage, PageRequest {}

export interface AiQuestionBatch {
  id: number
  batchNo: string
  creatorId: number
  subjectId: number
  stageCode: string
  gradeCode: string
  kpIds: string
  questionTypeCode: string
  difficultyCode: string
  questionCount: number
  generateStatus: number
  successCount: number
  failCount: number
  errorMsg: string
  createTime: string
  updateTime: string
  version: number
}
export interface AiQuestionBatchDTO extends AiQuestionBatch, PageRequest {}

export interface AiQuestionVector {
  id: number
  questionNo: string
  subjectId: number
  stageCode: string
  gradeId: number
  kpId: number
  questionTypeCode: string
  difficultyCode: string
  content: string
  questionAnalysis: string
  questionAnswer: string
  embedding: string
  creatorId: number
  generateBatchNo: string
  status: number
  createTime: string
  updateTime: string
  version: number
  metadata: string
  questionScore: number
  sourceKbId: number
}
export interface AiQuestionVectorDTO extends AiQuestionVector, PageRequest {
  creatorName: string
}

export type AiChatMessageVO = AiChatMessage
export type AiQuestionBatchVO = AiQuestionBatch
export type AiQuestionVO = AiQuestionVector
export type AiQuestionVectorVO = AiQuestionVector

export interface AiGenerateQuestionDTO {
  conversationId?: string
  creatorId: number
  subjectId: number
  stageCode: string
  gradeCode: string
  gradeId: number | null
  kpId?: number
  kpIds?: string
  knowledgePoint?: string
  questionTypeCode: string
  difficultyCode: string
  questionCount?: number
  extraRequirement?: string
}
