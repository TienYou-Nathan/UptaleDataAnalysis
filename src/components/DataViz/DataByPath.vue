<template>
    <div>
        <PathVisualization :data='data[0].data'/>
    </div>
</template>

<script>
import PathSelector from "./PathSelector.vue";
import UserList from "./UserList.vue";
import PathVisualization from "./PathVisualization.vue";

export default {
  name: "DataByPath",
  components: {
    PathSelector,
    UserList,
    PathVisualization
  },
  props: {
    data: Array
  }
};
</script>

<style scoped>
</style>