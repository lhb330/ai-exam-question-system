<template>
  <el-dialog
    v-model="visible"
    :title="viewTitle"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
        <el-form-item label="题目编号">
            <el-input v-model="formData.questionNo" placeholder="不填写时自动生成" />
        </el-form-item>
        <el-form-item label="科目" prop="subjectId">
            <el-select v-model="formData.subjectId" placeholder="请选择科目" filterable remote clearable>
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
        <el-form-item label="学段" prop="stageCode">
            <el-select v-model="formData.stageCode" placeholder="请选择学段" clearable>
                <el-option 
                :label="item.dictName" 
                :value="item.dictCode" 
                v-for="item in stageDictList" 
                :key="item.id" 
                />
            </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="gradeId">
            <el-select v-model="formData.gradeId" placeholder="请选择年级" filterable remote clearable>
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
        <el-form-item label="知识点">
            <el-select v-model="formData.kpId" placeholder="请选择知识点" clearable>
                <el-option 
                :label="item.kpName + ' - '+ item.subjectName + ' - '+ item.stageName" 
                :value="item.id" 
                v-for="item in knowledgePointList" 
                :key="item.id" 
                />
            </el-select>
        </el-form-item>
        <el-form-item label="题型" prop="questionTypeCode">
            <el-select v-model="formData.questionTypeCode">
                <el-option v-for="item in QUESTION_TYPE_CONST" :label="item.msg" :value="item.code" />
            </el-select>
        </el-form-item>
        <el-form-item label="难度" prop="difficultyCode">
            <el-select v-model="formData.difficultyCode">
                <el-option v-for="item in DIFFICULTY_CONST" :label="item.msg" :value="item.code" />
            </el-select>
        </el-form-item>
        <el-form-item label="题目内容" prop="content">
            <el-input v-model="formData.content" type="textarea" :rows="10" />
        </el-form-item>
        <el-form-item label="题目答案">
            <el-input v-model="formData.questionAnswer" />
        </el-form-item>
        <el-form-item label="题目解析">
            <el-input v-model="formData.questionAnalysis" type="textarea" :rows="10" />
        </el-form-item>
        <el-form-item label="状态">
            <el-select v-model="formData.status">
                <el-option label="启用" :value="1" />
                <el-option label="禁用" :value="0" />
            </el-select>
        </el-form-item>
        <el-form-item label="创建人">
            <el-input v-model="formData.creatorName" disabled/>
        </el-form-item>
        
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {createAiQuestionVector,updateAiQuestionVector} from '@/api/ai/question'
import type { DictItemVO,SubjectGroupVO, GradeInfoGroupVO,AiQuestionVectorDTO,KnowledgePointVO} from '@/types'
import { getDictItems,getSubjectGroupList,getGradeInfoGroupList,getKnowledgePointList } from '@/hooks/useCommonData'
import { useUser } from '@/hooks/useUser'
import {VIEW_EDIT_MODE,STATUS_CONST,DICT_TYPE_CONST,QUESTION_TYPE_CONST,DIFFICULTY_CONST} from '@/constants/app'


const emit = defineEmits(['success'])

const visible = ref(false)
const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const formData = ref<AiQuestionVectorDTO>({} as AiQuestionVectorDTO)
const viewEditModeRef = ref<string>(VIEW_EDIT_MODE.New)
const viewTitle = ref<string>('新增题目数据')
const stageDictList = ref<DictItemVO[]>([])
const subjectGroupList = ref<SubjectGroupVO[]>([])
const gradeGroupList = ref<GradeInfoGroupVO[]>([])
const knowledgePointList = ref<KnowledgePointVO[]>([])

const formRules = {
  subjectId: [{ required: true, message: '请选择科目', trigger: 'change' }],
  stageCode: [{ required: true, message: '请选择学段', trigger: 'change' }],
  gradeId: [{ required: true, message: '请选择年级', trigger: 'change' }],
  questionTypeCode: [{ required: true, message: '请选择题型', trigger: 'change' }],
  difficultyCode: [{ required: true, message: '请选择难度', trigger: 'change' }],
  content: [{ required: true, message: '请输入题目内容', trigger: 'blur' }],
  
}

// 打开弹窗（新增）
const showNewDlg = () => {
  viewEditModeRef.value = VIEW_EDIT_MODE.New
  viewTitle.value = '新增题目数据'
  formData.value = {
    questionTypeCode: QUESTION_TYPE_CONST.SINGLE_CHOICE.code,
    difficultyCode: DIFFICULTY_CONST.MEDIUM.code,
    status: STATUS_CONST.ENABLED.code,
    creatorName: useUser().userName,
    creatorId: useUser().id
  } as AiQuestionVectorDTO
  visible.value = true
  loadData()
}

// 打开弹窗(编辑)
const showDlg = (row: AiQuestionVectorDTO) => {
  viewEditModeRef.value = VIEW_EDIT_MODE.Edit
  viewTitle.value = '编辑题目数据'
  formData.value = { ...row } as AiQuestionVectorDTO
  visible.value = true
  loadData()
}

// 关闭
const handleClose = () => {
  visible.value = false
  formRef.value?.clearValidate()
}

// 编辑 or 新增
const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  try {
    submitLoading.value = true
    if (viewEditModeRef.value === VIEW_EDIT_MODE.New) {
      // 调用新增接口
      await createAiQuestionVector(formData.value)
      ElMessage.success('新增成功')
    } else {
      // 调用编辑接口
      await updateAiQuestionVector(formData.value)
      ElMessage.success('修改成功')
    }
    handleClose()
    emit('success')
  } catch (e) {
    const msg = viewEditModeRef.value === VIEW_EDIT_MODE.New ? '新增失败' : '修改失败'
    ElMessage.error(msg)
  } finally {
    submitLoading.value = false
  }
}

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
// 知识点
const loadKnowledgePointList = async () => {
  knowledgePointList.value = await getKnowledgePointList()
}

const loadData = async () => {
    await loadStageDict()
    await loadSubjectGroupList()
    await loadGradeInfoGroupList()
    await loadKnowledgePointList()
}

// ✅ 唯一正确、必须写在这里
defineExpose({showNewDlg, showDlg })
</script>

<style scoped>
.dialog-footer { text-align: right; }
</style>