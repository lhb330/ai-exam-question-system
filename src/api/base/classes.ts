import { request, requestPage } from '@/core/request/http'
import type { ClassesInfo, ClassesInfoDTO, ClassesInfoVO } from '@/types'

export function getById(id: number) {
  return request<ClassesInfo>({ url: `/classes/${id}`, method: 'get' })
}

export function list() {
  return request<ClassesInfo[]>({ url: '/classes/list', method: 'get' })
}

export function page(params: ClassesInfoDTO) {
  return requestPage<ClassesInfo>({ url: '/classes/page', method: 'post', params })
}

export function create(data: ClassesInfo) {
  return request<ClassesInfoVO>({ url: '/classes', method: 'post', data })
}

export function update(data: ClassesInfo) {
  return request<ClassesInfo>({ url: '/classes', method: 'put', data })
}

export function deleteById(id: number) {
  return request<boolean>({ url: `/classes/${id}`, method: 'delete' })
}

export function listClassesInfoBySchoolIds(data: Array<number>) {
  return request<ClassesInfo[]>({ url: '/classes/school', method: 'post', data })
}

export function listClassesInfoByGradeIds(data: Array<number>) {
  return request<ClassesInfo[]>({ url: '/classes/grade', method: 'post', data })
}

export function fetchClassesInfos() {
  return list()
}