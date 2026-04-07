import type { PageRequest } from '@/types/pageRequest'

export interface SchoolInfo {
  id: number
  schoolCode: string
  schoolName: string
  schoolType: number
  parentSchoolId: number | null
  province: string
  city: string
  address: string
  contactPhone: string
  status: number
  createTime: string
  updateTime: string
  version: number
}
export interface SchoolInfoDTO extends SchoolInfo, PageRequest {}
export type SchoolInfoVO = SchoolInfo

export interface SubjectInfo {
  id: number
  subjectCode: string
  subjectName: string
  stageCode: string
  sort: number
  status: number
  createTime: string
  updateTime: string
  version: number
}
export interface SubjectInfoDTO extends SubjectInfo, PageRequest {}
export type SubjectInfoVO = SubjectInfo

export interface SubjectGroupVO {
  id: number
  subjectName: string
  parentId: number
  parentSubjectCode: string
  stageCode: string
  stageName: string
  sort: number
  childList: Array<SubjectGroupVO>
}


export interface GradeInfo {
  id: number
  gradeCode: string
  gradeName: string
  schoolId: number
  status: number
  createTime: string
  updateTime: string
  version: number
}
export interface GradeInfoDTO extends GradeInfo, PageRequest {}
export type GradeInfoVO = GradeInfo

export interface GradeInfoGroupVO {
  id: number
  gradeCode: string
  gradeName: string
  childList: Array<GradeInfoGroupVO>
}

export interface ClassesInfo {
  id: number
  classCode: string
  className: string
  gradeId: number
  schoolId: number
  status: number
  createTime: string
  updateTime: string
  version: number
}
export interface ClassesInfoDTO extends ClassesInfo, PageRequest {}
export type ClassesInfoVO = ClassesInfo
