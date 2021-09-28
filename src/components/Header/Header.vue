<template>
  <header>
    <h1>{{ title }}</h1>
    <FileLoader
      @filesLoaded="filesLoaded"
      :fields="fields"
      :isLoading="isLoading"
      :mapScenes="mapScenes"
      :mapCategories="mapCategories"
      :mapThemes="mapThemes"
      :csvData="csvData"
    />
  </header>
</template>

<script>
import FileLoader from "./FileLoader.vue";

export default {
  name: "Header",
  components: { FileLoader },
  emits: ["filesLoaded"],
  data() {
    return {};
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
    title: {
      type: String,
      default: "[Insert Title here]",
    },
    csvData: String,
    isLoading: Boolean,
    fields: {},
  },
  methods: {
    filesLoaded(data) {
      this.$emit("filesLoaded", data);
    },
  },
};
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
