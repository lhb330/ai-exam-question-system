import { createRouter, createWebHistory } from 'vue-router'
import { staticRoutes } from './routes'
import { setupRouterGuards } from '@/core/guards'

// Normalize legacy hash URLs like /#/login to clean history URLs.
if (window.location.hash.startsWith('#/')) {
  const normalizedPath = window.location.hash.slice(1)
  window.history.replaceState(null, '', normalizedPath)
}

const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes
})

setupRouterGuards(router)

export default router
