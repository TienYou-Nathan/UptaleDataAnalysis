<script>
import { collapsed } from './state'
export default {
    emits : ['sidebar_click'],
    props: {
        icon: { type: String, required: true }
    },
    setup(props) {
        return {collapsed }
    }
}
</script>

<template>
  <div class=sidebarlink @click='$emit("sidebar_click")'>
    <i class="icon" :class="icon" />
    <transition name="fade">
      <span v-if="!collapsed">
        <slot />
      </span>
    </transition>
  </div>  
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.sidebarlink {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  font-weight: 400;
  user-select: none;
  margin: 0.1em 0;
  padding: 0.4em;
  border-radius: 0.25em;
  height: 1.5em;
  color: white;
  text-decoration: none;
}
.sidebarlink:hover {
  background-color: var(--sidebar-item-hover);
}
.sidebarlink.active {
  background-color: var(--sidebar-item-active);
}
.sidebarlink .icon {
  flex-shrink: 0;
  width: 25px;
  margin-right: 10px;
}
</style>