import { request, requestPage } from '@/core/request/http'
import type { SubjectInfo, SubjectInfoDTO, SubjectInfoVO,SubjectGroupVO } from '@/types'

export function getById(id: number) {
  return request<SubjectInfoVO>({ url: `/subject/${id}`, method: 'get' })
}

export function list() {
  return request<SubjectInfoVO[]>({ url: '/subject/list', method: 'get' })
}

export function page(data: SubjectInfoDTO) {
  return requestPage<SubjectInfoVO>({ url: '/subject/page', method: 'post', data })
}

export function create(data: SubjectInfo) {
  return request<SubjectInfoVO>({ url: '/subject', method: 'post', data })
}

export function update(data: SubjectInfo) {
  return request<SubjectInfoVO>({ url: '/subject', method: 'put', data })
}

export function deleteById(id: number) {
  return request<boolean>({ url: `/subject/${id}`, method: 'delete' })
}

export function fetchSubjects() {
  return list()
}

export function getSubjectGroup() {
  return request<SubjectGroupVO[]>({ url: `/subject/group`, method: 'get' })
}