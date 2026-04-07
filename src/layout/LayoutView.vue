<template>
  <div class="layout">
    <aside class="layout__sidebar">
      <SidebarMenu />
    </aside>
    <section class="layout__main">
      <HeaderBar />
      <TagsBar />
      <main class="layout__content">
        <router-view />
      </main>
    </section>
  </div>
</template>

<script setup lang="ts">
import SidebarMenu from './components/SidebarMenu.vue'
import HeaderBar from './components/HeaderBar.vue'
import TagsBar from './components/TagsBar.vue'
</script>

<style scoped lang="scss">
.layout {
  display: flex;
  height: 100%;
}

.layout__sidebar {
  width: 220px;
  background: #001529;
  color: #fff;
}

.layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.layout__content {
  flex: 1;
  overflow: auto;
  padding: 5px;
}
</style>
