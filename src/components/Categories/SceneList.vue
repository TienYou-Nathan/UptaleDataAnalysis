<template>
  <form @submit="addCategory">
    <input id="categoryName" type="text" placeholder="add category" />
  </form>
  <form @submit="addTheme">
    <input id="themeName" type="text" placeholder="add theme" />
  </form>

  <div id="sceneList">
    <Scene
      v-for="scene in mapToArray(mapScenes)"
      :key="scene.id"
      :scene="scene"
      :mapCategories="mapCategories"
      :mapThemes="mapThemes"
      :mapScenes="mapScenes"
      @sceneUpdate="$emit('sceneUpdate', $event)"
    />
    <div id="categoryList">
      <div class="sticky">
        <SceneProperty
          v-for="category in mapToArray(mapCategories)"
          :key="category.id"
          :object="category"
          :persistent="true"
          :type="'category'"
          @deleteProperty="removeProperty"
        />
      </div>
    </div>
    <div id="themeList">
      <div class="sticky">
        <SceneProperty
          v-for="theme in mapToArray(mapThemes)"
          :key="theme.id"
          :object="theme"
          :persistent="true"
          :type="'theme'"
          @deleteProperty="removeProperty"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Scene from "./Scene/Scene.vue";
import SceneProperty from "./Scene/SceneProperty.vue";
import { mapToArray } from "../../utilities";

export default {
  name: "SceneList",
  components: {
    Scene,
    SceneProperty,
  },
  props: {
    mapScenes: {
      type: Map,
      default: [],
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
  created() {},
  methods: {
    addCategory(e) {
      e.preventDefault();
      this.mapCategories.set(
        e.srcElement.querySelector("#categoryName").value,
        {
          color: "#ffffff",
        }
      );
    },
    addTheme(e) {
      e.preventDefault();
      this.mapThemes.set(e.srcElement.querySelector("#themeName").value, {
        color: "#ffffff",
      });
    },
    mapToArray(data) {
      return mapToArray(data);
    },
    removeProperty({ type, name }) {
      let target;

      if (type == "category") {
        target = this.mapCategories;
      } else if (type == "theme") {
        target = this.mapThemes;
      }

      target.delete(name);
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