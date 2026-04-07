import { defineStore } from 'pinia'
import type { SchoolStageCode } from '@/types'

export const useStageStore = defineStore('stage', {
  state: () => ({
    currentStage: 'JUNIOR' as SchoolStageCode
  }),
  actions: {
    setStage(stage: SchoolStageCode) {
      this.currentStage = stage
    }
  }
})
