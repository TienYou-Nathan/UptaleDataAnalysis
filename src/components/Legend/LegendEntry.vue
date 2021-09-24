<template>
  <div class="entry_container">
    <div class="entry_color" :style="{ background: entry.color }"></div>
    <p class="entry_name">{{ entry.id }}</p>
    <input
      class="entry_checkbox"
      type="checkbox"
      :checked="entry.name"
      @click="$emit('check', { id: entry.id, checked: $event.target.checked })"
    />
  </div>
</template>

<script>
export default {
  name: "LegendEntry",
  emits: ["check"],
  props: {
    entry: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.entry_container {
  background: #e2e2e2;
  margin: 2px 0px;
  padding: 0px 4px;
  display: flex;
  justify-content: left;
  align-items: center;
  height: auto;
}

.entry_color {
  width: 10%;
  height: 20px;
}

.entry_name {
  margin-left: 5%;
}

.entry_checkbox {
  margin-left: auto;
}
</style>