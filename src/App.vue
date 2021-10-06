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

    <div id="container" v-if="display == 'Users'">
      <UsersSetup
        :users="users"
        :usersGroups="usersGroups"
        @addUserGroup="addUserGroup"
        @updateUser="updateUser"
        @updateUserGroup="updateUserGroup"
      />
    </div>

    <div id="container" v-if="display == 'SQL'">
      <SQLPlayground :data="scorePerPathData" @SQLRequest="sqlDebug" />
    </div>
  </div>
</template>

<script>
import SceneList from "./components/Categories/SceneList.vue";
import SQLPlayground from "./components/SQL/SQLPlayground.vue";

import UsersSetup from "./components/Users/UsersSetup.vue";

import Sidebar from "./components/Sidebar/Sidebar.vue";
import { sidebarWidth } from "@/components/Sidebar/state";

import Header from "./components/Header/Header.vue";

import { workerManager } from "./workerManager";

import {
  getScenes,
  getCategories,
  getThemes,
  getUsers,
  getUsersGroups,
  addCategory,
  addTheme,
  addUserGroup,
  updateCategory,
  updateTheme,
  updateScene,
  updateUserGroup,
  updateUser,
} from "./sqlRequests";

export default {
  name: "App",
  components: {
    Header,
    SceneList,
    Sidebar,
    SQLPlayground,
    UsersSetup,
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
      this.users = await getUsers(this.sqlWorker);
      this.usersGroups = await getUsersGroups(this.sqlWorker);
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

    async addUserGroup(userGroup) {
      this.isLoading = 1;
      await addUserGroup(this.sqlWorker, userGroup);
      this.usersGroups = await getUsersGroups(this.sqlWorker);
      this.isLoading = 0;
    },

    async updateCategory(category) {
      this.isLoading = 1;
      await updateCategory(this.sqlWorker, category);
      this.categories = await getCategories(this.sqlWorker);
      this.scenes = await getScenes(this.sqlWorker);
      this.isLoading = 0;
    },

    async updateTheme(theme) {
      this.isLoading = 1;
      await updateTheme(this.sqlWorker, theme);
      this.themes = await getThemes(this.sqlWorker);
      this.scenes = await getScenes(this.sqlWorker);
      this.isLoading = 0;
    },

    async updateScene(scene) {
      this.isLoading = 1;
      await updateScene(this.sqlWorker, scene);
      this.scenes = await getScenes(this.sqlWorker);
      this.isLoading = 0;
    },

    async updateUserGroup(userGroup) {
      this.isLoading = 1;
      await updateUserGroup(this.sqlWorker, userGroup);
      this.usersGroups = await getUsersGroups(this.sqlWorker);
      this.users = await getUsers(this.sqlWorker);
      this.isLoading = 0;
    },

    async updateUser(user) {
      this.isLoading = 1;
      await updateUser(this.sqlWorker, user);
      this.users = await getUsers(this.sqlWorker);
      console.log(this.users);
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
