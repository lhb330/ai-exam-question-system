<template>
  <el-card>
    <template #header>
      <div class="header">
        <span>记录用户与ai对话信息</span>
        <div class="actions">
          <el-button :loading="loading" @click="loadData">刷新</el-button>
        </div>
      </div>
    </template>

    <el-table v-loading="loading" :data="pageData.data" border>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="conversationId" label="对话id" min-width="180" />
      <el-table-column prop="messageType" label="消息类型" width="120" />
      <el-table-column prop="role" label="角色" width="100" />
      <el-table-column prop="content" label="消息内容" min-width="260" />
      <el-table-column prop="createTime" label="创建时间" min-width="170" />
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openView(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="queryForm.pageNum"
        v-model:page-size="queryForm.pageSize"
        :total="pageData.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>

    <el-dialog v-model="dialogVisible" title="ai对话信息" width="680px">
      <el-form :model="formData" label-width="120px" disabled>
        <el-form-item label="对话id"><el-input v-model="formData.conversationId" /></el-form-item>
        <el-form-item label="消息类型"><el-input v-model="formData.messageType" /></el-form-item>
        <el-form-item label="角色"><el-input v-model="formData.role" /></el-form-item>
        <el-form-item label="消息内容"><el-input v-model="formData.content" type="textarea" :rows="10" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { page } from '@/api/ai/chat'
import type { AiChatMessage, AiChatMessageDTO, AiChatMessageVO, PageResult } from '@/types'
import {usePagination} from '@/hooks/usePagination'

const { pageNum, pageSize } = usePagination()

const loading = ref(false)
const pageData = ref<PageResult<AiChatMessageVO>>({} as PageResult<AiChatMessageVO>)
const queryForm = ref<AiChatMessageDTO>({ pageNum: pageNum.value, pageSize: pageSize.value } as AiChatMessageDTO)
const dialogVisible = ref(false)
const formData = ref<AiChatMessage>({} as AiChatMessage)

async function loadData() {
  loading.value = true
  try {
    pageData.value = await page(queryForm.value)
  } finally {
    loading.value = false
  }
}

function openView(row: AiChatMessageVO) {
  formData.value = { ...row } as AiChatMessage
  dialogVisible.value = true
}

watch(
  () => [queryForm.value.pageNum, queryForm.value.pageSize],
  () => {
    loadData()
  }
)

onMounted(loadData)
</script>

<style scoped>
.header { display: flex; align-items: center; justify-content: space-between; }
.actions { display: flex; gap: 8px; }
.pagination { margin-top: 16px; display: flex; justify-content: flex-start; }
</style>
