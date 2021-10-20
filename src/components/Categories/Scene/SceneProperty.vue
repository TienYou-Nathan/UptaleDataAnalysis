<template>
  <span
    class="container"
    @dragstart="dragStart"
    @dragend="dragEnd"
    :style="{
      background: color,
      opacity: opacity,
      border: border,
    }"
    :draggable="this.persistent ? true : false"
    :class="persistent ? 'persistent' : null"
    ><span class="propertyName">{{ name }}</span>
    <input
      type="color"
      :value="color"
      v-if="persistent"
      @change="colorchange"
    />
    <button v-if="persistent" @click="deleteProperty">Delete</button>
  </span>
</template>

<script>
export default {
  name: "SceneProperty",
  data() {
    return {
      opacity: 1,
    };
  },
  emits: ["deleteProperty", "updateProperty"],
  props: {
    id: "",
    color: "",
    name: "",
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
      e.dataTransfer.setData("Id", this.id);
      e.dataTransfer.setData("type", this.type);
      this.opacity = 0.5;
    },
    dragEnd() {
      this.opacity = 1;
    },
    colorchange(e) {
      this.$emit("updateProperty", {
        color: e.srcElement.value,
        id: this.id,
      });
    },
    deleteProperty() {
      this.$emit("deleteProperty", {
        id: this.id,
      });
    },
  },
};
</script>

<style scoped>
.container {
  border: 2px solid;
  min-height: calc(1em + 2px);
  display: flex;
  justify-content: flex-end;
  align-content: flex-end;
}
.persistent {
  cursor: grab;
  margin: 5px;
  padding: 5px;
  border-radius: 5px;
}
.propertyName {
  text-align: left;
  flex-grow: 1;
}
</style>