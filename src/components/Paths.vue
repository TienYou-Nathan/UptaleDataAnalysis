<template>
    <div :key="path.id" v-for="path in paths">
        <Path :path='path' :display='display'/>
    </div>    
</template>

<script>
import Path from './Path.vue'

export default {
    name : 'Paths',
    components: {
        Path,
    },
    props : {
        paths : Array,
        display : String,
    }
}
</script>

<style scoped>

</style>