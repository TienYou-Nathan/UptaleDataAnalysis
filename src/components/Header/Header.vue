<template>
  <header>
    <progress
      v-if="progress > 0 && progress < 100"
      id="progress"
      max="100"
      :value="progress"
    ></progress>
    <h1>{{ title }}</h1>
    <FileLoader
      @filesLoaded="filesLoaded"
      @downloadDatabase="$emit('downloadDatabase')"
      :progress="progress"
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
  emits: ["filesLoaded", "updateSerializedDatabase", "downloadDatabase"],
  data() {
    return {};
  },
  props: {
    progress: 0,
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
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
#progress {
  position: absolute;
  left: 0;
  width: 100%;
  top: 0;
}
</style>
