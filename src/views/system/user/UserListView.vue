<template>
  <el-card>
    <template #header>
      <div class="header">
        <span>用户管理</span>
        <div class="actions">
          <el-button type="primary" @click="openCreate">新增</el-button>
          <el-button :loading="loading" @click="loadData">刷新</el-button>
        </div>
      </div>
    </template>

    <!-- 查询表单区域 -->
    <div class="query-form">
      <el-form :model="queryForm" inline @submit.prevent="loadData">
        <el-form-item label="登录账号">
          <el-input v-model="queryForm.userAccount" placeholder="请输入登录账号" clearable />
        </el-form-item>

        <el-form-item label="用户姓名">
          <el-input v-model="queryForm.userName" placeholder="请输入用户姓名" clearable />
        </el-form-item>

        <el-form-item label="用户类型">
          <el-select v-model="queryForm.userType" placeholder="请选择用户类型" clearable style="width: 120px">
            <el-option 
              :label="item.dictName" 
              :value="item.dictCode" 
              v-for="item in roleDictList" 
              :key="item.id" 
            />
          </el-select>
        </el-form-item>

        <el-form-item label="所属学校">
          <el-select v-model="queryForm.schoolId" placeholder="请选择所属学校" clearable style="width: 120px">
            <el-option 
              :label="item.schoolName+'-'+item.schoolCode" 
              :value="item.id" 
              v-for="item in schoolList" 
              :key="item.id" 
            />
          </el-select>
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

        <el-form-item label="联系电话">
          <el-input v-model="queryForm.phone" placeholder="请输入联系电话" clearable />
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
      <el-button type="primary" @click="openCreate">新增</el-button>
      <el-button type="warning" @click="resetPwd">重置密码</el-button>
    </div>

    <el-table v-loading="loading" :data="pageData.data" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="userAccount" label="登录账号" min-width="120" />
      <el-table-column prop="userName" label="用户姓名" min-width="90" />
      <el-table-column prop="userType" label="用户类型" min-width="90" >
        <template #default="scope">
          {{ Object.values(USER_TYPE_CONST).find(item => item.value === scope.row.userType)?.msg }}
        </template>
      </el-table-column>
      <el-table-column prop="schoolName" label="所属学校" width="120" />
      <el-table-column prop="stageName" label="学段" min-width="100" />
      <el-table-column prop="gradeAndClass" label="年级班级" min-width="100" />
      <el-table-column prop="phone" label="联系电话" min-width="120" />
      <el-table-column prop="email" label="邮箱" min-width="150" />
      <el-table-column prop="status" label="状态" width="70">
        <template #default="scope">
          <el-tag :type="scope.row.status === STATUS_CONST.ENABLED.code ? 'success' : 'danger'">
            {{scope.row.status === STATUS_CONST.ENABLED.code ? STATUS_CONST.ENABLED.msg : STATUS_CONST.DISABLED.msg}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastLoginTime" label="最近一次登录时间" min-width="160" />
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

    <!-- ✅ 子组件 ref -->
    <user-edit-modal-dlg ref="userEditModalDlgRef" @success="loadData" />

  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deleteUserById, page,resetPassword } from '@/api/system/user'
import { getDictItems,getSchoolList } from '@/hooks/useCommonData'
import {usePagination} from '@/hooks/usePagination'
import type { PageResult, SysUser, SysUserDTO, SysUserVO,DictItemVO,SchoolInfoVO } from '@/types'
import {USER_TYPE_CONST,STATUS_CONST,DICT_TYPE_CONST} from '@/constants/app'
import UserEditModalDlg from './UserEditModalDlg.vue'



const { pageNum, pageSize } = usePagination()

// 定义响应式变量
const loading = ref(false)
const pageData = ref<PageResult<SysUserVO>>({} as PageResult<SysUserVO>)
const queryForm = ref<SysUserDTO>({pageNum: pageNum.value, pageSize: pageSize.value } as SysUserDTO)
const stageDictList = ref<DictItemVO[]>([])
const roleDictList = ref<DictItemVO[]>([])
const schoolList = ref<SchoolInfoVO[]>([])
// ✅ 子组件 ref
const userEditModalDlgRef = ref<any>(null)

// 多选选中数据（类型已修复）
const selectedUsers = ref<SysUserVO[]>([])

// 表格选中事件
const handleSelectionChange = (val: SysUserVO[]) => {
  selectedUsers.value = val
}


// 查询
async function loadData(): Promise<void> {
  loading.value = true
  try {
    const res: PageResult<SysUserVO> = await page(queryForm.value)
    setPageData(res)
  } finally {
    loading.value = false
  }
}

const setPageData = (res: PageResult<SysUserVO>) => {
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
  pageNum.value = 1
  pageSize.value = queryForm.value.pageSize
  queryForm.value = {
    pageNum: 1,
    pageSize: queryForm.value.pageSize,
  } as SysUserDTO
  loadData()
}

// 获取学段
const loadStageDict = async () => {
  stageDictList.value = await getDictItems(DICT_TYPE_CONST.STAGE.code)
}
// 获取角色
const loadRoleDict = async () => {
  roleDictList.value = await getDictItems(DICT_TYPE_CONST.ROLE.code)
}
// 获取学校
const loadSchoolList = async () => {
  schoolList.value = await getSchoolList()
}


// 新增
function openCreate() {
  userEditModalDlgRef.value.showNewDlg()
}
// 编辑
function openEdit(row: SysUser) {
  userEditModalDlgRef.value.showDlg(row)
}
// 重置密码
function resetPwd() {
  handleBatchResetPassword()
}
// 删除
async function handleDelete(row: SysUserVO) {
  await ElMessageBox.confirm(`确认删除用户 ${row.userName} 吗？`, '确认', { type: 'warning' })
  await deleteUserById(row.id)
  ElMessage.success('删除成功')
  loadData()
}

// 分页变化自动查询（官方推荐）
watch(
  () => [queryForm.value.pageNum, queryForm.value.pageSize],
  () => {
    loadData()
  }
)

// 批量重置密码
const handleBatchResetPassword = async () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning('请选择要重置密码的用户')
    return
  }

  if (!selectedUsers.value.length) {
    ElMessage.warning('请先选择要重置密码的用户')
    return
  }

  // 确认框
  try {
    await ElMessageBox.confirm(
      `确定要重置选中的 ${selectedUsers.value.length} 个用户密码吗？\n重置后密码为：123456`,
      '确认重置',
      { type: 'warning' }
    )
  } catch {
    return
  }

  try {
    loading.value = true
    const ids = selectedUsers.value.map(item => item.id)

    await resetPassword(ids)

    ElMessage.success('批量重置密码成功！')
    selectedUsers.value = [] // 重置选中
  } catch (err) {
    ElMessage.error('批量重置失败')
  } finally {
    loading.value = false
  }
}


onMounted(async () => {
  await Promise.all([
    loadStageDict(),
    loadRoleDict(),
    loadSchoolList(),
    loadData()
  ])
})
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
.actions { 
  display: flex; 
  gap: 8px; 
}
.pagination { 
  margin-top: 16px; 
  display: flex; 
  justify-content: flex-start; 
}
</style>
