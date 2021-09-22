<template>
  <div
    class="scene"
    @dragenter="dragEnter"
    @dragleave="dragLeave"
    @dragover="dragOver"
    @drop="drop"
    :style="{ border: '1px solid ' + border_color }"
  >
    <span>{{ scene.name }}</span>

    <Category
      :categoryName="scene.category"
      :color="this.mapCategories.get(scene.category)?.color"
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
      border_color: "transparent",
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
    },
    dragLeave(e) {
      this.border_color = "transparent";
    },
    dragOver(e) {
      e.preventDefault();
      this.border_color = "black";
    },
    drop(e) {
      e.preventDefault();
      this.border_color = "transparent";
      this.scene.category = e.dataTransfer.getData("text");
    },
  },
};
</script>

<style scoped>
.scene {
  text-align: left;
  display: grid;
  grid-column-start: 1;
  grid-column-end: 3;
  grid-template-columns: 50% 25% 25%;
  grid-template-rows: subgrid;
}
</style>