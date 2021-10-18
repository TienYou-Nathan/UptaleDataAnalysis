<template>
  <form @submit="addCategory">
    <input id="categoryName" type="text" placeholder="add category" />
  </form>
  <form @submit="addTheme">
    <input id="themeName" type="text" placeholder="add theme" />
  </form>

  <div id="sceneList">
    <Scene
      v-for="scene in scenes"
      :key="scene.Id"
      :scene="scene"
      @updateScene="$emit('updateScene', $event)"
    />
    <div id="categoryList">
      <div class="sticky">
        <SceneProperty
          v-for="category in categories"
          :key="category.Id"
          :id="category.Id"
          :name="category.Name"
          :color="category.Color"
          :persistent="true"
          :type="'category'"
          @deleteProperty="removeProperty"
          @updateProperty="$emit('updateCategory', $event)"
        />
      </div>
    </div>
    <div id="themeList">
      <div class="sticky">
        <SceneProperty
          v-for="theme in themes"
          :key="theme.Id"
          :id="theme.Id"
          :name="theme.Name"
          :color="theme.Color"
          :persistent="true"
          :type="'theme'"
          @deleteProperty="removeProperty"
          @updateProperty="$emit('updateTheme', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Scene from "./Scene/Scene.vue";
import SceneProperty from "./Scene/SceneProperty.vue";

export default {
  name: "SceneList",
  emits: [
    "addCategory",
    "addTheme",
    "updateCategory",
    "updateTheme",
    "updateScene",
  ],
  components: {
    Scene,
    SceneProperty,
  },
  props: {
    scenes: {
      type: Array,
      default: [],
    },
    categories: {
      type: Array,
      default: [],
    },
    themes: {
      type: Array,
      default: [],
    },
  },
  created() {},
  methods: {
    removeProperty() {},
    addCategory(e) {
      e.preventDefault();
      this.$emit("addCategory", {
        name: e.srcElement.querySelector("#categoryName").value,
        color: "#ffffff",
      });
    },

    addTheme(e) {
      e.preventDefault();
      this.$emit("addTheme", {
        name: e.srcElement.querySelector("#themeName").value,
        color: "#ffffff",
      });
    },
  },
};
</script>

<style scoped>
#sceneList {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}
#categoryList {
  grid-column-start: 4;
  /* Firefox workaround to 1/-1 */
  grid-row: 1/9999999999;
}
#themeList {
  grid-column-start: 5;
  /* Firefox workaround to 1/-1 */
  grid-row: 1/9999999999;
}
.sticky {
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0px;
}
</style>