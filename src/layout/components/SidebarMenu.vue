<template>
  <div class="sidebar-menu">
    <h3 class="sidebar-title">AI考试系统</h3>
    <el-menu
      :default-active="$route.path"
      router
      class="menu"
      background-color="#001529"
      text-color="#bfcbd9"
      active-text-color="#409eff"
    >
      <el-menu-item index="/">首页</el-menu-item>

      <el-sub-menu index="ai-center">
        <template #title>AI 中心</template>
        <el-menu-item index="/ai/chat">AI 对话信息</el-menu-item>
        <el-menu-item index="/ai/generate">AI 智能出题</el-menu-item>
        <el-menu-item index="/ai/batches">出题批次管理</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="edu-resource">
        <template #title>教务资源</template>
        <el-menu-item index="/education/schools">学校管理</el-menu-item>
        <el-menu-item index="/education/subjects">科目管理</el-menu-item>
        <el-menu-item index="/education/knowledge-points">知识点管理</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="question-bank">
        <template #title>题库管理</template>
        <el-menu-item index="/question-bank/questions">题目列表</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="system">
        <template #title>系统管理</template>
        <el-menu-item index="/system/users">用户管理</el-menu-item>
        <el-menu-item index="/system/permissions">权限管理</el-menu-item>
        <el-menu-item index="/system/dicts">数据字典</el-menu-item>
        <el-menu-item index="/system/logs">系统日志</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<style scoped lang="scss">
.sidebar-menu {
  height: 100%;
  padding-top: 8px;
}

.sidebar-title {
  margin: 0;
  padding: 12px 16px 16px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.menu {
  border-right: none;
}
</style>
