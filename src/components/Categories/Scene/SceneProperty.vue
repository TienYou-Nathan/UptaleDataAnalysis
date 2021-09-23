<template>
  <span
    @dragstart="dragStart"
    @dragend="dragEnd"
    :style="{ background: color, opacity: opacity, border: border }"
    draggable="true"
    :class="persistent ? 'persistent' : null"
    >{{ name }}</span
  >
</template>

<script>
export default {
  name: "SceneProperty",
  data() {
    return {
      opacity: 1,
    };
  },
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
    border: {
      type: String,
      default: "",
    },
  },
  methods: {
    dragStart(e) {
      e.dropEffect = "move";
      e.dataTransfer.effectAllowed = this.persistent ? "copy" : "move";
      e.dataTransfer.setData("text", this.name);
      e.dataTransfer.setData("type", this.type);
      if (!this.persistent) {
        //send data to remove old property from scene on drop
        e.dataTransfer.setData("origin", this.scene.name);
      }
      this.opacity = 0.5;
    },
    dragEnd(e) {
      this.opacity = 1;
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
.persistent {
  margin: 5px;
  padding: 5px;
  border-radius: 5px;
}
</style>