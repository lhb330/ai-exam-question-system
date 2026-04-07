export type UserRoleCode = 'system_admin' | 'principal' | 'teacher' | 'student'

export type SchoolStageCode = 'primary' | 'junior' | 'senior'

export interface BaseResponse {
  code: number
  msg: string
}

export interface ApiResponse<T> extends BaseResponse {
  data: T
}

export interface PageQuery {
  pageNum: number
  pageSize: number
}

export interface PageResult<T> extends BaseResponse {
  // 当前页数据列表
  data: T[]
  // 总记录数
  total: number
  // 总页数
  pages: number
  // 当前页码
  pageNum: number
  // 每页条数
  pageSize: number
}

export * from './ai'
export * from './base'
export * from './exam'
export * from './knowledge'
export * from './system'
