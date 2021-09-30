<template>
    <button id=pathbutton>
        Path #{{path.id}} 
    </button>
</template>

<script>

export default {
  name: "PathButton",
  props: {
    path: Object
  }
};
</script>

<style scoped>

#pathbutton{
    width : 100px;
}

</style>