<template>
  <el-card>
    <template #header>{{ title }}</template>
    <div class="chart-placeholder">图表组件接入位（ECharts / AntV）</div>
  </el-card>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), {
  title: '数据图表'
})
</script>

<style scoped>
.chart-placeholder {
  height: 240px;
  display: grid;
  place-items: center;
  color: #909399;
  border: 1px dashed #dcdfe6;
}
</style>
