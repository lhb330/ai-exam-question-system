import { fetchAiQuestionVectorPage } from '@/api/ai/question'
import type { AiQuestionVectorDTO, AiQuestionVectorVO } from '@/types'

export type ExamQuestionVO = AiQuestionVectorVO

export function fetchQuestionBankPage(params: AiQuestionVectorDTO) {
  return fetchAiQuestionVectorPage(params)
}
