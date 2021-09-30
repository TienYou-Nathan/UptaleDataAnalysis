<template>
    <div id=buttonContainer>
        <PathButton v-for='path in data' :key='path.id' :path='path'/>
    </div>
</template>

<script>
import PathButton from './PathButton.vue'

export default {
  name: "PathSelector",
  components : {
      PathButton,
  },
  props: {
    data: Array
  }
};
</script>

<style scoped>
#buttonContainer{
    display:flex;
    align-items: flex-start;
}
</style>