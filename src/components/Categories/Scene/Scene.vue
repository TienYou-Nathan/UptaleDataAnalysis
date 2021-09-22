<template>
  <div
    @dragenter="dragEnter"
    @dragleave="dragLeave"
    @dragover="dragOver"
    @drop="drop"
    :style="{ border: border_width + 'px solid black' }"
  >
    {{ scene.name }}
    <Category
      v-if="scene.category"
      :categoryName="scene.category"
      :color="this.mapCategories.get(scene.category).color"
      :scene="scene"
    />
    <Theme :theme="scene.theme" />
  </div>
</template>

<script>
import Category from "./Category.vue";
import Theme from "./Theme.vue";

export default {
  name: "Scene",
  components: {
    Category,
    Theme,
  },
  data() {
    return {
      border_width: 0,
    };
  },
  props: {
    scene: {
      type: Object,
    },
    mapCategories: {
      type: Map,
      default: [],
    },
  },
  methods: {
    dragEnter(e) {
      e.preventDefault();
      this.border_width = 1;
    },
    dragLeave(e) {
      this.border_width = 0;
    },
    dragOver(e) {
      e.preventDefault();
    },
    drop(e) {
      e.preventDefault();
      this.border_width = 0;
      this.scene.category = e.dataTransfer.getData("text");
    },
  },
};
</script>

<style scoped>
</style>