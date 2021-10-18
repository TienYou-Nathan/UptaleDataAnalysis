<template>
  <Sidebar @sidebar_click="sidebarManager" />
  <a
    id="download"
    display="none"
    :href="serializedDatabaseURL"
    download="database.sql"
  />
  <div id="nav" :style="{ 'margin-left': sidebarWidth }">
    <Header
      id="Header"
      title="VR@COVID Paths Analysis"
      @filesLoaded="computeData"
      @downloadDatabase="downloadDatabase"
      :isLoading="isLoading"
      :progress="progress"
      :progressMessage="progressMessage"
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
        @deleteUserGroup="deleteUserGroup"
      />
    </div>

    <div id="container" v-if="display == 'SQL'">
      <SQLPlayground
        @SQLRequest="sqlDebug"
        :downloadData="sqlDebugDataObject"
        :columns="sqlDebugData.columns"
        :values="sqlDebugData.values"
      />
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

import { WorkerManager } from "./WorkerManager";

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
  deleteUserGroup,
  debug,
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
      title: "VR@COVID Paths Analysis",
      sqlWorker: WorkerManager,
      computeWorker: Worker,
      serializedDatabase: "",
      serializedDatabaseURL: "",
      sqlDebugDataObject: {},
      //page to show
      display: "SQL",
      scenes: [],
      categories: [],
      themes: [],
      isLoading: 0,
      progress: 0,
      progressMessage: "",
      //option for computed paths
      merge_themes: false,
      sqlDebugData: { columns: [], values: [] },
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
      this.sqlWorker = new WorkerManager(
        new Worker("/scripts/workers/database.js")
      );

      this.sqlWorker.onProgress = (data) => {
        console.log(data);
        this.progress = data.progress;
        this.progressMessage = data.message;
      };

      if (files.database) {
        await this.sqlWorker.send({
          id: this.sqlWorker.id++,
          action: "open",
          buffer: files.database,
        });
      } else {
        await this.sqlWorker.send({
          id: this.sqlWorker.id++,
          action: "open",
        });

        await this.sqlWorker.send({
          id: this.sqlWorker.id++,
          action: "extractCSVData",
          files,
        });
      }
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
      this.isLoading = 0;
    },
    async deleteUserGroup(groupId) {
      this.isLoading = 1;
      console.log("deleteUserGroup");
      await deleteUserGroup(this.sqlWorker, groupId);
      console.log("getUsersGroups");
      this.usersGroups = await getUsersGroups(this.sqlWorker);
      console.log("getUsers");
      this.users = await getUsers(this.sqlWorker);
      this.isLoading = 0;
    },
    async getSerializedDatabase() {
      let data = (
        await this.sqlWorker.send({
          id: this.sqlWorker.id++,
          action: "export",
        })
      ).results;
      return new Blob([data], { type: "application/octet-stream" });
    },
    async downloadDatabase() {
      this.loading = 1;
      this.serializedDatabase = await this.getSerializedDatabase();
      URL.revokeObjectURL(this.serializedDatabaseURL);
      this.serializedDatabaseURL = URL.createObjectURL(this.serializedDatabase);
      this.loading = 0;
      download.setAttribute("href", this.serializedDatabaseURL);
      download.click();
    },

    async sqlDebug(request) {
      ({ data: this.sqlDebugData, dataObject: this.sqlDebugDataObject } =
        await debug(this.sqlWorker, request));
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
