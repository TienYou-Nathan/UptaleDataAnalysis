<template>
  <span
    @dragstart="dragStart"
    @dragend="dragEnd"
    :style="{ background: color }"
    draggable="true"
    >{{ categoryName }}</span
  >
</template>

<script>
export default {
  name: "Category",

  props: {
    categoryName: {
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
  },
  methods: {
    dragStart(e) {
      e.dropEffect = "move";
      e.dataTransfer.setData("text", this.scene.category);
    },
    dragEnd(e) {
      if (
        e.dataTransfer.dropEffect == "move" &&
        !e.dataTransfer.mozUserCancelled &&
        !this.persistent
      ) {
        this.scene.category = null;
      }
    },
  },
};
</script>

<style scoped>
span {
  border: 2px solid;
  cursor: grab;
}
</style>