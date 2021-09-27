<template>
  <div :key="path.id" v-for="path in paths">
    <Path :path="path" :display="display" :categories="categories" />
  </div>
</template>

<script>
import Path from "./Path.vue";

export default {
  name: "Paths",
  components: {
    Path,
  },
  props: {
    paths: Array,
    display: String,
    categories: Map,
  },
};
</script>

<style scoped>
</style>