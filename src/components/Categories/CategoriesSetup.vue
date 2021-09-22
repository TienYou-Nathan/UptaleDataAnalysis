<template>
    <p>{{title}}</p>
    <div v-for="scene in arrayScenes" :key="scene.id">{{scene.name}}</div>
</template>

<script>

export default {
    name: 'CategoriesSetup',
    data(){
        return {
            arrayScenes:[]
        }
    }
    ,
    props:{
        title:{
            type:String,
            default : 'Unknown Title'
        },
        mapScenes:{
            type:Map,
            default:[]
        }
    },
    created(){
        this.mapScenes.forEach((value, key) => {
            let temp = value;
            temp.id = key;
            this.arrayScenes.push(temp);
        });
    }
}

</script>

<style scoped>

</style>