<template>
  <div class="sceneInPath">
    <p>{{ scene }}</p>
    <p>{{ time.toString() }}</p>
  </div>
</template>

<script>
export default {
  name: "SceneInPath",
  props: {
    scene: {
      type: String,
      default: "Unknown Scene",
    },
    time: {
      type: Date,
      default: "Unknown Time",
    },
  },
};
</script>

<style scoped>
.sceneInPath {
  background: #bebebe;
  margin: 5px;
  padding: 5px 5px;
  width: auto;
}
</style>