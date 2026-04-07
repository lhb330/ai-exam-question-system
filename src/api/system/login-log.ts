import { request, requestPage } from '@/core/request/http'
import type { SysLoginLog, SysLoginLogDTO, SysLoginLogVO } from '@/types'

export function getById(id: number) {
  return request<SysLoginLogVO>({ url: `/sys/login-log/${id}`, method: 'get' })
}

export function list() {
  return request<SysLoginLogVO[]>({ url: '/sys/login-log/list', method: 'get' })
}

export function page(data: SysLoginLogDTO) {
  return requestPage<SysLoginLogVO>({ url: '/sys/login-log/page', method: 'post', data })
}

export function create(data: SysLoginLog) {
  return request<SysLoginLogVO>({ url: '/sys/login-log', method: 'post', data })
}

export function update(data: SysLoginLog) {
  return request<SysLoginLogVO>({ url: '/sys/login-log', method: 'put', data })
}

export function deleteById(id: number) {
  return request<boolean>({ url: `/sys/login-log/${id}`, method: 'delete' })
}

export function fetchLoginLogPage(params: SysLoginLogDTO) {
  return page(params)
}

