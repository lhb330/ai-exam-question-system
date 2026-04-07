<template>
  <el-card>
    <template #header>
      <div class="header">
        <span>Knowledge Base Vector Management</span>
        <div class="actions">
          <el-button type="primary" @click="openCreate">Add</el-button>
          <el-button :loading="loading" @click="loadData">Refresh</el-button>
        </div>
      </div>
    </template>

    <el-table v-loading="loading" :data="pageData.data" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="kbName" label="Name" min-width="180" />
      <el-table-column prop="kbType" label="Type" min-width="120" />
      <el-table-column prop="subjectId" label="Subject ID" width="110" />
      <el-table-column prop="stageCode" label="Stage" width="120" />
      <el-table-column prop="fileName" label="File Name" min-width="180" />
      <el-table-column prop="status" label="Status" width="80" />
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? 'Edit Knowledge Base' : 'Add Knowledge Base'" width="720px">
      <el-form :model="formData" label-width="120px">
        <el-form-item label="Name"><el-input v-model="formData.kbName" /></el-form-item>
        <el-form-item label="Type"><el-input v-model="formData.kbType" /></el-form-item>
        <el-form-item label="Subject ID"><el-input-number v-model="formData.subjectId" :min="1" /></el-form-item>
        <el-form-item label="Stage"><el-input v-model="formData.stageCode" /></el-form-item>
        <el-form-item label="File Name"><el-input v-model="formData.fileName" /></el-form-item>
        <el-form-item label="File Path"><el-input v-model="formData.filePath" /></el-form-item>
        <el-form-item label="File Size"><el-input-number v-model="formData.fileSize" :min="0" /></el-form-item>
        <el-form-item label="Content"><el-input v-model="formData.content" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="Embedding"><el-input v-model="formData.embedding" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="Creator ID"><el-input-number v-model="formData.creatorId" :min="1" /></el-form-item>
        <el-form-item label="Status"><el-input-number v-model="formData.status" :min="0" /></el-form-item>
        <el-form-item label="Metadata"><el-input v-model="formData.metadata" type="textarea" :rows="2" /></el-form-item>
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
import { create, deleteById, page, update } from '@/api/knowledge/base'
import type { KnowledgeBaseVector, KnowledgeBaseVectorDTO, KnowledgeBaseVectorVO, PageResult } from '@/types'

const loading = ref(false)
const submitLoading = ref(false)
const pageData = ref<PageResult<KnowledgeBaseVectorVO>>({} as PageResult<KnowledgeBaseVectorVO>)
const queryForm = ref<KnowledgeBaseVectorDTO>({ pageNum: 1, pageSize: 10 } as KnowledgeBaseVectorDTO)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formData = ref<KnowledgeBaseVector>({} as KnowledgeBaseVector)

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
  formData.value = { status: 1 } as KnowledgeBaseVector
  dialogVisible.value = true
}

function openEdit(row: KnowledgeBaseVectorVO) {
  isEdit.value = true
  formData.value = { ...row } as KnowledgeBaseVector
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

async function handleDelete(row: KnowledgeBaseVectorVO) {
  await ElMessageBox.confirm(`Delete record ${row.kbName}?`, 'Confirm', { type: 'warning' })
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
