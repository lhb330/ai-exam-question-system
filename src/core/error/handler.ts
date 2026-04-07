import { ElMessage } from 'element-plus'

export function setupGlobalErrorHandler(): void {
  window.addEventListener('unhandledrejection', (event) => {
    ElMessage.error((event.reason as Error)?.message ?? '发生未知错误')
  })
}
