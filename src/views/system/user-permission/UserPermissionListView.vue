<template>
  <el-card>
    <template #header>
      <div class="header">
        <span>User Permission Management</span>
        <div class="actions">
          <el-button type="primary" @click="openCreate">Add</el-button>
          <el-button :loading="loading" @click="loadData">Refresh</el-button>
        </div>
      </div>
    </template>

    <el-table v-loading="loading" :data="pageData.data" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="userId" label="User ID" width="120" />
      <el-table-column prop="permId" label="Permission ID" width="140" />
      <el-table-column prop="createTime" label="Create Time" min-width="180" />
      <el-table-column label="Actions" width="140" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="openEdit(row)">Edit</el-button>
          <el-button type="danger" link @click="handleDelete(row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="pageData.pageNum"
        v-model:page-size="pageData.pageSize"
        :total="pageData.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>

    <el-dialog v-model="dialogVisible" :title="isEdit ? 'Edit User Permission' : 'Add User Permission'" width="520px">
      <el-form :model="formData" label-width="120px">
        <el-form-item label="User ID"><el-input-number v-model="formData.userId" :min="1" /></el-form-item>
        <el-form-item label="Permission ID"><el-input-number v-model="formData.permId" :min="1" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">Save</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { create, deleteById, page, update } from '@/api/system/user-permission'
import type { PageResult, SysUserPermission, SysUserPermissionDTO, SysUserPermissionVO } from '@/types'

const loading = ref(false)
const submitLoading = ref(false)
const pageData = ref<PageResult<SysUserPermissionVO>>({} as PageResult<SysUserPermissionVO>)
const queryForm = ref<SysUserPermissionDTO>({ pageNum: 1, pageSize: 10 } as SysUserPermissionDTO)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formData = ref<SysUserPermission>({} as SysUserPermission)

async function loadData() {
  loading.value = true
  try {
    pageData.value = await page(queryForm.value)
  } finally {
    loading.value = false
  }
}

function openCreate() {
  isEdit.value = false
  formData.value = {} as SysUserPermission
  dialogVisible.value = true
}

function openEdit(row: SysUserPermissionVO) {
  isEdit.value = true
  formData.value = { ...row } as SysUserPermission
  dialogVisible.value = true
}

async function handleSubmit() {
  submitLoading.value = true
  try {
    if (isEdit.value) await update(formData.value)
    else await create(formData.value)
    ElMessage.success('Success')
    dialogVisible.value = false
    await loadData()
  } finally {
    submitLoading.value = false
  }
}

async function handleDelete(row: SysUserPermissionVO) {
  await ElMessageBox.confirm(`Delete record #${row.id}?`, 'Confirm', { type: 'warning' })
  await deleteById(row.id)
  ElMessage.success('Deleted')
  await loadData()
}

watch(
  [() => pageData.value.pageNum, () => pageData.value.pageSize],
  () => {
    queryForm.value.pageNum = pageData.value.pageNum
    queryForm.value.pageSize = pageData.value.pageSize
    loadData()
  }
)

onMounted(loadData)
</script>

<style scoped>
.header { display: flex; align-items: center; justify-content: space-between; }
.actions { display: flex; gap: 8px; }
.pagination { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>
