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
      <el-form-item label="字典类型" prop="dictType">
        <el-input v-model="formData.dictType" />
      </el-form-item>
      <el-form-item label="字典编码" prop="dictCode">
        <el-input v-model="formData.dictCode" />
      </el-form-item>
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model="formData.dictName" />
      </el-form-item>
      <el-form-item label="排序值">
        <el-input-number v-model="formData.sort" :min="0" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status">
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="父级编码">
        <el-input v-model="formData.parentCode" />
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
import type { SysDict } from '@/types'
import {VIEW_EDIT_MODE} from '@/constants/app'
import { create,update } from '@/api/system/dict'


const emit = defineEmits(['success'])

const visible = ref(false)
const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const formData = ref<SysDict>({} as SysDict)
const viewEditModeRef = ref<string>(VIEW_EDIT_MODE.New)
const viewTitle = ref<string>('新增数据字典')

const formRules = {
  dictType: [{ required: true, message: '请输入字典类型', trigger: 'blur' }],
  dictCode: [{ required: true, message: '请输入字典编码', trigger: 'blur' }],
  dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
  //sort: [{ required: true, message: '请输入排序值', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

// 打开弹窗（新增）
const showNewDlg = () => {
  viewEditModeRef.value = VIEW_EDIT_MODE.New
  viewTitle.value = '新增数据字典'
  formData.value = {} as SysDict
  visible.value = true
}

// 打开弹窗(编辑)
const showDlg = (row: SysDict) => {
  viewEditModeRef.value = VIEW_EDIT_MODE.Edit
  viewTitle.value = '编辑数据字典'
  formData.value = { ...row } as SysDict
  visible.value = true
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



// ✅ 唯一正确、必须写在这里
defineExpose({showNewDlg, showDlg })
</script>

<style scoped>
.dialog-footer { text-align: right; }
</style>