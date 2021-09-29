<template>
  <span
    class="container"
    @dragstart="dragStart"
    @dragend="dragEnd"
    :style="{
      background: object ? object.color : '#000000',
      opacity: opacity,
      border: border,
    }"
    :draggable="this.object && this.persistent ? true : false"
    :class="persistent ? 'persistent' : null"
    ><span class="propertyName">{{ object?.id }}</span>
    <input
      type="color"
      :value="object ? object.color : '#000000'"
      v-if="persistent"
      @change="colorchange"
    />
    <button v-if="this.object && persistent" @click="deleteProperty">
      Delete
    </button>
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
  emits: ["deleteProperty"],
  props: {
    object: {
      type: Object,
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
      e.dataTransfer.setData("text", this.object.id);
      e.dataTransfer.setData("type", this.type);
      this.opacity = 0.5;
    },
    dragEnd(e) {
      this.opacity = 1;
    },
    colorchange(e) {
      this.object.color = e.srcElement.value;
    },
    deleteProperty() {
      this.$emit("deleteProperty", { type: this.type, name: this.object.id });
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