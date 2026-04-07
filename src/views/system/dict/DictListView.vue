<template>
  <el-card>
    <template #header>
      <div class="header">
        <span>数据字典</span>
        <el-button :loading="loading" @click="loadData">刷新</el-button>
      </div>
    </template>

    <!-- 查询表单区域 -->
    <div class="query-form">
      <el-form :model="queryForm" inline @submit.prevent="loadData">
        <el-form-item label="字典类型">
          <el-input v-model="queryForm.dictType" placeholder="请输入字典类型" clearable />
        </el-form-item>

        <el-form-item label="字典编码">
          <el-input v-model="queryForm.dictCode" placeholder="请输入字典编码" clearable />
        </el-form-item>

        <el-form-item label="字典名称">
          <el-input v-model="queryForm.dictName" placeholder="请输入字典名称" clearable />
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
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </div>

    <el-table v-loading="loading" :data="pageData.data" height="330" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="dictType" label="字典类型" min-width="120" />
      <el-table-column prop="dictCode" label="字典编码" min-width="120" />
      <el-table-column prop="dictName" label="字典名称" min-width="120" />
      <el-table-column prop="sort" label="排序值" min-width="70" />
      <el-table-column prop="status" label="状态" width="70">
        <template #default="scope">
          <el-tag :type="scope.row.status === STATUS_CONST.ENABLED.code ? 'success' : 'danger'">
            {{scope.row.status === STATUS_CONST.ENABLED.code ? STATUS_CONST.ENABLED.msg : STATUS_CONST.DISABLED.msg}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="parentCode" label="父级字典编码" min-width="120" />
      <el-table-column prop="createTime" label="创建时间" min-width="150" />
      <el-table-column prop="updateTime" label="更新时间" min-width="150" />
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button type="primary" link size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" link size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="queryForm.pageNum"
        v-model:page-size="queryForm.pageSize"
        :total="pageData.total"
        :page-sizes="[10, 20, 50, 100,200]"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>

    <!-- ✅ 子组件 ref -->
    <dict-edit-modal-dlg ref="dictEditModalDlgRef" @success="loadData"/>

  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref ,watch } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { page,deleteById  } from '@/api/system/dict'
import type { DictItemVO,PageResult,DictItemDTO,SysDict } from '@/types'
import {usePagination} from '@/hooks/usePagination'
import {STATUS_CONST} from '@/constants/app'
import DictEditModalDlg from './DictEditModalDlg.vue'

const { pageNum, pageSize } = usePagination()


const loading = ref(false)
const pageData = ref<PageResult<DictItemVO>>({} as PageResult<DictItemVO>)
// 初始化查询条件
const queryForm = ref<DictItemDTO>({
  pageNum: pageNum.value, 
  pageSize: pageSize.value
} as DictItemDTO)
// ✅ 子组件 ref
const dictEditModalDlgRef = ref<any>(null)


// ====================== 查询列表 ======================
async function loadData(): Promise<void> {
  loading.value = true
  try {
    const res: PageResult<DictItemVO> = await page(queryForm.value)
    setPageData(res)
  } finally {
    loading.value = false
  }
}

const setPageData = (res: PageResult<DictItemVO>) => {
  pageData.value.data = res.data
  pageData.value.pageNum = res.pageNum
  pageData.value.pageSize = res.pageSize
  pageData.value.total = res.total
  pageData.value.pages = res.pages
  
  queryForm.value.pageNum = res.pageNum
  queryForm.value.pageSize = res.pageSize
}

// ====================== 重置查询 ======================
const resetQuery = () => {
  queryForm.value = {
    pageNum: 1,
    pageSize: 10, 
  } as DictItemDTO
  loadData()
}

// ====================== 监听分页变化自动查询 ======================
// 分页变化自动查询（官方推荐）
watch(
  () => [queryForm.value.pageNum, queryForm.value.pageSize],
  () => {
    loadData()
  }
)

// ====================== 新增 ======================
const handleAdd = () => {
  dictEditModalDlgRef.value?.showNewDlg()
}

// ====================== 编辑 ======================
const handleEdit = (row: SysDict) => {
  dictEditModalDlgRef.value?.showDlg(row)
}

// ====================== 删除 ======================
const handleDelete = async (row: DictItemVO) => {
  try {
    // 弹出确认框
    await ElMessageBox.confirm(
      `确定要删除【${row.dictName}】吗？删除后将无法恢复，请谨慎操作！`,
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    // 调用后端删除接口
    await deleteById(row.id)
    
    // 提示成功 + 刷新表格
    ElMessage.success('删除成功！')
    loadData()
  } catch (error) { }
}

onMounted(loadData)
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.query-form {
  margin-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color);
}
.toolbar-box {
  margin-bottom: 16px;
}
.pagination {
  margin-top: 16px;
/*   text-align: right; */
  display: flex; 
  justify-content: flex-start;
}
</style>
