<template>
  <div />
  <Legend @check="legendSelector" :categories="mapToArray(categories)" />
  <Checkbox @check="mergeThematic" :name="'Merge thematics'" />
  <Paths :paths="computedPaths" :display="'compute'" :categories="categories" />
</template>

<script>
import { mapToArray } from "../../../utilities";

import Legend from "./Legend/Legend.vue";
import Checkbox from "./Checkbox.vue";
import Paths from "../Paths.vue";

export default {
  name: "ComputedRoutes",
  emits: ["updateAndComputePaths", "mergeThematic"],
  components: {
    Legend,
    Checkbox,
    Paths,
  },
  props: {
    categories: {
      type: Map,
      default: [],
    },
    computedPaths: {
      type: Array,
      default: [],
    },
  },
  created() {},
  methods: {
    legendSelector(e) {
      this.categories.get(e.id).whitelisted = e.checked;
      this.$emit("updateAndComputePaths");
    },
    mapToArray(data) {
      return mapToArray(data);
    },
    mergeThematic(e) {
      this.$emit("mergeThematic", e);
    },
  },
};
</script>

<style scoped>
</style>