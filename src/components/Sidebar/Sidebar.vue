<script>
import SidebarLink from "./SidebarLink";
import { collapsed, toggleSidebar, sidebarWidth } from "./state";
export default {
  emits: ["sidebar_click"],
  props: {},
  components: { SidebarLink },
  setup() {
    return { collapsed, toggleSidebar, sidebarWidth };
  },
};
</script>

<template>
  <div class="sidebar" :style="{ width: sidebarWidth }">
    <h1>
      <span v-if="collapsed">
        <div>U</div>
        <div>A</div>
      </span>
      <span v-else>Uptale Analysis</span>
    </h1>
    <SidebarLink
      @sidebar_click="$emit('sidebar_click', 'categories')"
      icon="fas fa-edit"
      >Catergories Setup</SidebarLink
    >

    <SidebarLink
      @sidebar_click="$emit('sidebar_click', 'Users')"
      icon="fas fa-edit"
      >Users Setup</SidebarLink
    >
    <SidebarLink
      @sidebar_click="$emit('sidebar_click', 'SurveyLink')"
      icon="fas fa-file-csv"
      >SurveyLink</SidebarLink
    >
    <SidebarLink
      @sidebar_click="$emit('sidebar_click', 'Analysis')"
      icon="fas fa-file-csv"
      >Analysis</SidebarLink
    >
    <SidebarLink
      @sidebar_click="$emit('sidebar_click', 'SQL')"
      icon="fas fa-database"
      >SQL Playground</SidebarLink
    >

    <span
      class="collapse-icon"
      :class="{ 'rotate-180': collapsed }"
      @click="toggleSidebar"
    >
      <i class="fas fa-angle-double-left" />
    </span>
  </div>
</template>

<style>
:root {
  --sidebar-bg-color: #2f855a;
  --sidebar-item-hover: #38a169;
  --sidebar-item-active: #276749;
}
</style>

<style scoped>
.sidebar {
  color: white;
  background-color: var(--sidebar-bg-color);
  float: left;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  transition: 0.3s ease;
  display: flex;
  flex-direction: column;
}
.sidebar h1 {
  height: 2.5em;
}
.collapse-icon {
  position: absolute;
  bottom: 0;
  padding: 0.75em;
  color: rgba(255, 255, 255, 0.7);
  transition: 0.2s linear;
}
.rotate-180 {
  transform: rotate(180deg);
  transition: 0.2s linear;
}
</style>