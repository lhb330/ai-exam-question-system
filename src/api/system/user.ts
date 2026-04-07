import { request, requestPage } from '@/core/request/http'
import type { SysUser, SysUserDTO, SysUserVO,AuthUserVO } from '@/types'

export interface LoginDTO {
  id?: number
  userAccount: string
  userPassword: string
}


export function login(data: LoginDTO) {
  return request<AuthUserVO>({ url: '/auth/login', method: 'post', data })
}

export function logout(data: LoginDTO) {
  return request<string>({ url: '/auth/logout', method: 'post', data })
}

export function fetchUserById(id: number) {
  return request<SysUserVO>({ url: `/sys/user/${id}`, method: 'get' })
}

export function page(data: SysUserDTO) {
  return requestPage<SysUserVO>({ url: '/sys/user/page', method: 'post', data })
}

export function listUser() {
  return request<SysUserVO[]>({ url: '/sys/user/list', method: 'get' })
}

export function create(data: SysUser) {
  return request<string>({ url: '/sys/user', method: 'post', data })
}

export function update(data: SysUser) {
  return request<string>({ url: '/sys/user', method: 'put', data })
}

export function deleteUserById(id: number) {
  return request<string>({ url: `/sys/user/${id}`, method: 'delete' })
}

export function resetPassword(userIds: Array<number>) {
  return request<boolean>({ url: `/sys/user/reset-password`, method: 'post' ,data: userIds})
}

