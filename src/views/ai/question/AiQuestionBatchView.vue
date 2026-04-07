<template>
  <el-card>
    <template #header>
      <div class="header">
        <span>AI Question Batch Management</span>
        <div class="actions">
          <el-button type="primary" @click="openCreate">Add</el-button>
          <el-button :loading="loading" @click="loadData">Refresh</el-button>
        </div>
      </div>
    </template>

    <el-table v-loading="loading" :data="pageData.data" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="batchNo" label="Batch No" min-width="140" />
      <el-table-column prop="subjectId" label="Subject ID" width="100" />
      <el-table-column prop="stageCode" label="Stage" width="100" />
      <el-table-column prop="questionCount" label="Count" width="80" />
      <el-table-column prop="generateStatus" label="Status" width="80" />
      <el-table-column prop="successCount" label="Success" width="80" />
      <el-table-column prop="failCount" label="Fail" width="80" />
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? 'Edit Batch' : 'Add Batch'" width="680px">
      <el-form :model="formData" label-width="140px">
        <el-form-item label="Batch No"><el-input v-model="formData.batchNo" /></el-form-item>
        <el-form-item label="Creator ID"><el-input-number v-model="formData.creatorId" :min="1" /></el-form-item>
        <el-form-item label="Subject ID"><el-input-number v-model="formData.subjectId" :min="1" /></el-form-item>
        <el-form-item label="Stage"><el-input v-model="formData.stageCode" /></el-form-item>
        <el-form-item label="Grade"><el-input v-model="formData.gradeCode" /></el-form-item>
        <el-form-item label="Knowledge IDs"><el-input v-model="formData.kpIds" /></el-form-item>
        <el-form-item label="Question Type"><el-input v-model="formData.questionTypeCode" /></el-form-item>
        <el-form-item label="Difficulty"><el-input v-model="formData.difficultyCode" /></el-form-item>
        <el-form-item label="Question Count"><el-input-number v-model="formData.questionCount" :min="1" /></el-form-item>
        <el-form-item label="Generate Status"><el-input-number v-model="formData.generateStatus" :min="0" /></el-form-item>
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
import {
  createAiQuestionBatch,
  deleteAiQuestionBatchById,
  fetchAiQuestionBatchPage,
  updateAiQuestionBatch
} from '@/api/ai/question'
import type { AiQuestionBatch, AiQuestionBatchDTO, AiQuestionBatchVO, PageResult } from '@/types'

const loading = ref(false)
const submitLoading = ref(false)
const pageData = ref<PageResult<AiQuestionBatchVO>>({} as PageResult<AiQuestionBatchVO>)
const queryForm = ref<AiQuestionBatchDTO>({ pageNum: 1, pageSize: 10 } as AiQuestionBatchDTO)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formData = ref<AiQuestionBatch>({} as AiQuestionBatch)

async function loadData() {
  loading.value = true
  try {
    pageData.value = await fetchAiQuestionBatchPage(queryForm.value)
  } finally {
    loading.value = false
  }
}

function openCreate() {
  isEdit.value = false
  formData.value = { generateStatus: 0, questionCount: 1, successCount: 0, failCount: 0 } as AiQuestionBatch
  dialogVisible.value = true
}

function openEdit(row: AiQuestionBatchVO) {
  isEdit.value = true
  formData.value = { ...row } as AiQuestionBatch
  dialogVisible.value = true
}

async function handleSubmit() {
  submitLoading.value = true
  try {
    if (isEdit.value) await updateAiQuestionBatch(formData.value)
    else await createAiQuestionBatch(formData.value)
    ElMessage.success('Success')
    dialogVisible.value = false
    await loadData()
  } finally {
    submitLoading.value = false
  }
}

async function handleDelete(row: AiQuestionBatchVO) {
  await ElMessageBox.confirm(`Delete batch ${row.batchNo}?`, 'Confirm', { type: 'warning' })
  await deleteAiQuestionBatchById(row.id)
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
