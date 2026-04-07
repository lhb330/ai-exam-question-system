import type { RouteRecordRaw } from 'vue-router'
import LayoutView from '@/layout/LayoutView.vue'

export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: LayoutView,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: '首页' }
      }
    ]
  },
  {
    path: '/ai/chat',
    component: LayoutView,
    children: [
      {
        path: '',
        name: 'AiChat',
        component: () => import('@/views/ai/chat/AiChatView.vue'),
        meta: { title: 'AI 对话信息' }
      }
    ]
  },
  {
    path: '/ai/generate',
    component: LayoutView,
    children: [
      {
        path: '',
        name: 'AiGenerate',
        component: () => import('@/views/ai/question/AiQuestionGenerateView.vue'),
        meta: { title: 'AI 智能出题' }
      }
    ]
  },
  {
    path: '/ai/batches',
    component: LayoutView,
    children: [
      {
        path: '',
        name: 'AiBatches',
        component: () => import('@/views/ai/question/AiQuestionBatchView.vue'),
        meta: { title: '出题批次管理' }
      }
    ]
  },
  {
    path: '/education/schools',
    component: LayoutView,
    children: [
      {
        path: '',
        name: 'SchoolManage',
        component: () => import('@/views/base/school/SchoolInfoView.vue'),
        meta: { title: '学校管理' }
      }
    ]
  },
  {
    path: '/education/subjects',
    component: LayoutView,
    children: [
      {
        path: '',
        name: 'SubjectManage',
        component: () => import('@/views/base/subject/SubjectInfoView.vue'),
        meta: { title: '科目管理' }
      }
    ]
  },
  {
    path: '/education/knowledge-points',
    component: LayoutView,
    children: [
      {
        path: '',
        name: 'KnowledgePointManage',
        component: () => import('@/views/knowledge/point/KnowledgePointView.vue'),
        meta: { title: '知识点管理' }
      }
    ]
  },
  {
    path: '/question-bank/questions',
    component: LayoutView,
    children: [
      {
        path: '',
        name: 'QuestionList',
        component: () => import('@/views/exam/bank/QuestionBankView.vue'),
        meta: { title: '题目列表' }
      }
    ]
  },
  {
    path: '/system/users',
    component: LayoutView,
    children: [
      {
        path: '',
        name: 'SystemUser',
        component: () => import('@/views/system/user/UserListView.vue'),
        meta: { title: '用户管理' }
      }
    ]
  },
  {
    path: '/system/permissions',
    component: LayoutView,
    children: [
      {
        path: '',
        name: 'SystemPermission',
        component: () => import('@/views/system/permission/PermissionListView.vue'),
        meta: { title: '权限管理' }
      }
    ]
  },
  {
    path: '/system/dicts',
    component: LayoutView,
    children: [
      {
        path: '',
        name: 'SystemDict',
        component: () => import('@/views/system/dict/DictListView.vue'),
        meta: { title: '数据字典' }
      }
    ]
  },
  {
    path: '/system/logs',
    component: LayoutView,
    children: [
      {
        path: '',
        name: 'SystemLogs',
        component: () => import('@/views/system/login-log/LoginLogListView.vue'),
        meta: { title: '系统日志' }
      }
    ]
  },
  {
    path: '/401',
    name: 'NoPermission',
    component: () => import('@/views/error/NoPermission.vue'),
    meta: { hidden: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/NotFound.vue'),
    meta: { hidden: true }
  }
]
