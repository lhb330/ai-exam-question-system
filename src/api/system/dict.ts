import { request,requestPage } from '@/core/request/http'
import type { DictItemVO,DictItemDTO, SysDict } from '@/types'

export function fetchDictItems(dictCode: string) {
  return request<DictItemVO[]>({ url: `/sys/dict/dictType/${dictCode}`, method: 'get' })
}

export function getById(id: number) {
  return request<DictItemVO>({ url: `/sys/dict/${id}`, method: 'get' })
}

export function list() {
  return request<DictItemVO>({ url: `/sys/dict/list`, method: 'get' })
}

export function page(dictItemDTO: DictItemDTO) {
  return requestPage<DictItemVO>({ url: `/sys/dict/page`, method: 'post',data: dictItemDTO })
}

export function create(dictItemDTO: SysDict) {
  return request<string>({ url: `/sys/dict`, method: 'post',data: dictItemDTO })
}

export function update(dictItemDTO: SysDict) {
  return request<string>({ url: `/sys/dict`, method: 'put',data: dictItemDTO })
}

export function deleteById(id: number) {
  return request<string>({ url: `/sys/dict/${id}`, method: 'delete' })
}