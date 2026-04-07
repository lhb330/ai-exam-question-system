<template>
  <el-card>
    <template #header>
      <div class="header">
        <span>系统日志</span>
        <div class="actions">
          <el-button :loading="loading" @click="loadData">刷新</el-button>
        </div>
      </div>
    </template>

    <!-- 查询表单区域 -->
    <div class="query-form">
      <el-form :model="queryForm" inline @submit.prevent="loadData">
        <el-form-item label="登录账号">
          <el-input v-model="queryForm.loginAccount" placeholder="请输入登录账号" clearable />
        </el-form-item>

        <el-form-item label="登录设备">
          <el-select v-model="queryForm.loginDevice" placeholder="请选择登录设备" clearable style="width: 120px">
            <el-option 
              :label="item.code" 
              :value="item.code" 
              v-for="item in Object.values(LOGIN_DEVICE_CONST)" 
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

    <el-table v-loading="loading" :data="pageData.data" border>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="loginAccount" label="登录账号" min-width="140" />
      <el-table-column prop="loginIp" label="登录IP" min-width="120" />
      <el-table-column prop="loginDevice" label="登录设备" min-width="120" />
      <el-table-column prop="loginStatus" label="登录状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.loginStatus === 1 ? 'success' : 'danger'">
            {{ scope.row.loginStatus === 1 ? '成功' : '失败' }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="errorMsg" label="描述" min-width="120" />
      <el-table-column prop="loginLocation" label="登录地点" min-width="120" /> -->
      <el-table-column prop="loginTime" label="登录时间" min-width="170" />
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

   
    <login-log-view-modal-dlg ref="loginLogViewModalDlgRef" />

  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { PageResult, SysLoginLog, SysLoginLogDTO, SysLoginLogVO } from '@/types'
import { LOGIN_DEVICE_CONST } from '@/constants/app'
import { page } from '@/api/system/login-log'
import {usePagination} from '@/hooks/usePagination'
import LoginLogViewModalDlg from './LoginLogViewModalDlg.vue'

const { pageNum, pageSize } = usePagination()

const loading = ref(false)
const pageData = ref<PageResult<SysLoginLogVO>>({} as PageResult<SysLoginLogVO>)

// 查询条件（带默认页码）
const queryForm = ref<SysLoginLogDTO>({
  pageNum: pageNum.value, 
  pageSize: pageSize.value
} as SysLoginLogDTO)

  // ✅ 子组件 ref
const loginLogViewModalDlgRef = ref<any>(null)

// 加载数据
async function loadData() {
  loading.value = true
  try {
    const res = await page(queryForm.value)
    setPageData(res)
  } finally {
    loading.value = false
  }
}

// 赋值
const setPageData = (res: PageResult<SysLoginLogVO>) => {
  pageData.value.data = res.data
  pageData.value.total = res.total
  // 同步回显分页
  queryForm.value.pageNum = res.pageNum
  queryForm.value.pageSize = res.pageSize
}

// 重置
const resetQuery = () => {
  queryForm.value = {
    pageNum: 1,
    pageSize: 10
  } as SysLoginLogDTO
  loadData()
}

// 分页监听
watch(
  () => [queryForm.value.pageNum, queryForm.value.pageSize],
  () => loadData()
)

// 打开查看详情
const openView = (row: SysLoginLogVO) => {
  loginLogViewModalDlgRef.value.showDlg(row)
}

onMounted(loadData)
</script>

<style scoped>
.header { display: flex; align-items: center; justify-content: space-between; }
.query-form { margin-bottom: 16px; border-bottom: 1px solid var(--el-border-color); }
.toolbar-box {
  margin-bottom: 16px;
}
.pagination { margin-top: 16px; }
</style>