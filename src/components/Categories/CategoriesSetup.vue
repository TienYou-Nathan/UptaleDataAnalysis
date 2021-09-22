<template>
  <button v-on:click="display='sceneList'" >Scenes List</button>
  <button v-on:click="display='sceneCategorySetup'" >Category Setup</button>
  <button v-on:click="display='sceneThemeSetup'" >Theme Setup</button>

  <div v-if='display=="sceneList"'>
      <SceneList :arrayScenes='arrayScenes' :mapCategories='mapCategories'/>
  </div>

  <div v-if='display=="sceneCategorySetup"'>
      <SceneCategorySetup :arrayScenes='arrayScenes'/>
  </div>

  <div v-if='display=="sceneThemeSetup"'>
      <SceneThemeSetup :arrayScenes='arrayScenes'/>
  </div>
</template>

<script>

import SceneList from './SceneList.vue'
import SceneCategorySetup from './SceneCategorySetup.vue'
import SceneThemeSetup from './SceneThemeSetup.vue'

export default {
    name: 'CategoriesSetup',
    data(){
        return {
            arrayScenes:[],
            display:"sceneList"
        }
    },
    components: {
        SceneList,
        SceneCategorySetup,
        SceneThemeSetup
    },
    props:{
        title:{
            type:String,
            default : 'Unknown Title'
        },
        mapScenes:{
            type:Map,
            default:[]
        },
        mapCategories:{
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