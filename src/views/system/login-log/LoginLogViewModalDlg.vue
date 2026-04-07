<template>
  <el-dialog v-model="visible" :title="viewTitle" width="720px" :close-on-click-modal="false" @close="handleClose">
    <el-form :model="formData" label-width="120px" disabled>
        <el-form-item label="登录账号">
          <el-input v-model="formData.loginAccount" />
        </el-form-item>
        <el-form-item label="登录IP">
          <el-input v-model="formData.loginIp" />
        </el-form-item>
        <el-form-item label="登录地点">
          <el-input v-model="formData.loginLocation" />
        </el-form-item>
        <el-form-item label="登录设备">
          <el-input v-model="formData.loginDevice" />
        </el-form-item>
        <el-form-item label="登录状态">
          <el-input :value="formData.loginStatus === 1 ? '成功' : '失败'" />
        </el-form-item>
        <el-form-item label="错误信息" v-if="formData.loginStatus === 0">
          <el-input v-model="formData.errorMsg" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item label="登录时间">
          <el-input v-model="formData.loginTime" />
        </el-form-item>
      </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { SysLoginLog, SysLoginLogDTO, SysLoginLogVO } from '@/types'



const emit = defineEmits(['success'])

const visible = ref(false)
const formRef = ref<FormInstance>()
const formData = ref<SysLoginLog>({} as SysLoginLog)
const viewTitle = ref<string>('登录日志信息')


// 打开弹窗(编辑)
const showDlg = async (row: SysLoginLog) => {
  formData.value = { ...row } as SysLoginLog
  visible.value = true
}

// 关闭
const handleClose = () => {
  visible.value = false
  formRef.value?.clearValidate()
}

// ✅ 唯一正确、必须写在这里
defineExpose({showDlg })
</script>

<style scoped>
.dialog-footer { text-align: right; }
</style>