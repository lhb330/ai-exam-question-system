# 项目目录架构说明

本文档用于说明 `ai-exam-question-system` 项目的目录组织方式，方便开发、维护和后续交接。

## 1. 项目概览

本项目是一个基于 `Vue 3 + Vite + TypeScript + Pinia + Vue Router + Element Plus` 的前端系统，主要面向 AI 出题、题库管理、知识点管理和系统管理等场景。

## 2. 根目录结构

```text
ai-exam-question-system/
├─ public/                     # 静态资源目录（当前基本为空）
├─ scripts/                    # 脚本目录（当前基本为空）
├─ src/                        # 业务源码核心目录
├─ .env.development            # 开发环境变量
├─ .env.production             # 生产环境变量
├─ .eslintrc.cjs               # ESLint 配置
├─ .gitignore                  # Git 忽略规则
├─ .prettierignore             # Prettier 忽略规则
├─ .prettierrc.json            # Prettier 配置
├─ index.html                  # Vite 入口 HTML
├─ package.json                # 项目依赖与脚本配置
├─ package-lock.json           # npm 锁定文件
├─ README.md                   # 项目说明文档
├─ tsconfig.json               # TypeScript 总配置
├─ tsconfig.app.json           # 应用侧 TypeScript 配置
├─ tsconfig.node.json          # Node/Vite 侧 TypeScript 配置
└─ vite.config.ts              # Vite 构建配置
```

## 3. src 目录结构

```text
src/
├─ api/                        # 接口请求封装，按业务模块划分
│  ├─ ai/                      # AI 对话、AI 出题相关接口
│  ├─ base/                    # 基础数据接口，如班级、年级、学校、学科
│  ├─ exam/                    # 题库、试题等考试相关接口
│  ├─ knowledge/               # 知识库、知识点相关接口
│  └─ system/                  # 用户、权限、字典、日志等系统接口
├─ components/                 # 通用业务组件
│  └─ business/                # 业务型组件，如图表、上传、图片编辑
├─ constants/                  # 全局常量定义
├─ core/                       # 核心能力封装
│  ├─ auth/                    # 认证与权限逻辑
│  ├─ error/                   # 全局错误处理
│  ├─ guards/                  # 路由守卫
│  └─ request/                 # HTTP 请求实例与拦截器
├─ directives/                 # 自定义指令
├─ hooks/                      # 组合式函数（Composition API Hooks）
├─ layout/                     # 系统整体布局
│  └─ components/              # 布局相关组件，如头部、侧边栏、标签栏
├─ plugins/                    # 插件初始化，如 Element Plus
├─ router/                     # 路由配置与路由表
├─ stores/                     # Pinia 状态管理
├─ styles/                     # 全局样式与主题样式
├─ types/                      # TypeScript 类型定义
│  ├─ ai/                      # AI 模块类型
│  ├─ base/                    # 基础数据类型
│  ├─ exam/                    # 考试业务类型
│  ├─ knowledge/               # 知识体系类型
│  ├─ pageRequest/             # 分页请求相关类型
│  └─ system/                  # 系统管理类型
├─ utils/                      # 工具函数
├─ views/                      # 页面级组件
│  ├─ ai/                      # AI 对话、AI 出题页面
│  ├─ auth/                    # 登录认证页面
│  ├─ base/                    # 基础资料页面
│  ├─ error/                   # 异常页面，如 401、404
│  ├─ exam/                    # 题库、试卷等页面
│  ├─ knowledge/               # 知识库、知识点页面
│  └─ system/                  # 用户、权限、字典、日志页面
├─ App.vue                     # 应用根组件
└─ main.ts                     # 应用入口文件
```

## 4. 各层职责说明

### 4.1 `main.ts`

项目启动入口，负责：

- 创建 Vue 应用实例
- 注册 `Pinia`
- 注册 `Vue Router`
- 挂载 `Element Plus`
- 注册权限指令
- 引入全局样式

### 4.2 `views/`

页面层目录，对应系统中的实际页面。每个业务模块按功能继续拆分，例如：

- `views/ai/chat/`：AI 对话页面
- `views/ai/question/`：AI 出题与批次管理页面
- `views/base/school/`：学校管理页面
- `views/base/subject/`：学科管理页面
- `views/knowledge/point/`：知识点管理页面
- `views/exam/bank/`：题库管理页面
- `views/system/`：用户、权限、字典、日志等系统页面

### 4.3 `api/`

接口层目录，用于封装请求方法，避免在页面中直接拼装接口调用逻辑。好处是：

- 页面更简洁
- 接口复用更方便
- 更利于后续统一维护和修改

### 4.4 `stores/`

状态管理层，用于管理全局共享状态，例如：

- 当前用户信息
- 权限数据
- 字典数据
- AI 对话状态
- 阶段性业务状态

### 4.5 `core/`

项目的核心基础设施层，主要承载：

- 登录认证与 token 管理
- 权限判断
- 请求拦截器
- 全局错误处理
- 路由守卫

这部分通常是整个项目的运行基础。

### 4.6 `layout/`

负责整个后台系统的壳层结构，一般包括：

- 顶部导航栏
- 左侧菜单栏
- 标签导航栏
- 页面内容容器

所有需要统一布局的业务页面通常都会嵌入到 `LayoutView.vue` 中。

### 4.7 `components/`

沉淀跨页面复用的业务组件，当前包含：

- `ChartPanel.vue`：图表展示组件
- `FileUploader.vue`：文件上传组件
- `ImageEditor.vue`：图片编辑组件

### 4.8 `hooks/`

存放组合式函数，用于抽离通用逻辑，例如：

- 分页逻辑
- 用户信息处理
- 通用基础数据获取

### 4.9 `types/`

统一维护 TypeScript 类型声明，提升代码可读性和类型安全，避免类型散落在各个页面和接口文件中。

## 5. 路由模块划分

根据当前路由配置，系统主要包含以下模块：

- 登录模块：`/login`
- 首页仪表盘：`/`
- AI 对话：`/ai/chat`
- AI 出题：`/ai/generate`
- 出题批次管理：`/ai/batches`
- 学校管理：`/education/schools`
- 学科管理：`/education/subjects`
- 知识点管理：`/education/knowledge-points`
- 题库管理：`/question-bank/questions`
- 用户管理：`/system/users`
- 权限管理：`/system/permissions`
- 数据字典：`/system/dicts`
- 系统日志：`/system/logs`
- 错误页面：`/401`、`/404`

## 6. 推荐的代码流转方式

项目中的常见调用链建议理解为：

```text
views 页面
  -> hooks 复用逻辑
  -> stores 状态管理
  -> api 接口封装
  -> core/request HTTP 请求能力
```

对应关系可以理解为：

- `views` 负责界面展示和交互
- `hooks` 负责提炼可复用逻辑
- `stores` 负责跨页面共享状态
- `api` 负责与后端通信
- `core` 负责底层运行机制

## 7. 当前目录设计特点

当前项目的目录设计具备以下特点：

- 按业务模块分层较清晰
- 页面、接口、类型、状态分离明确
- 适合中后台系统持续扩展
- 便于后续新增 AI、题库、知识点、系统管理等子模块

## 8. 后续建议

如果后续项目继续扩大，建议进一步补充：

- 在 `public/` 中统一管理静态资源
- 在 `scripts/` 中放置构建、发布、代码生成脚本
- 为 `api/` 和 `views/` 中的模块补充更细的 README
- 为关键模块增加单元测试和接口文档

