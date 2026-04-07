import type { PageRequest } from '@/types/pageRequest'

export interface SysDict {
  id: number
  dictType: string
  dictCode: string
  dictName: string
  sort: number
  status: number
  parentCode: string
  createTime: string
  updateTime: string
  version: number
}
export interface DictItemDTO extends SysDict,PageRequest {}

export interface SysLoginLog {
  id: number
  userId: number
  loginAccount: string
  loginIp: string
  loginLocation: string
  loginDevice: string
  loginStatus: number
  errorMsg: string
  loginTime: string
  logoutTime: string
  version: number
}
export interface SysLoginLogDTO extends SysLoginLog,PageRequest {}

export interface SysPermission {
  id: number
  permCode: string
  permName: string
  permType: number
  parentPermId: number
  sort: number
  status: number
  createTime: string
  updateTime: string
  version: number
}
export interface SysPermissionDTO extends SysPermission,PageRequest {}

export interface SysUser {
  id: number
  userAccount: string
  userPassword: string
  userName: string
  userType: number
  schoolId: number
  gradeId: number | null
  classesId: number | null
  stageCode: string
  phone: string
  email: string
  avatar: string
  status: number
  lastLoginTime: string
  createTime: string
  updateTime: string
  version: number
}
export interface SysUserDTO extends SysUser,PageRequest {}

export interface AuthUserVO {
  id: number
  userAccount: string
  userName: string
  userType: number
  saToken: string
  expire: number
  userTypeName: string | null
  userRoleName: string
  schoolId: number
  gradeId: number
  classesId: number
  stageCode: string
  avatar: string
  status: number
}

export interface SysUserPermission {
  id: number
  userId: number
  permId: number
  createTime: string
  updateTime: string
  version: number
}
export interface SysUserPermissionDTO extends SysUserPermission,PageRequest {}

export type DictItemVO = SysDict
export type SysLoginLogVO = SysLoginLog
export type SysPermissionVO = SysPermission
export type SysUserVO = SysUser & {stageName:string, schoolName:string , gradeName: string, classesName: string,gradeAndClass: string}
//export type CurrentUserVO = SysUser & { permissionCodes: string[] }
export type SysUserPermissionVO = SysUserPermission
