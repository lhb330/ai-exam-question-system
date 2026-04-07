import type { App, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/user'
import { hasPermission } from '@/core/auth/permission'

function mountPermission(el: HTMLElement, binding: DirectiveBinding<string>) {
  const permissionCode = binding.value
  const userStore = useUserStore()
  if (!permissionCode) return
  if (!hasPermission(userStore.permissionCodes, permissionCode)) {
    el.parentNode?.removeChild(el)
  }
}

export function setupPermissionDirective(app: App): void {
  app.directive('permission', {
    mounted: mountPermission
  })
}
