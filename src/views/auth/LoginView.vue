<template>
  <div class="login-page">
    <el-card class="login-card" shadow="hover">
      <div class="login-header">
        <h2>AI 智能出题考试系统</h2>
        <p>请输入账号密码登录系统</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="userAccount">
          <el-input
            v-model="form.userAccount"
            placeholder="请输入账号"
            autocomplete="username"
            clearable
          />
        </el-form-item>

        <el-form-item prop="userPassword">
          <el-input
            v-model="form.userPassword"
            type="password"
            placeholder="请输入密码"
            autocomplete="current-password"
            show-password
            clearable
            @keydown.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            :loading="submitting"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { login } from '@/api/system/user'
import { tokenUtils } from '@/core/auth/token'
import { useUserStore } from '@/stores/user'

interface LoginForm {
  userAccount: string
  userPassword: string
}

const AUTH_USER_KEY = 'ai_exam_auth_user'

const router = useRouter()
const formRef = ref<FormInstance>()
const submitting = ref(false)

const form = reactive<LoginForm>({
  userAccount: '',
  userPassword: ''
})
// 拿到 userStore
const userStore = useUserStore()

const rules: FormRules<LoginForm> = {
  userAccount: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  userPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

async function handleLogin(): Promise<void> {
  const instance = formRef.value
  if (!instance) return

  const valid = await instance.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    // 1. 调用登录接口
    const authUser = await login({
      userAccount: form.userAccount.trim(),
      userPassword: form.userPassword
    })
    // 2. 存 token
    tokenUtils.setToken(authUser.saToken)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser))
    // 3. ✅ 关键：直接把用户信息存入 Pinia，不请求后端！
    userStore.setUser(authUser)
    ElMessage.success(`登录成功，欢迎回来 ${authUser.userName}`)
    await router.push('/')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.18), transparent 32%),
    linear-gradient(135deg, #0f2a56 0%, #1d4f91 100%);
}

.login-card {
  width: 380px;
  border-radius: 16px;
}

.login-header {
  margin-bottom: 20px;
  text-align: center;
}

.login-header h2 {
  margin: 0 0 8px;
  color: #16396b;
  font-size: 24px;
}

.login-header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.login-btn {
  width: 100%;
}
</style>
