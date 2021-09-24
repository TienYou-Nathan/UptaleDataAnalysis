<template>
  <Sidebar @sidebar_click="sidebarManager" />

  <div id="nav" :style="{ 'margin-left': sidebarWidth }">
    <Header title="VR@COVID Paths Analysis" />
    <FileLoader @filesLoaded="computeData" :fields="fields" />

    <div v-if="display == 'all'">
      <AllRoutes :paths="paths" />
    </div>

    <div v-if="display == 'compute'">
      <ComputedRoutes
        :categories="categories"
        :computedPaths="computedPaths"
        @updateAndComputePaths="updateAndComputePaths"
        @mergeThematic="mergeThematic"
      />
    </div>

    <div v-if="display == 'categories'">
      <SceneList
        :mapScenes="scenes"
        :mapCategories="categories"
        :mapThemes="themes"
      />
    </div>
  </div>
</template>

<script>
import { arrayToMap } from "./utilities";

import ComputedRoutes from "./components/Routes/Computed/ComputedRoutes.vue";
import AllRoutes from "./components/Routes/All/AllRoutes.vue";
import SceneList from "./components/Categories/SceneList.vue";

import Sidebar from "./components/Sidebar/Sidebar.vue";
import { sidebarWidth } from "@/components/Sidebar/state";

import Header from "./components/Header.vue";
import FileLoader from "./components/FileLoader.vue";

export default {
  name: "App",
  components: {
    Header,
    FileLoader,
    ComputedRoutes,
    AllRoutes,
    Sidebar,
    SceneList,
  },
  data() {
    return {
      //page to show
      display: "all",
      //raw general file
      general_usage_output: [],
      //raw detail file
      detail_usage_output: [],
      //an entry per session, list of scenes visited this session
      paths: [],
      //list of reduced and merged paths
      computedPaths: [],
      //data about each scene
      scenes: [],
      //data about each categories
      categories: [],
      //data about each theme
      themes: [],
      //option for computed paths
      merge_themes: false,
      //data files loaded
      fields: [
        {
          name: "general",
          label: "Select general data file file here",
          defaultPath: "/general.csv",
          format: "csv",
        },
        {
          name: "detail",
          label: "Select detail data file file here",
          defaultPath: "/detail.csv",
          format: "csv",
        },
        {
          name: "categories",
          label: "Select categories and themes data file here",
          defaultPath: "/sceneInfo.json",
          format: "json",
        },
      ],
    };
  },
  setup() {
    return { sidebarWidth };
  },
  created() {
    return;
  },
  methods: {
    maptoarray(m) {
      let arr = [];
      for (const value of m.values()) {
        arr.push(value);
      }
      return arr;
    },
    updateAndComputePaths(e) {
      this.updatePathsWhitelist(this.paths);
      this.computePaths(this.paths);
    },

    mergeThematic(e) {
      this.merge_themes = e;
      this.computePaths(this.paths);
    },

    sidebarManager(to) {
      this.display = to;
    },

    updatePathsWhitelist(paths) {
      paths.forEach((p) => {
        this.updatePathWhiteList(p.scenes);
      });
    },

    //adapte la whitelist d'un parcours en fonction de la whitelist des catégories
    updatePathWhiteList(path) {
      path.forEach((e) => {
        e.whitelisted = this.categories.get(e.category).whitelisted;
      });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#nav {
  padding: 30px;
}
</style>
