<template>
  <header>
    <progress
      v-if="progress.progress > 0 && progress.progress < 100"
      id="progress"
      max="100"
      :value="progress.progress"
    ></progress>
    <pre
      v-if="progress.progress > 0 && progress.progress < 100"
      id="progressMessage"
      >{{ progress.message }}</pre
    >
    <h1>{{ title }}</h1>
    <FileLoader
      @downloadDatabase="$emit('downloadDatabase')"
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
  computed: {
    isLoading() {
      return this.$store.state.IsLoading;
    },
    progress() {
      return this.$store.state.progress;
    },
  },
  props: {
    serializedDatabase: [],
    title: {
      type: String,
      default: "[Insert Title here]",
    },
    perUserAnswers: Object,
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

#progressMessage {
  position: absolute;
  text-align: center;
  width: calc(100% - 2vmin);
}

#progress {
  position: absolute;
  left: 0;
  width: calc(100%);
  top: 0;
  appearance: none;
  height: 10px;
  border: 0;
}

#progress::-moz-progress-bar {
  background-image: -webkit-linear-gradient(
    -45deg,
    transparent 33%,
    rgba(0, 0, 0, 0.3) 33%,
    rgba(0, 0, 0, 0.3) 66%,
    transparent 33%
  );
  background-size: 35px 20px, 100% 100%, 100% 100%;
  background-color: red;

  animation: animate-stripes 2s linear infinite;
}

@keyframes animate-stripes {
  100% {
    background-position: 100px 0;
  }
}
</style>
