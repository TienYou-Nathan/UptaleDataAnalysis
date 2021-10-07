<template>
  <header>
    <h1>{{ title }}</h1>
    <FileLoader
      @filesLoaded="filesLoaded"
      @downloadDatabase="$emit('downloadDatabase')"
      :fields="fields"
      :isLoading="isLoading"
      :serializedDatabase="serializedDatabase"
    />
  </header>
</template>

<script>
import FileLoader from "./FileLoader.vue";

export default {
  name: "Header",
  components: { FileLoader },
  emits: ["filesLoaded", "updateSerializedDatabase"],
  data() {
    return {};
  },
  props: {
    serializedDatabase: [],
    title: {
      type: String,
      default: "[Insert Title here]",
    },
    perUserAnswers: Object,
    isLoading: Number,
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
