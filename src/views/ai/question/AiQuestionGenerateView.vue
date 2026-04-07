<template>
  <el-card>
    <template #header>AI 智能出题</template>
    <el-form ref="formRef" :model="form" :rules="formRules" label-width="110px" class="generate-form">
      <el-form-item label="科目" prop="subjectId">
        <el-select v-model="form.subjectId" placeholder="请选择科目" filterable remote clearable>
          <el-option-group
            v-for="group in subjectGroupList"
            :key="group.stageCode"
            :label="group.subjectName">
              <el-option
                v-for="item in group.childList"
                :key="item.id"
                :label="item.subjectName"
                :value="item.id"/>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="学段" prop="stageCode">
        <el-select v-model="form.stageCode" placeholder="请选择学段" clearable>
            <el-option 
            :label="item.dictName" 
            :value="item.dictCode" 
            v-for="item in stageDictList" 
            :key="item.id" 
            />
        </el-select>
      </el-form-item>
      <el-form-item label="年级" prop="gradeId">
        <el-select v-model="form.gradeId" placeholder="请选择年级" filterable remote clearable>
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
      <el-form-item label="知识点" prop="kpId">
        <el-select v-model="form.kpId" placeholder="请选择知识点" clearable>
            <el-option 
            :label="item.kpName + ' - '+ item.subjectName + ' - '+ item.stageName" 
            :value="item.id" 
            v-for="item in knowledgePointList" 
            :key="item.id" 
            />
        </el-select>
      </el-form-item>
      <el-form-item label="题型" prop="questionTypeCode">
        <el-select v-model="form.questionTypeCode">
            <el-option v-for="item in QUESTION_TYPE_CONST" :label="item.msg" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="难度" prop="difficultyCode">
        <el-select v-model="form.difficultyCode">
            <el-option v-for="item in DIFFICULTY_CONST" :label="item.msg" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="题目数量">
        <el-input-number v-model="form.questionCount" :min="1" :max="5" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="submitting" @click="handleGenerate">
          开始出题
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted,reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { generateAiQuestionBatch } from '@/api/ai/question'
import type { AiGenerateQuestionDTO,
  SubjectGroupVO,DictItemVO,
  GradeInfoGroupVO,
  KnowledgePointVO 
} from '@/types'
import { getDictItems,
  getSubjectGroupList,
  getGradeInfoGroupList,
  getKnowledgePointList 
} from '@/hooks/useCommonData'
import {DICT_TYPE_CONST,QUESTION_TYPE_CONST,DIFFICULTY_CONST} from '@/constants/app'

const submitting = ref(false)
const formRef = ref<FormInstance>()
const stageDictList = ref<DictItemVO[]>([])
const subjectGroupList = ref<SubjectGroupVO[]>([])
const gradeGroupList = ref<GradeInfoGroupVO[]>([])
const knowledgePointList = ref<KnowledgePointVO[]>([])

const form = reactive<AiGenerateQuestionDTO>({
  questionTypeCode: QUESTION_TYPE_CONST.SINGLE_CHOICE.code,
  difficultyCode: DIFFICULTY_CONST.MEDIUM.code,
  questionCount: 1
} as AiGenerateQuestionDTO)

const formRules = {
  subjectId: [{ required: true, message: '请选择科目', trigger: 'change' }],
  stageCode: [{ required: true, message: '请选择学段', trigger: 'change' }],
  gradeId: [{ required: true, message: '请选择年级', trigger: 'change' }],
  kpId: [{ required: true, message: '请选择知识点', trigger: 'change' }],
  questionTypeCode: [{ required: true, message: '请选择题型', trigger: 'change' }],
  difficultyCode: [{ required: true, message: '请选择难度', trigger: 'change' }],
  content: [{ required: true, message: '请输入题目内容', trigger: 'blur' }],
  
}

async function handleGenerate(): Promise<void> {
  const valid = await formRef.value?.validate()
  if (!valid) return

  try {
    submitting.value = true
    const res = await generateAiQuestionBatch(form)
    ElMessage.success(`${res},稍后到【题库管理-题目列表中查看】`)
  } catch (e) {
    ElMessage.error(`${e}`)
  } finally {
    submitting.value = false
  }
}

// 获取科目
const loadSubjectGroupList = async () => {
  subjectGroupList.value = await getSubjectGroupList()
}
// 获取学段
const loadStageDict = async () => {
  stageDictList.value = await getDictItems(DICT_TYPE_CONST.STAGE.code)
}
// 获取年级
const loadGradeInfoGroupList = async () => {
  gradeGroupList.value = await getGradeInfoGroupList()
}
// 知识点
const loadKnowledgePointList = async () => {
  knowledgePointList.value = await getKnowledgePointList()
}

onMounted(async () => {
  await Promise.all([
    loadSubjectGroupList(),
    loadStageDict(),
    loadGradeInfoGroupList(),
    loadKnowledgePointList(),
  ])
})

</script>

<style scoped>
.generate-form {
  max-width: 560px;
}
</style>
