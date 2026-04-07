import { request, requestPage } from '@/core/request/http'
import type { SysUserPermission, SysUserPermissionDTO, SysUserPermissionVO } from '@/types'

export function getById(id: number) {
  return request<SysUserPermissionVO>({ url: `/sys/user-permission/${id}`, method: 'get' })
}

export function list() {
  return request<SysUserPermissionVO[]>({ url: '/sys/user-permission/list', method: 'get' })
}

export function page(params: SysUserPermissionDTO) {
  return requestPage<SysUserPermissionVO>({ url: '/sys/user-permission/page', method: 'get', params })
}

export function create(data: SysUserPermission) {
  return request<SysUserPermissionVO>({ url: '/sys/user-permission', method: 'post', data })
}

export function update(data: SysUserPermission) {
  return request<SysUserPermissionVO>({ url: '/sys/user-permission', method: 'put', data })
}

export function deleteById(id: number) {
  return request<boolean>({ url: `/sys/user-permission/${id}`, method: 'delete' })
}
