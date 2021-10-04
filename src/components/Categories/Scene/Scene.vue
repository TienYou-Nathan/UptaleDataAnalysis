<template>
  <div
    class="scene"
    @dragenter="dragEnter"
    @dragleave="dragLeave"
    @dragover="dragOver"
    @drop="drop"
    :style="{ border: '1px solid ' + border_color }"
  >
    <span>{{ scene.Name }}</span>

    <SceneProperty
      :id="scene.CategoryId"
      :name="scene.CategoryName"
      :color="scene.CategoryColor"
      :type="'category'"
      :border="borders.category"
    />
    <SceneProperty
      :id="scene.ThemeId"
      :name="scene.ThemeName"
      :color="scene.ThemeColor"
      :type="'theme'"
      :border="borders.theme"
    />
  </div>
</template>

<script>
import SceneProperty from "./SceneProperty.vue";

export default {
  name: "Scene",
  emits: ["updateScene"],
  components: {
    SceneProperty,
  },
  data() {
    return {
      border_color: "transparent",
      borders: {
        category: null,
        theme: null,
      },
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
    mapScenes: {
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
      this.borders[e.dataTransfer.getData("type")] = null;
    },
    dragOver(e) {
      e.preventDefault();
      this.border_color = "black";
      this.borders[e.dataTransfer.getData("type")] = "2px solid red";
    },
    drop(e) {
      e.preventDefault();

      this.border_color = "transparent";
      this.borders[e.dataTransfer.getData("type")] = null;
      if (e.dataTransfer.getData("type") == "theme") {
        this.scene.ThemeId = e.dataTransfer.getData("Id");
      } else if (e.dataTransfer.getData("type") == "category") {
        this.scene.CategoryId = e.dataTransfer.getData("Id");
      }
      this.$emit("updateScene", {
        sceneId: this.scene.Id,
        categoryId: this.scene.CategoryId,
        themeId: this.scene.ThemeId,
      });
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