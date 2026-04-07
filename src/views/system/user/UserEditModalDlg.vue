<template>
  <el-dialog v-model="visible" :title="viewTitle" width="720px" :close-on-click-modal="false" @close="handleClose">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" >
        <el-form-item label="登录账号" prop="userAccount">
            <el-input v-model="formData.userAccount" placeholder="请输入登录账号" />
        </el-form-item>
        <el-form-item label="密码" v-if="isAdd()">
            <el-input v-model="formData.userPassword" show-password placeholder="不填写时默认密码:123456" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
            <el-input v-model="formData.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
            <el-select v-model="formData.userType" placeholder="请选择用户类型" clearable>
                <el-option 
                :label="item.dictName" 
                :value="item.dictCode" 
                v-for="item in roleDictList" 
                :key="item.id" 
                />
            </el-select>
        </el-form-item>
        <el-form-item label="学校" prop="schoolId">
            <el-select v-model="formData.schoolId" @change="schoolIdChange" placeholder="请选择所属学校" clearable>
                <el-option 
                :label="item.schoolName+'-'+item.schoolCode" 
                :value="item.id" 
                v-for="item in schoolList" 
                :key="item.id" 
                />
            </el-select>
        </el-form-item>
        <el-form-item label="年级">
            <el-select v-model="formData.gradeId" @change="gradeIdChange" placeholder="请选择年级" clearable>
                <el-option 
                :label="item.gradeName+'-'+item.gradeCode" 
                :value="item.id" 
                v-for="item in gradeInfoList" 
                :key="item.id" 
                />
            </el-select>
        </el-form-item>
        <el-form-item label="班级">
            <el-select v-model="formData.classesId" @change="classesIdChange" placeholder="请选择班级" clearable>
                <el-option 
                :label="item.className+'-'+item.classCode" 
                :value="item.id" 
                v-for="item in classesInfoList" 
                :key="item.id" 
                />
            </el-select>
        </el-form-item>
        <el-form-item label="学段">
            <el-select v-model="formData.stageCode" placeholder="请选择学段" clearable>
                <el-option 
                :label="item.dictName" 
                :value="item.dictCode" 
                v-for="item in stageDictList" 
                :key="item.id" 
                />
            </el-select>
        </el-form-item>
        <el-form-item label="联系号码">
            <el-input v-model="formData.phone" placeholder="请输入联系号码" />
        </el-form-item>
        <el-form-item label="邮箱">
            <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="状态">
            <el-select v-model="formData.status" placeholder="请选择状态" clearable>
                <el-option 
                :label="item.msg" 
                :value="item.code" 
                v-for="item in Object.values(STATUS_CONST)" 
                :key="item.code" 
                />
            </el-select>
        </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { getDictItems,getSchoolList } from '@/hooks/useCommonData'
import type { SysUser,DictItemVO,SchoolInfoVO,GradeInfo,ClassesInfo } from '@/types'
import {VIEW_EDIT_MODE} from '@/constants/app'
import {USER_TYPE_CONST,STATUS_CONST,DICT_TYPE_CONST} from '@/constants/app'
import { create,update } from '@/api/system/user'
import {listGradeInfoBySchoolId} from '@/api/base/grade'
import {listClassesInfoByGradeIds} from '@/api/base/classes'



const emit = defineEmits(['success'])

const visible = ref(false)
const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const formData = ref<SysUser>({
    status: STATUS_CONST.ENABLED.code
} as SysUser)
const viewEditModeRef = ref<string>(VIEW_EDIT_MODE.New)
const viewTitle = ref<string>('新增用户数据')
const schoolList = ref<SchoolInfoVO[]>([])
const stageDictList = ref<DictItemVO[]>([])
const roleDictList = ref<DictItemVO[]>([])
const gradeInfoList = ref<GradeInfo[]>([])
const classesInfoList = ref<ClassesInfo[]>([])

const formRules = {
  userAccount: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
  userName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
  userType: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
  //sort: [{ required: true, message: '请输入排序值', trigger: 'blur' }],
  schoolId: [{ required: true, message: '请选择所属学校', trigger: 'change' }],
}

// 打开弹窗（新增）
const showNewDlg = async () => {
  viewEditModeRef.value = VIEW_EDIT_MODE.New
  viewTitle.value = '新增用户数据'
  formData.value = {
    status: STATUS_CONST.ENABLED.code
  } as SysUser
  visible.value = true
  loadRoleDict()
  loadStageDict()
  loadSchoolList()
}

// 打开弹窗(编辑)
const showDlg = async (row: SysUser) => {
  viewEditModeRef.value = VIEW_EDIT_MODE.Edit
  viewTitle.value = '编辑用户数据'
  formData.value = { ...row } as SysUser
  visible.value = true
  await loadRoleDict()
  await loadStageDict()
  await loadSchoolList()
  await loadGradeList(formData.value.schoolId)
  await loadClassesList(formData.value.gradeId)
  
}

// 关闭
const handleClose = () => {
  visible.value = false
  formRef.value?.clearValidate()
  roleDictList.value = []
  schoolList.value= []
  stageDictList.value = []
  gradeInfoList.value = []
  classesInfoList.value = []
}

// 编辑 or 新增
const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  try {
    submitLoading.value = true
    if (viewEditModeRef.value === VIEW_EDIT_MODE.New) {
      // 调用新增接口
      await create(formData.value)
      ElMessage.success('新增成功')
    } else {
      // 调用编辑接口
      await update(formData.value)
      ElMessage.success('修改成功')
    }
    handleClose()
    emit('success')
  } catch (e) {
    const msg = viewEditModeRef.value === VIEW_EDIT_MODE.New ? '新增失败' : '修改失败'
    ElMessage.error(msg)
  } finally {
    submitLoading.value = false
  }
}

// 获取角色
const loadRoleDict = async () => {
  roleDictList.value = await getDictItems(DICT_TYPE_CONST.ROLE.code)
}
// 获取学段
const loadStageDict = async () => {
  stageDictList.value = await getDictItems(DICT_TYPE_CONST.STAGE.code)
}
// 获取学校
const loadSchoolList = async () => {
  schoolList.value = await getSchoolList()
}
// 获取年级
const loadGradeList = async (id: number) => {
    if(!id) {
        gradeInfoList.value = []
        classesInfoList.value = []
        formData.value.gradeId = null
        formData.value.classesId = null
        return
    }
  gradeInfoList.value = await listGradeInfoBySchoolId(id)
}
// 获取班级
const loadClassesList = async (gradeId: number | null | undefined) => {
    console.log('gradeId==',gradeId)
    if(!gradeId) {
        classesInfoList.value = []
        formData.value.classesId = null
        return
    }
  classesInfoList.value = await listClassesInfoByGradeIds([gradeId])
}

const isAdd = () => {
    return VIEW_EDIT_MODE.New === viewEditModeRef.value
}

const schoolIdChange = async (id: number) => {
    console.log('学校===',id)
    await loadGradeList(id)
}

const gradeIdChange = async (id: number) => {
    console.log('年级===',id)
    await loadClassesList(id)
}

const classesIdChange = async (id: number) => {
    console.log('班级===',id)
}


// ✅ 唯一正确、必须写在这里
defineExpose({showNewDlg, showDlg })
</script>

<style scoped>
.dialog-footer { text-align: right; }
</style>