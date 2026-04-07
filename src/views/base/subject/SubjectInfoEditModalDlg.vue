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
        <el-form-item label="科目编码" prop="subjectCode">
            <el-input v-model="formData.subjectCode" />
        </el-form-item>
        <el-form-item label="科目名称" prop="subjectName">
            <el-input v-model="formData.subjectName" />
        </el-form-item>
        <el-form-item label="学段" prop="stageCode">
            <el-select v-model="formData.stageCode" placeholder="请选择学段" clearable>
                <el-option 
                :label="item.dictName" 
                :value="item.dictCode" 
                v-for="item in stageDictList" 
                :key="item.id" 
                />
            </el-select>
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
import type { SubjectInfo, SubjectInfoDTO, SubjectInfoVO,DictItemVO } from '@/types'
import { getDictItems,getSchoolList } from '@/hooks/useCommonData'
import {VIEW_EDIT_MODE,STATUS_CONST,STAGE_CODE_CONST,DICT_TYPE_CONST} from '@/constants/app'
import { create, update } from '@/api/base/subject'


const emit = defineEmits(['success'])

const visible = ref(false)
const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const formData = ref<SubjectInfo>({} as SubjectInfo)
const viewEditModeRef = ref<string>(VIEW_EDIT_MODE.New)
const viewTitle = ref<string>('新增科目数据')
const stageDictList = ref<DictItemVO[]>([])

const formRules = {
  subjectName: [{ required: true, message: '请输入科目名称', trigger: 'blur' }],
  subjectCode: [{ required: true, message: '请输入科目编码', trigger: 'blur' }],
  stageCode: [{ required: true, message: '请选择学段', trigger: 'change' }],
}

// 打开弹窗（新增）
const showNewDlg = async () => {
  viewEditModeRef.value = VIEW_EDIT_MODE.New
  viewTitle.value = '新增科目数据'
  formData.value = {
    stageCode: STAGE_CODE_CONST.PRIMARY.code,
    status: STATUS_CONST.ENABLED.code
  } as SubjectInfo
  visible.value = true
  await loadStageDict()
}

// 打开弹窗(编辑)
const showDlg = async (row: SubjectInfo) => {
  viewEditModeRef.value = VIEW_EDIT_MODE.Edit
  viewTitle.value = '编辑科目数据'
  formData.value = { ...row } as SubjectInfo
  visible.value = true
  await loadStageDict()
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

// 获取学段
const loadStageDict = async () => {
  stageDictList.value = await getDictItems(DICT_TYPE_CONST.STAGE.code)
}



// ✅ 唯一正确、必须写在这里
defineExpose({showNewDlg, showDlg })
</script>

<style scoped>
.dialog-footer { text-align: right; }
</style>