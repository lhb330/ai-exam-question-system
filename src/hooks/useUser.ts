import { useUserStore } from '@/stores/user'
import type { AuthUserVO } from '@/types'

/**
 * 全局用户信息 Hook
 */
export function useUser(): AuthUserVO {
  const userStore = useUserStore()
  // 返回用户信息，没有就返回空对象
  return userStore.profile || ({} as AuthUserVO)
}