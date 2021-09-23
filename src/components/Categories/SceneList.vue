<template>
  <div id="sceneList">
    <Scene
      v-for="scene in arrayScenes"
      :key="scene.id"
      :scene="scene"
      :mapCategories="mapCategories"
    />
    <div id="categoryList">
      <div id="categorySticky">
        <Category
          v-for="category in arrayCategories"
          :key="category.id"
          :categoryName="category.name"
          :color="category.color"
          :persistent="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Scene from "./Scene/Scene.vue";
import Category from "./Scene/Category.vue";

export default {
  name: "SceneList",
  components: {
    Scene,
    Category,
  },
  data() {
    return {
      arrayScenes: [],
      arrayCategories: [],
    };
  },
  props: {
    title: {
      type: String,
      default: "Unknown Title",
    },
    mapScenes: {
      type: Map,
      default: [],
    },
    mapCategories: {
      type: Map,
      default: [],
    },
  },
  created() {
    this.mapScenes.forEach((value, key) => {
      let temp = value;
      temp.id = key;
      this.arrayScenes.push(temp);
    });

    this.mapCategories.forEach((value, key) => {
      let temp = value;
      temp.id = key;
      this.arrayCategories.push(temp);
    });
    console.log(this.arrayCategories);
  },
};
</script>

<style scoped>
#sceneList {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}
#categoryList{
  grid-column-start: 4;
  /* Firefox workaround to 1/-1 */
  grid-row: 1/9999999999;
}
#categorySticky{
  display: flex;
  flex-direction: column;
  position:sticky;
  top:0px;
}
</style>