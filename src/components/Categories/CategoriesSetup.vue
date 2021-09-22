<template>
  <div v-if="display == 'sceneList'">
    <SceneList :arrayScenes="arrayScenes" :mapCategories="mapCategories" />
  </div>
</template>

<script>
import SceneList from "./SceneList.vue";

export default {
  name: "CategoriesSetup",
  data() {
    return {
      arrayScenes: [],
      display: "sceneList",
    };
  },
  components: {
    SceneList,
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
  },
  created() {
    this.mapScenes.forEach((value, key) => {
      let temp = value;
      temp.id = key;
      this.arrayScenes.push(temp);
    });
  },
};
</script>

<style scoped>
</style>