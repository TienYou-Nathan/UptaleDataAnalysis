<template>
  <div class="path">
    <h3>
      Id :
      {{
        path.proportion == undefined
          ? path.id
          : `${path.id}  -  Entries : ${
              path.entries
            }  -  Proportion : ${path.proportion.toFixed(2)}`
      }}
    </h3>
    <p>{{ path.name }}</p>
    <div v-if="display == 'all'" class="scenes_path">
      <div
        :key="scene.enterTime"
        v-for="scene in path.scenes"
        class="scenes_path"
      >
        <i class="fas fa-arrow-right" />
        <SceneInPath :scene="scene.scene" :time="scene.enterTime" />
      </div>
    </div>
    <div v-if="display == 'compute'" class="scenes_path">
      <div :key="scene.id" v-for="scene in path.path" class="scenes_path">
        <i class="fas fa-arrow-right" />
        <SceneInPathComputed :scene="scene" :categoriesInfo="categories" />
      </div>
    </div>
  </div>
</template>

<script>
import SceneInPath from "./SceneInPath.vue";
import SceneInPathComputed from "./SceneInPathComputed.vue";

export default {
  name: "Path",
  components: {
    SceneInPath,
    SceneInPathComputed,
  },
  props: {
    path: Object,
    display: String,
    categories: Map,
  },
};
</script>

<style scoped>
.fas {
  color: red;
}
.path {
  background: #f4f4f4;
  margin: 5px;
  padding: 10px 20px;
  cursor: pointer;
}
.path.reminder {
  border-left: 5px solid green;
}
.path h3 {
  display: flex;
  align-items: center;
  justify-content: left;
}

.scenes_path {
  display: flex;
  flex-wrap: wrap;
  /* for horizontal aligning of child divs */
  justify-content: left;
  /* for vertical aligning */
  align-items: center;
}
</style>