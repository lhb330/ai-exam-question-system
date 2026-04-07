import { fetchDictItems } from '@/api/system/dict'
import { fetchSchools } from '@/api/base/school'
import {getSubjectGroup} from '@/api/base/subject'
import { listGradeInfoGroup } from '@/api/base/grade'
import {fetchKnowledgePoints } from '@/api/knowledge/point'
import type { DictItemVO, SchoolInfoVO,SubjectGroupVO,GradeInfoGroupVO,KnowledgePointVO } from '@/types'

/**
 * 通用获取字典项
 * @param dictType 字典类型
 * @returns DictItemVO[]
 */
export async function getDictItems(dictType: string): Promise<DictItemVO[]> {
  try {
    const res = await fetchDictItems(dictType)
    return res || []
  } catch (err) {
    console.error('获取字典失败 →', dictType, err)
    return []
  }
}

/**
 * 获取学校列表
 * @returns SchoolInfoVO[]
 */
export async function getSchoolList(): Promise<SchoolInfoVO[]> {
  try {
    const res = await fetchSchools()
    return res || []
  } catch (err) {
    console.error('获取学校列表失败 →', err)
    return []
  }
}

/**
 * 获取科目列表
 * @returns SubjectGroupVO[]
 */
export async function getSubjectGroupList(): Promise<SubjectGroupVO[]> {
  try {
    const res = await getSubjectGroup()
    return res || []
  } catch (err) {
    console.error('获取科目列表 →', err)
    return []
  }
}

/**
 * 获取年级列表
 * 父级： 学校
 * 子集: 年级
 * @returns GradeInfoGroupVO[]
 */
export async function getGradeInfoGroupList(): Promise<GradeInfoGroupVO[]> {
  try {
    const res = await listGradeInfoGroup()
    return res || []
  } catch (err) {
    console.error('获取年级列表 →', err)
    return []
  }
}

/**
 * 获取知识点列表
 * @returns KnowledgePointVO[]
 */
export async function getKnowledgePointList(): Promise<KnowledgePointVO[]> {
  try {
    const res = await fetchKnowledgePoints()
    return res || []
  } catch (err) {
    console.error('获取知识点列表 →', err)
    return []
  }
}