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

    <SceneProperty
      :name="scene.category"
      :color="this.mapCategories.get(scene.category)?.color"
      :scene="scene"
      :type="'category'"
    />
    <SceneProperty
      :name="scene.theme"
      :color="this.mapThemes.get(scene.theme)?.color"
      :scene="scene"
      :type="'theme'"
    />
  </div>
</template>

<script>
import SceneProperty from "./SceneProperty.vue";

export default {
  name: "Scene",
  components: {
    SceneProperty,
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
    mapThemes: {
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
      this.scene[e.dataTransfer.getData("type")] =
        e.dataTransfer.getData("text");
    },
  },
};
</script>

<style scoped>
.scene {
  text-align: left;
  display: grid;
  grid-column-start: 1;
  grid-column-end: 4;
  background: lightgreen;
  margin: 5px;
  padding: 5px;
  border-radius: 5px;
  /* grid-template-columns: 50% 25% 25%; */
  grid-template-columns: subgrid;
}
</style>