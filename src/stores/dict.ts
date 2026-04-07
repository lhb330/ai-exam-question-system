import { defineStore } from 'pinia'
import { fetchDictItems } from '@/api/system/dict'
import type { DictItemVO } from '@/types'

export const useDictStore = defineStore('dict', {
  state: () => ({
    dictMap: {} as Record<string, DictItemVO[]>
  }),
  actions: {
    async loadDict(dictCode: string) {
      this.dictMap[dictCode] = await fetchDictItems(dictCode)
    }
  }
})
