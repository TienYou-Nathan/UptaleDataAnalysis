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
      @updateScene="updateScene"
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
          @deleteProperty="deleteCategory"
          @updateProperty="updateCategory"
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
          @deleteProperty="deleteTheme"
          @updateProperty="updateTheme"
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
  components: {
    Scene,
    SceneProperty,
  },
  computed: {
    scenes() {
      return this.$store.state.scenes;
    },
    categories() {
      return this.$store.state.categories;
    },
    themes() {
      return this.$store.state.themes;
    },
  },
  methods: {
    addCategory(e) {
      e.preventDefault();
      this.$store.dispatch("addCategory", {
        name: e.srcElement.querySelector("#categoryName").value,
        color: "#ffffff",
      });
    },
    addTheme(e) {
      e.preventDefault();
      this.$store.dispatch("addTheme", {
        name: e.srcElement.querySelector("#themeName").value,
        color: "#ffffff",
      });
    },
    updateCategory(e) {
      this.$store.dispatch("updateCategory", e);
    },
    updateTheme(e) {
      this.$store.dispatch("updateTheme", e);
    },
    updateScene(e) {
      this.$store.dispatch("updateScene", e);
    },
    deleteCategory(e) {
      this.$store.dispatch("deleteCategory", e);
    },
    deleteTheme(e) {
      this.$store.dispatch("deleteTheme", e);
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