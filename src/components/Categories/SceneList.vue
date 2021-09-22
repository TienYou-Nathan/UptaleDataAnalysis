<template>
        <div v-for="scene in arrayScenes" :key="scene.id">
            <div> {{scene.name}} <Category :categoryName='scene.category' :color='this.mapCategories.get(scene.category).color' :scene='scene'/> <Theme :theme='scene.theme'/> </div>
        </div>
</template>

<script>
import Category from './Category.vue'
import Theme from './Theme.vue'
export default {
    name : 'SceneList',
    props:{
        arrayScenes:{
            type:Array,
            default : []
        },
        mapCategories:{
            type:Map,
            default : []
        }
    },
    components: {
        Theme,
        Category
    },
    created(){
        console.log(this.mapCategories.get("hub").color)
    }
}
</script>

<style scoped>

</style>