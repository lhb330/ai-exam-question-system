import { request, requestPage } from '@/core/request/http'
import type { SysPermission, SysPermissionDTO, SysPermissionVO } from '@/types'

export function getById(id: number) {
  return request<SysPermissionVO>({ url: `/sys/permission/${id}`, method: 'get' })
}

export function list() {
  return request<SysPermissionVO[]>({ url: '/sys/permission/list', method: 'get' })
}

export function page(params: SysPermissionDTO) {
  return requestPage<SysPermissionVO>({ url: '/sys/permission/page', method: 'get', params })
}

export function create(data: SysPermission) {
  return request<SysPermissionVO>({ url: '/sys/permission', method: 'post', data })
}

export function update(data: SysPermission) {
  return request<SysPermissionVO>({ url: '/sys/permission', method: 'put', data })
}

export function deleteById(id: number) {
  return request<boolean>({ url: `/sys/permission/${id}`, method: 'delete' })
}

export async function fetchPermissionCodes() {
  const permissions = await list()
  return permissions.map((item) => item.permCode)
}
