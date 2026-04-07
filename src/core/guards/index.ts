import type { Router } from 'vue-router'
import { tokenUtils } from '@/core/auth/token'

const WHITE_LIST = ['/login']

export function setupRouterGuards(router: Router): void {
  router.beforeEach((to) => {
    const token = tokenUtils.getToken()
    if (!token && !WHITE_LIST.includes(to.path)) {
      return '/login'
    }
    if (token && to.path === '/login') {
      return '/'
    }
    return true
  })
}
