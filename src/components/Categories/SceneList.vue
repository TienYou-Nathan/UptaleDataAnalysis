<template>
  <div v-for="scene in arrayScenes" :key="scene.id">
    <Scene :scene="scene" :mapCategories="mapCategories" />
  </div>
</template>

<script>
import Scene from "./Scene/Scene.vue";

export default {
  name: "SceneList",
  components: {
    Scene,
  },
  props: {
    arrayScenes: {
      type: Array,
      default: [],
    },
    mapCategories: {
      type: Map,
      default: [],
    },
  },
  created() {
    console.log(this.mapCategories.get("hub").color);
  },
};
</script>

<style scoped>
</style>