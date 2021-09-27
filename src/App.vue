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
import ComputedRoutes from "./components/Routes/Computed/ComputedRoutes.vue";
import AllRoutes from "./components/Routes/All/AllRoutes.vue";
import SceneList from "./components/Categories/SceneList.vue";

import Sidebar from "./components/Sidebar/Sidebar.vue";
import { sidebarWidth } from "@/components/Sidebar/state";

import Header from "./components/Header.vue";
import FileLoader from "./components/FileLoader.vue";
import { arrayToMap, mapToArray } from "./utilities";

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
      computeWorker: Worker,
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
    this.computeWorker = new Worker("/compute.js");
    this.computeWorker.onmessage = (e) => {
      if (e.data.order == "computeData") {
        this.scenes = e.data.scenes;
        this.categories = e.data.categories;
        this.themes = e.data.themes;
        this.paths = e.data.paths;
        this.detail_usage_output = e.data.detail_usage_output;
        this.general_usage_output = e.data.general_usage_output;
        this.computedPaths = e.data.computedPaths;
      } else if (e.data.order == "computePaths") {
        this.computedPaths = e.data.computedPaths;
      }
    };
  },
  methods: {
    updateAndComputePaths(e) {
      this.updatePathsWhitelist(this.paths)
      //Ugly hack for proxy object cloning
      this.computeWorker.postMessage(
        JSON.parse(
          JSON.stringify({
            order: "computePaths",
            paths: this.paths,
            scenes: mapToArray(this.scenes),
            merge_themes: this.merge_themes,
          })
        )
      );
    },

    mergeThematic(e) {
      this.merge_themes = e;
      //Ugly hack for proxy object cloning
      this.computeWorker.postMessage(
        JSON.parse(
          JSON.stringify({
            order: "computePaths",
            paths: this.paths,
            scenes: mapToArray(this.scenes),
            merge_themes: this.merge_themes,
          })
        )
      );
    },

    sidebarManager(to) {
      this.display = to;
    },

    updatePathsWhitelist(paths) {
      paths.forEach((p) => {
      //adapte la whitelist d'un parcours en fonction de la whitelist des catégories
      paths.forEach((p) => {
        p.scenes.forEach((e) => {
          e.whitelisted = this.categories.get(e.category).whitelisted;
        });
      });
    },

    computeData(files) {
      this.computeWorker.postMessage({
        order: "computeData",
        files,
        merge_themes: this.merge_themes,
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
