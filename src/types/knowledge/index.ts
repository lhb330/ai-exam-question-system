import type { PageRequest } from '@/types/pageRequest'

export interface KnowledgeBase {
  id: number
  kbName: string
  kbType: string
  subjectId: number
  stageCode: string
  fileName: string
  filePath: string
  fileSize: number
  content: string
  embedding: string
  creatorId: number
  status: number
  createTime: string
  updateTime: string
  version: number
  metadata: string
}
export interface KnowledgeBaseDTO extends KnowledgeBase, PageRequest {}
export type KnowledgeBaseVO = KnowledgeBase

export interface KnowledgePoint {
  id: number
  kpCode: string
  kpName: string
  subjectId: number
  parentKpId: number
  stageCode: string
  sort: number
  status: number
  createTime: string
  updateTime: string
  version: number
}

export interface KnowledgePointDTO extends KnowledgePoint, PageRequest {
  subjectName: string
}
export type KnowledgePointVO = KnowledgePoint & { 
  stageName: string,
  subjectName: string,
  parentKpName: string
}
