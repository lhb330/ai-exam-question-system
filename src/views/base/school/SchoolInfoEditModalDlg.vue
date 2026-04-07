<template>
  <el-dialog
    v-model="visible"
    :title="viewTitle"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
        <el-form-item label="学校编码" prop="schoolCode">
            <el-input v-model="formData.schoolCode" />
        </el-form-item>
        <el-form-item label="学校名称" prop="schoolName">
            <el-input v-model="formData.schoolName" />
        </el-form-item>
        <el-form-item label="学校类型">
            <el-select v-model="formData.schoolType" placeholder="请选择学校类型" clearable>
            <el-option 
              :label="item.msg" 
              :value="item.code" 
              v-for="item in Object.values(SCHOOL_TYPE_CONST)" 
              :key="item.code" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="父级学校">
            <el-select v-model="formData.parentSchoolId" placeholder="请选择父级学校" filterable remote clearable>
            <el-option :disabled="item.id === formData.id"
              :label="item.schoolName" 
              :value="item.id" 
              v-for="item in parentSchoolList" 
              :key="item.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="省份">
            <el-input v-model="formData.province" />
        </el-form-item>
        <el-form-item label="城市">
            <el-input v-model="formData.city" />
        </el-form-item>
        <el-form-item label="详细地址">
            <el-input type="textarea" :rows="2" v-model="formData.address" />
        </el-form-item>
        <el-form-item label="联系电话">
            <el-input v-model="formData.contactPhone" />
        </el-form-item>
        <el-form-item label="状态">
        <el-select v-model="formData.status">
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
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
import { create, update,parentSchool } from '@/api/base/school'
import type { SchoolInfo, SchoolInfoDTO, SchoolInfoVO} from '@/types'
import { getSchoolList } from '@/hooks/useCommonData'
import {VIEW_EDIT_MODE,STATUS_CONST,SCHOOL_TYPE_CONST} from '@/constants/app'


const emit = defineEmits(['success'])

const visible = ref(false)
const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const formData = ref<SchoolInfo>({} as SchoolInfo)
const viewEditModeRef = ref<string>(VIEW_EDIT_MODE.New)
const viewTitle = ref<string>('新增学校数据')
const parentSchoolList = ref<SchoolInfoVO[]>([])

const formRules = {
  schoolName: [{ required: true, message: '请输入学校名称', trigger: 'blur' }],
  schoolCode: [{ required: true, message: '请输入学校编码', trigger: 'blur' }],
  stageCode: [{ required: true, message: '请选择学段', trigger: 'change' }],
}

// 打开弹窗（新增）
const showNewDlg = () => {
  viewEditModeRef.value = VIEW_EDIT_MODE.New
  viewTitle.value = '新增学校数据'
  formData.value = {
    schoolType: SCHOOL_TYPE_CONST.HEAD.code,
    status: STATUS_CONST.ENABLED.code
  } as SchoolInfo
  visible.value = true
  loadParentSchool()
}

// 打开弹窗(编辑)
const showDlg = (row: SchoolInfo) => {
  viewEditModeRef.value = VIEW_EDIT_MODE.Edit
  viewTitle.value = '编辑学校数据'
  formData.value = { ...row } as SchoolInfo
  visible.value = true
  loadParentSchool()
}

// 关闭
const handleClose = () => {
  visible.value = false
  formRef.value?.clearValidate()
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

const loadParentSchool = async () => {
   parentSchoolList.value = await parentSchool()
}

// ✅ 唯一正确、必须写在这里
defineExpose({showNewDlg, showDlg })
</script>

<style scoped>
.dialog-footer { text-align: right; }
</style>