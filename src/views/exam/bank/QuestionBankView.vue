<template>
  <el-card>
    <template #header>
      <div class="header">
        <span>题目列表</span>
        <div class="actions">
          <el-button type="primary" @click="openCreate">新增</el-button>
          <el-button :loading="loading" @click="loadData">刷新</el-button>
        </div>
      </div>
    </template>

    <!-- 查询表单区域 -->
    <div class="query-form">
      <el-form :model="queryForm" inline @submit.prevent="loadData">
        <!-- <el-form-item label="学校编码">
          <el-input v-model="queryForm.schoolCode" placeholder="请输入学校编码" clearable />
        </el-form-item> -->

        <el-form-item label="科目">
          <el-select v-model="formData.subjectId" placeholder="请选择科目" filterable remote clearable style="width: 160px">
            <el-option-group
              v-for="group in subjectGroupList"
              :key="group.stageCode"
              :label="group.subjectName"
            >
              <el-option
                v-for="item in group.childList"
                :key="item.id"
                :label="item.subjectName"
                :value="item.id"
              />
            </el-option-group>
          </el-select>
        </el-form-item>

        <el-form-item label="年级">
          <el-select v-model="queryForm.gradeId" placeholder="请选择年级" filterable remote clearable style="width: 160px">
            <el-option-group
              v-for="group in gradeGroupList"
              :key="group.id"
              :label="group.gradeName + ' - '+group.gradeCode"
            >
              <el-option
                v-for="item in group.childList"
                :key="item.id"
                :label="item.gradeName + ' - '+item.gradeCode"
                :value="item.id"
              />
            </el-option-group>
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

    <div class="toolbar-box">
      <el-button type="primary" @click="openCreate">新增题目</el-button>
    </div>

    <el-table v-loading="loading" :data="pageData.data" border>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="questionNo" label="题目编号" min-width="150" />
      <el-table-column prop="subjectName" label="科目" width="100" />
      <el-table-column prop="stageCode" label="学段" width="100" >
        <template #default="scope">
          {{ Object.values(STAGE_CODE_CONST).find(item => item.code === scope.row.stageCode)?.msg }}
        </template>
      </el-table-column>
      <el-table-column prop="gradeName" label="年级" width="100" />
      <el-table-column prop="kpName" label="知识点" width="150" />
      <el-table-column prop="questionTypeCode" label="题型" width="120" >
        <template #default="scope">
          {{ Object.values(QUESTION_TYPE_CONST).find(item => item.code === scope.row.questionTypeCode)?.msg }}
        </template>
      </el-table-column>
      <el-table-column prop="difficultyCode" label="难度" width="110" >
        <template #default="scope">
          <el-tag style="color: #666" :color="DIFFICULTY_KEY_MAP[scope.row.difficultyCode]?.color">
            {{ DIFFICULTY_KEY_MAP[scope.row.difficultyCode]?.msg }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="题目内容" show-overflow-tooltip width="100" />
      <el-table-column prop="questionAnalysis" label="题目解析" show-overflow-tooltip width="100" />
      <el-table-column prop="questionAnswer" label="题目答案" width="100" />
      <el-table-column prop="creatorName" label="创建人" width="100" />
      <el-table-column prop="questionScore" label="题目分值" width="100" />
      <el-table-column prop="sourceKbId" label="来源知识库" width="100" />
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
        v-model:current-page="pageData.pageNum"
        v-model:page-size="pageData.pageSize"
        :total="pageData.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>

    <question-bank-edit-modal ref="questionBankEditModalRef" @success="loadData" />

  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  createAiQuestionVector,
  deleteAiQuestionVectorById,
  fetchAiQuestionVectorPage,
  updateAiQuestionVector
} from '@/api/ai/question'
import type { 
  AiQuestionVector, 
  AiQuestionVectorDTO, 
  AiQuestionVectorVO, 
  PageResult,
  DictItemVO,
  SubjectGroupVO,
  GradeInfoGroupVO
} from '@/types'
import {usePagination} from '@/hooks/usePagination'
import {
  STATUS_CONST,
  STAGE_CODE_CONST, 
  DICT_TYPE_CONST,
  QUESTION_TYPE_CONST, 
  DIFFICULTY_CONST,
  DIFFICULTY_KEY_MAP
} from '@/constants/app'
import { getDictItems,getSubjectGroupList,getGradeInfoGroupList } from '@/hooks/useCommonData'
import QuestionBankEditModal from './QuestionBankEditModal.vue'


const { pageNum, pageSize } = usePagination()

const loading = ref(false)
const submitLoading = ref(false)
const pageData = ref<PageResult<AiQuestionVectorVO>>({} as PageResult<AiQuestionVectorVO>)
const queryForm = ref<AiQuestionVectorDTO>({ 
  pageNum: pageNum.value,
  pageSize: pageSize.value, } as AiQuestionVectorDTO)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formData = ref<AiQuestionVector>({} as AiQuestionVector)
const stageDictList = ref<DictItemVO[]>([])
const subjectGroupList = ref<SubjectGroupVO[]>([])
const gradeGroupList = ref<GradeInfoGroupVO[]>([])
const questionBankEditModalRef = ref<any>(null)

async function loadData() {
  loading.value = true
  try {
    const res: PageResult<AiQuestionVectorVO> = await fetchAiQuestionVectorPage(queryForm.value)
    setPageData(res)
  } finally {
    loading.value = false
  }
}
const setPageData = (res: PageResult<AiQuestionVectorVO>) => {
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
  } as AiQuestionVectorDTO
  loadData()
}

function openCreate() {
  questionBankEditModalRef.value.showNewDlg()
}

function openEdit(row: AiQuestionVectorVO) {
  questionBankEditModalRef.value.showDlg(row)
}

async function handleSubmit() {
  submitLoading.value = true
  try {
    if (isEdit.value) await updateAiQuestionVector(formData.value)
    else await createAiQuestionVector(formData.value)
    ElMessage.success('Success')
    dialogVisible.value = false
    await loadData()
  } finally {
    submitLoading.value = false
  }
}

async function handleDelete(row: AiQuestionVectorVO) {
  await ElMessageBox.confirm(`Delete question ${row.questionNo}?`, 'Confirm', { type: 'warning' })
  await deleteAiQuestionVectorById(row.id)
  ElMessage.success('Deleted')
  await loadData()
}

watch(
  [() => queryForm.value.pageNum, () => queryForm.value.pageSize],
  () => {
    loadData()
  }
)

// 获取学段
const loadStageDict = async () => {
  stageDictList.value = await getDictItems(DICT_TYPE_CONST.STAGE.code)
}
// 获取科目
const loadSubjectGroupList = async () => {
  subjectGroupList.value = await getSubjectGroupList()
}

// 获取年级
const loadGradeInfoGroupList = async () => {
  gradeGroupList.value = await getGradeInfoGroupList()
}


onMounted(async () => {
  await Promise.all([
    loadStageDict(),
    loadSubjectGroupList(),
    loadGradeInfoGroupList(),
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
