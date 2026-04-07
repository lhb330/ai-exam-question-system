import { defineStore } from 'pinia'
//import {  } from '@/api/system/user'
import type { AuthUserVO } from '@/types'

interface UserState {
  profile?: AuthUserVO
  permissionCodes: string[]
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    profile: undefined,
    permissionCodes: []
  }),
  actions: {
    async loadCurrentUser() {
      /* const profile = await fetchCurrentUser()
      this.profile = profile
      this.permissionCodes = profile.permissionCodes */
    },
    // 新增！！登录成功后直接设置用户（不请求后端）
    setUser(profile: AuthUserVO) {
      this.profile = profile
      //this.permissionCodes = profile.permissionCodes || []
    },
  }
})
