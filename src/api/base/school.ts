import { request, requestPage } from '@/core/request/http'
import type { SchoolInfo, SchoolInfoDTO, SchoolInfoVO } from '@/types'

export function getById(id: number) {
  return request<SchoolInfoVO>({ url: `/school/${id}`, method: 'get' })
}

export function list() {
  return request<SchoolInfoVO[]>({ url: '/school/list', method: 'get' })
}

export function page(data: SchoolInfoDTO) {
  return requestPage<SchoolInfoVO>({ url: '/school/page', method: 'post', data })
}

export function create(data: SchoolInfo) {
  return request<SchoolInfoVO>({ url: '/school', method: 'post', data })
}

export function update(data: SchoolInfo) {
  return request<SchoolInfoVO>({ url: '/school', method: 'put', data })
}

export function deleteById(id: number) {
  return request<boolean>({ url: `/school/${id}`, method: 'delete' })
}

export function parentSchool() {
  return request<SchoolInfoVO[]>({ url: '/school/parent', method: 'get' })
}

export function childSchool(data: Array<number>) {
  return request<SchoolInfoVO[]>({ url: '/school/child', method: 'post',data })
}

export function fetchSchools() {
  return list()
}
