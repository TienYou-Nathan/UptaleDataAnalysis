<template>
  <span
    @dragstart="dragStart"
    @dragend="dragEnd"
    :style="{ background: color }"
    draggable="true"
    :class="persistent ? 'persistent' : null"
    >{{ name }}</span
  >
</template>

<script>
export default {
  name: "SceneProperty",

  props: {
    name: {
      type: String,
    },
    color: {
      type: String,
    },
    scene: {
      type: Object,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "category",
    },
  },
  methods: {
    dragStart(e) {
      e.dropEffect = "move";
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text", this.name);
      e.dataTransfer.setData("type", this.type);
    },
    dragEnd(e) {
      if (
        e.dataTransfer.dropEffect == "move" &&
        !e.dataTransfer.mozUserCancelled &&
        !this.persistent
      ) {
        this.scene[type] = "";
      }
    },
  },
};
</script>

<style scoped>
span {
  border: 2px solid;
  cursor: grab;
  min-height: calc(1em + 2px);
}
</style>