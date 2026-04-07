import { request, requestPage } from '@/core/request/http'
import type { GradeInfo, GradeInfoDTO, GradeInfoVO,GradeInfoGroupVO } from '@/types'

export function getById(id: number) {
  return request<GradeInfo>({ url: `/grade/${id}`, method: 'get' })
}

export function list() {
  return request<GradeInfoVO[]>({ url: '/grade/list', method: 'get' })
}

export function page(data: GradeInfoDTO) {
  return requestPage<GradeInfoVO>({ url: '/grade/page', method: 'post', data })
}

export function create(data: GradeInfo) {
  return request<string>({ url: '/grade', method: 'post', data })
}

export function update(data: GradeInfo) {
  return request<string>({ url: '/grade', method: 'put', data })
}

export function deleteById(id: number) {
  return request<string>({ url: `/grade/${id}`, method: 'delete' })
}

export function listGradeInfoBySchoolId(schoolId: number) {
  return request<GradeInfo[]>({ url: `/grade/school/${schoolId}`, method: 'get' })
}

export function listGradeInfoBySchoolIds(data: Array<number>) {
  return request<GradeInfo[]>({ url: `/grade/school/schoolIds`, method: 'post', data })
}

export function fetchGradeInfos() {
  return list()
}

export function listGradeInfoGroup() {
  return request<GradeInfoGroupVO[]>({ url: `/grade/group`, method: 'get' })
}