import { defineStore } from 'pinia'
import { fetchPermissionCodes } from '@/api/system/permission'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    codes: [] as string[]
  }),
  actions: {
    async loadCodes() {
      this.codes = await fetchPermissionCodes()
    }
  }
})
