<template>
  <Paths :paths="paths" :display="'all'" />
</template>

<script>
import Paths from "../Paths.vue";
export default {
  name: "AllRoutes",
  props: {
    paths: {
      type: Array,
      default: [],
    },
  },
  components: {
    Paths,
  },
};
</script>

<style scoped>
</style>