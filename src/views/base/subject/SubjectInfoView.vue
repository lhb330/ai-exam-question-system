<template>
  <el-card>
    <template #header>
      <div class="header">
        <span>科目管理</span>
        <div class="actions">
          <el-button :loading="loading" @click="loadData">刷新</el-button>
        </div>
      </div>
    </template>

    <!-- 查询表单区域 -->
    <div class="query-form">
      <el-form :model="queryForm" inline @submit.prevent="loadData">
        <el-form-item label="科目编码">
          <el-input v-model="queryForm.subjectCode" placeholder="请输入科目编码" clearable />
        </el-form-item>

        <el-form-item label="科目名称">
          <el-input v-model="queryForm.subjectName" placeholder="请输入科目名称" clearable />
        </el-form-item>

        <el-form-item label="学段">
          <el-select v-model="queryForm.stageCode" placeholder="请选择学段" clearable style="width: 120px">
            <el-option 
              :label="item.dictName" 
              :value="item.dictCode" 
              v-for="item in stageDictList" 
              :key="item.id" 
            />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option 
              :label="item.msg" 
              :value="item.code" 
              v-for="item in Object.values(STATUS_CONST)" 
              :key="item.code" 
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="loadData">
            查询
          </el-button>
          <el-button @click="resetQuery">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 👉 在这里加：新增 / 编辑 按钮 -->
    <div class="toolbar-box">
      <el-button type="primary" @click="handleAdd">新增科目</el-button>
    </div>

    <el-table v-loading="loading" :data="pageData.data" border>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="subjectCode" label="科目编码" min-width="140" />
      <el-table-column prop="subjectName" label="科目名称" min-width="180" />
      <el-table-column prop="stageName" label="学段" min-width="120" />
      <el-table-column prop="sort" label="排序值" width="80" />
      <el-table-column prop="status" label="状态" width="70">
        <template #default="scope">
          <el-tag :type="scope.row.status === STATUS_CONST.ENABLED.code ? 'success' : 'danger'">
            {{scope.row.status === STATUS_CONST.ENABLED.code ? STATUS_CONST.ENABLED.msg : STATUS_CONST.DISABLED.msg}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="150" />
      <el-table-column prop="updateTime" label="更新时间" min-width="150" />
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
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

    <subject-info-edit-modal-dlg ref="subjectInfoEditModalDlgRef" @success="loadData" />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deleteById, page } from '@/api/base/subject'
import { getDictItems,getSchoolList } from '@/hooks/useCommonData'
import type { PageResult, SubjectInfoDTO, SubjectInfoVO,DictItemVO } from '@/types'
import {usePagination} from '@/hooks/usePagination'
import {STATUS_CONST,DICT_TYPE_CONST} from '@/constants/app'
import SubjectInfoEditModalDlg from './SubjectInfoEditModalDlg.vue'

const { pageNum, pageSize } = usePagination()

const loading = ref(false)
const pageData = ref<PageResult<SubjectInfoVO>>({} as PageResult<SubjectInfoVO>)
const queryForm = ref<SubjectInfoDTO>({ 
  pageNum: pageNum.value, 
  pageSize: pageSize.value 
} as SubjectInfoDTO)
  // ✅ 子组件 ref
const subjectInfoEditModalDlgRef = ref<any>(null)
const stageDictList = ref<DictItemVO[]>([])

async function loadData() {
  loading.value = true
  try {
    const res:PageResult<SubjectInfoVO> = await page(queryForm.value)
    setPageData(res)
  } finally {
    loading.value = false
  }
}
const setPageData = (res: PageResult<SubjectInfoVO>) => {
  pageData.value.data = res.data
  pageData.value.pageNum = res.pageNum
  pageData.value.pageSize = res.pageSize
  pageData.value.total = res.total
  pageData.value.pages = res.pages
  
  queryForm.value.pageNum = res.pageNum
  queryForm.value.pageSize = res.pageSize
}
const resetQuery = () => {
  queryForm.value = {
    pageNum: pageNum.value,
    pageSize: pageSize.value, 
  } as SubjectInfoDTO
  loadData()
}

function handleAdd() {
  subjectInfoEditModalDlgRef.value.showNewDlg()
}

function openEdit(row: SubjectInfoVO) {
  subjectInfoEditModalDlgRef.value.showDlg(row)
}

async function handleDelete(row: SubjectInfoVO) {
  await ElMessageBox.confirm(
    `确定要删除【${row.subjectName}】吗？删除后将无法恢复！`,
    '删除确认',
    { 
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning' 
    }
  )
  await deleteById(row.id)
  ElMessage.success('删除成功！')
  await loadData()
}

watch(
  [() => queryForm.value.pageNum, queryForm.value.pageSize],
  () => {
    loadData()
  }
)

// 获取学段
const loadStageDict = async () => {
  stageDictList.value = await getDictItems(DICT_TYPE_CONST.STAGE.code)
}

onMounted(async () => {
  await Promise.all([
    loadStageDict(),
    loadData()
  ])
})
</script>

<style scoped>
.header { display: flex; align-items: center; justify-content: space-between; }
.actions { display: flex; gap: 8px; }
.query-form {
  margin-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color);
}
.toolbar-box {
  margin-bottom: 16px;
}
.pagination { margin-top: 16px; display: flex; justify-content: flex-start; }
</style>
