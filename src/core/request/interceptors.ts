import type { AxiosInstance } from 'axios'
import { ElMessage } from 'element-plus'
import { tokenUtils } from '@/core/auth/token'
import router from '@/router'
import type { ApiResponse } from '@/types'

export function setupInterceptors(http: AxiosInstance): void {
  http.interceptors.request.use((config) => {
    const token = tokenUtils.getToken()
    if (token) {
      config.headers.satoken = token
    }
    return config
  })

  http.interceptors.response.use(
    (response) => {
      const body = response.data as ApiResponse<unknown> & { message?: string }
      if (typeof body?.code === 'number' && body.code !== 0) {
        if (body.code === 40100) {
          ElMessage.error(body.msg || body.message || '未登录')
          tokenUtils.clearToken()
          if (router.currentRoute.value.path !== '/login') {
            void router.replace('/login')
          }
          return Promise.reject(body)
        }

        ElMessage.error(body.msg || body.message || '请求失败')
        return Promise.reject(body)
      }
      return response
    },
    (error) => {
      ElMessage.error(error?.message || '网络异常')
      return Promise.reject(error)
    }
  )
}
