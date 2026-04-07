# AI 智能出题考试系统（前端）

基于 `Vue3 + TypeScript + Vite + Element Plus + Pinia + Axios` 的企业级后台前端工程骨架，覆盖多角色权限、多学段与 AI 出题核心业务。

## 启动方式

```bash
npm install
npm run dev
```

## 项目目录结构

```text
ai-exam-question-system
├─ public/                          # 静态资源
├─ scripts/                         # 工程脚本（预留）
├─ src/
│  ├─ api/                          # 按业务域划分 API
│  │  ├─ system/                    # 用户/权限/字典/登录日志
│  │  ├─ ai/                        # AI 对话、AI 出题批次
│  │  ├─ knowledge/                 # 知识点/知识库
│  │  ├─ base/                      # 学校、科目
│  │  └─ exam/                      # 题库、试卷
│  ├─ components/
│  │  ├─ common/                    # 通用组件
│  │  └─ business/                  # 业务增强组件（上传/图表/图片编辑）
│  ├─ constants/                    # 系统常量（角色、学段等）
│  ├─ core/                         # 核心能力层（鉴权/守卫/请求/错误）
│  ├─ directives/                   # 全局指令（v-permission）
│  ├─ hooks/                        # 组合式 hooks
│  ├─ layout/                       # 后台主框架（侧栏/头部/标签栏）
│  ├─ modules/                      # 业务模块（system/ai/knowledge/base/exam）
│  ├─ plugins/                      # 框架插件注册（Element Plus）
│  ├─ router/                       # 路由定义与装配
│  ├─ stores/                       # Pinia 状态（用户/权限/字典/学段/AI会话）
│  ├─ styles/                       # 全局样式
│  ├─ types/                        # 全局类型与 DTO/VO
│  ├─ utils/                        # 工具方法
│  ├─ views/                        # 全局页面（登录、异常、仪表盘）
│  ├─ App.vue                       # 根组件
│  └─ main.ts                       # 应用入口
├─ .env.development                 # 开发环境变量
├─ .env.production                  # 生产环境变量
├─ .eslintrc.cjs                    # ESLint 规范
├─ .prettierrc.json                 # Prettier 规范
├─ index.html                       # Vite HTML 模板
├─ package.json                     # 依赖与脚本
├─ tsconfig*.json                   # TypeScript 配置
└─ vite.config.ts                   # Vite 配置
```

## 核心文件用途

- `src/main.ts`：应用启动入口，挂载 Pinia、Router、Element Plus 和全局指令。
- `src/router/index.ts`：组合静态路由与模块路由，并安装全局路由守卫。
- `src/router/routes.ts`：固定路由（登录、首页、401、404）。
- `src/modules/routes.ts`：业务域路由映射（系统管理、AI、知识点、学校/科目、题库）。
- `src/core/request/http.ts`：Axios 实例与统一请求方法。
- `src/core/request/interceptors.ts`：请求头注入 token、统一响应与错误提示。
- `src/core/guards/index.ts`：登录态拦截与白名单跳转。
- `src/directives/permission.ts`：按钮级权限控制指令 `v-permission`。
- `src/stores/stage.ts`：学段上下文状态（小学/初中/高中）供页面联动。
- `src/stores/ai-chat.ts`：AI 对话会话与消息状态管理。

## 业务模块与数据表映射

- 系统管理：`sys_user`、`sys_permission`、`sys_user_permission`、`sys_dict`、`sys_login_log`
- AI 模块：`t_ai_chat_message`、`t_ai_question_batch`、`t_ai_question_vector`
- 知识模块：`t_knowledge_base_vector`、`t_knowledge_point`
- 基础模块：`t_school_info`、`t_subject_info`

## 命名与工程约定

- 页面组件统一 `*View.vue`。
- API 文件按业务域拆分，避免巨型 `api.ts`。
- Store 按领域拆分，避免状态耦合。
- 推荐后续增加：自动化测试、国际化、多主题、动态路由权限拉取。
