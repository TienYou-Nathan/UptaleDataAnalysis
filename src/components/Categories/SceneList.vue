<template>
  <a
    id="save"
    @mousedown="refreshSaveData"
    :href="saveData"
    download="sceneInfo.json"
    >Save Settings</a
  >
  <div id="sceneList">
    <Scene
      v-for="scene in arrayScenes"
      :key="scene.id"
      :scene="scene"
      :mapCategories="mapCategories"
      :mapThemes="mapThemes"
      :mapScenes="mapScenes"
    />
    <div id="categoryList">
      <div class="sticky">
        <SceneProperty
          v-for="category in arrayCategories"
          :key="category.id"
          :name="category.id"
          :color="category.color"
          :persistent="true"
          :type="'category'"
        />
      </div>
    </div>
    <div id="themeList">
      <div class="sticky">
        <SceneProperty
          v-for="theme in arrayThemes"
          :key="theme.id"
          :name="theme.id"
          :color="theme.color"
          :persistent="true"
          :type="'theme'"
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
  data() {
    return {
      arrayScenes: [],
      arrayCategories: [],
      arrayThemes: [],
      saveData: {},
    };
  },
  props: {
    title: {
      type: String,
      default: "Unknown Title",
    },
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
  created() {
    this.mapScenes.forEach((value, key) => {
      let temp = value;
      temp.id = key;
      this.arrayScenes.push(temp);
    });

    this.mapCategories.forEach((value, key) => {
      let temp = value;
      temp.id = key;
      this.arrayCategories.push(temp);
    });
    this.mapThemes.forEach((value, key) => {
      let temp = value;
      temp.id = key;
      this.arrayThemes.push(temp);
    });
  },
  methods: {
    refreshSaveData() {
      this.saveData =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(
          JSON.stringify({
            arrayScenes: [...this.arrayScenes],
            arrayCategories: [...this.arrayCategories],
            arrayThemes: [...this.arrayThemes],
          })
        );
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