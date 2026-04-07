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
        <el-form-item label="知识点编码">
            <el-input v-model="formData.kpCode" placeholder="不填写时自动生成"/>
        </el-form-item>
        <el-form-item label="知识点名称" prop="kpName">
            <el-input v-model="formData.kpName" />
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
        <el-form-item label="父级知识点">
            <el-select v-model="formData.parentKpId" placeholder="请选择父级知识点" clearable>
                <el-option 
                :label="item.kpName+'-'+item.kpCode" 
                :value="item.id" 
                v-for="item in kpParentList" 
                :key="item.id" 
                />
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
        <el-form-item label="状态">
            <el-select v-model="formData.status" placeholder="请选择状态" clearable>
                <el-option 
                :label="item.msg" 
                :value="item.code" 
                v-for="item in Object.values(STATUS_CONST)" 
                :key="item.code" 
                />
            </el-select>
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
import { create, update ,getKpParent} from '@/api/knowledge/point'
import { getDictItems,getSubjectGroupList } from '@/hooks/useCommonData'
import type { KnowledgePoint,KnowledgePointVO,DictItemVO,SubjectGroupVO, KnowledgeBaseVO } from '@/types'
import {STATUS_CONST,DICT_TYPE_CONST,VIEW_EDIT_MODE} from '@/constants/app'


const emit = defineEmits(['success'])

const visible = ref(false)
const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const formData = ref<KnowledgePoint>({} as KnowledgePoint)
const viewEditModeRef = ref<string>(VIEW_EDIT_MODE.New)
const viewTitle = ref<string>('新增知识点数据')
const stageDictList = ref<DictItemVO[]>([])
const subjectGroupList = ref<SubjectGroupVO[]>([])
const kpParentList = ref<KnowledgePointVO[]>([])

const formRules = {
  kpName: [{ required: true, message: '请输入知识点名称', trigger: 'blur' }],
  subjectId: [{ required: true, message: '请选择科目', trigger: 'change' }],
  stageCode: [{ required: true, message: '请选择学段', trigger: 'change' }],
}

// 打开弹窗（新增）
const showNewDlg = async () => {
  viewEditModeRef.value = VIEW_EDIT_MODE.New
  viewTitle.value = '新增知识点数据'
  formData.value = {
    status: STATUS_CONST.ENABLED.code
  } as KnowledgePoint
  visible.value = true
  loadData()
}

// 打开弹窗(编辑)
const showDlg = async (row: KnowledgePoint) => {
  viewEditModeRef.value = VIEW_EDIT_MODE.Edit
  viewTitle.value = '编辑知识点数据'
  formData.value = { ...row } as KnowledgePoint
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
      await create(formData.value)
      ElMessage.success('新增成功')
    } else {
      // 调用编辑接口
      await update(formData.value)
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
const loadKpParent = async () => {
  kpParentList.value = await getKpParent()
}

const loadData = async () => {
  await loadStageDict()
  await loadSubjectGroupList()
  await loadKpParent()
}

// ✅ 唯一正确、必须写在这里
defineExpose({showNewDlg, showDlg })
</script>

<style scoped>
.dialog-footer { text-align: right; }
</style>