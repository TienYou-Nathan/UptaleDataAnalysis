<template>
    <span @drag="dragStart" :style="{ 'background': color }" draggable="true">{{categoryName}}</span>
</template>

<script>
export default {
    name : 'Category',
    props:{
        categoryName:{
            type:String
        },
        color:{
            type:String
        },
        scene:{
            type:Object
        }
    },
    methods:{
        dragStart(){
            console.log(this.scene)
        }
    }
    
}
</script>

<style scoped>
span{
    border: 2px solid;
    cursor:grab;
}
</style>