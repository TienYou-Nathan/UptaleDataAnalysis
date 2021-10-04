<template>
  <Sidebar @sidebar_click="sidebarManager" />

  <div id="nav" :style="{ 'margin-left': sidebarWidth }">
    <Header
      id="Header"
      title="VR@COVID Paths Analysis"
      :fields="fields"
      @filesLoaded="computeData"
      :isLoading="isLoading"
    />

    <div v-if="display == 'all'">
      <AllRoutes />
    </div>

    <div v-if="display == 'compute'">
      <ComputedRoutes
        @updateAndComputePaths="updateAndComputePaths"
        @mergeThematic="mergeThematic"
      />
    </div>

    <div v-if="display == 'categories'">
      <SceneList
        :scenes="scenes"
        :categories="categories"
        :themes="themes"
        @addCategory="addCategory"
        @addTheme="addTheme"
        @updateCategory="updateCategory"
        @updateTheme="updateTheme"
        @updateScene="updateScene"
      />
    </div>

    <div id="container" v-if="display == 'scorePerPath'">
      <DataByPath :data="scorePerPathData" />
    </div>

    <div id="container" v-if="display == 'SQL'">
      <SQLPlayground :data="scorePerPathData" @SQLRequest="sqlDebug" />
    </div>
  </div>
</template>

<script>
import ComputedRoutes from "./components/Routes/Computed/ComputedRoutes.vue";
import AllRoutes from "./components/Routes/All/AllRoutes.vue";
import SceneList from "./components/Categories/SceneList.vue";
import DataByPath from "./components/DataViz/DataByPath";
import SQLPlayground from "./components/SQL/SQLPlayground.vue";

import Sidebar from "./components/Sidebar/Sidebar.vue";
import { sidebarWidth } from "@/components/Sidebar/state";

import Header from "./components/Header/Header.vue";

import { workerManager } from "./workerManager";

import {
  getScenes,
  getCategories,
  getThemes,
  addCategory,
  addTheme,
  updateCategory,
  updateTheme,
  updateScene,
} from "./sqlRequests";

export default {
  name: "App",
  components: {
    Header,
    ComputedRoutes,
    AllRoutes,
    Sidebar,
    SceneList,
    DataByPath,
    SQLPlayground,
  },
  data() {
    return {
      sqlWorker: workerManager,
      databaseInsertion: workerManager,
      computeWorker: Worker,
      //page to show
      display: "SQL",
      scenes: [],
      categories: [],
      themes: [],
      isLoading: 0,
      //option for computed paths
      merge_themes: false,
    };
  },
  setup() {
    return { sidebarWidth };
  },
  created() {},
  computed() {},
  methods: {
    sidebarManager(to) {
      this.display = to;
    },

    sceneUpdate(scene) {
      this.scenes.set(scene.id, scene);
      this.updateAndComputePaths();
    },

    async computeData(files) {
      this.isLoading = 1;
      this.sqlWorker = workerManager(
        new Worker("/scripts/workers/database.js")
      );
      await this.sqlWorker.send({
        id: this.sqlWorker.id++,
        action: "extractCSVData",
        files,
      });

      this.scenes = await getScenes(this.sqlWorker);
      this.categories = await getCategories(this.sqlWorker);
      this.themes = await getThemes(this.sqlWorker);
      this.isLoading = 2;
      this.isLoading = 0;
    },

    async addCategory(category) {
      this.isLoading = 1;
      await addCategory(this.sqlWorker, category);
      this.categories = await getCategories(this.sqlWorker);
      this.isLoading = 0;
    },
    async addTheme(theme) {
      this.isLoading = 1;
      await addTheme(this.sqlWorker, theme);
      this.themes = await getThemes(this.sqlWorker);
      this.isLoading = 0;
    },

    async updateCategory(category) {
      this.isLoading = 1;
      await updateCategory(this.sqlWorker, category);
      this.categories = await getCategories(this.sqlWorker, category);
      this.scenes = await getScenes(this.sqlWorker);
      this.isLoading = 0;
    },

    async updateTheme(theme) {
      this.isLoading = 1;
      await updateTheme(this.sqlWorker, theme);
      this.themes = await getThemes(this.sqlWorker, theme);
      this.scenes = await getScenes(this.sqlWorker);
      this.isLoading = 0;
    },

    async updateScene(scene) {
      this.isLoading = 1;
      await updateScene(this.sqlWorker, scene);
      this.scenes = await getScenes(this.sqlWorker);
      console.log(this.scenes);
      this.isLoading = 0;
    },

    sqlDebug(request) {
      this.sqlWorker.send({
        id: this.sqlWorker.id++,
        action: "debug",
        sql: request,
      });
    },
  },
};
</script>

<style>
html {
  height: 100%;
}
body {
  height: 100%;
  margin: 0;
}

#app {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  transition: 0.3s ease;
  height: 100%;

  display: grid;
  grid-template-rows: min-content 1fr;
  grid-template-columns: 100%;
}
#Header {
  padding: 1vmin;
  grid-column: 1;
  grid-row: 1;
}
#container {
  padding: 1vmin;
  grid-column: 1;
  grid-row: 2;
}
</style>
