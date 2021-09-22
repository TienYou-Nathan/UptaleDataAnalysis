<template>
  <span
    @dragstart="dragStart"
    @dragend="dragEnd"
    :style="{ background: color }"
    draggable="true"
    :class="persistent ? 'persistent' : null"
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
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text", this.categoryName);
    },
    dragEnd(e) {
      if (
        e.dataTransfer.dropEffect == "move" &&
        !e.dataTransfer.mozUserCancelled &&
        !this.persistent
      ) {
        console.log(e);
        this.scene.category = "";
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
.persistent {
  grid-column-start: 4;
}
</style>