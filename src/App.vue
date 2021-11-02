<template>
  <Sidebar @sidebar_click="sidebarManager" />
  <a
    id="download"
    display="none"
    :href="serializedDatabaseURL"
    download="database.db"
  />
  <div id="nav" :style="{ 'margin-left': sidebarWidth }">
    <Header id="Header" title="" @downloadDatabase="downloadDatabase" />

    <div v-if="display == 'categories'">
      <SceneList />
    </div>

    <div id="container" v-if="display == 'Users'">
      <UsersSetup />
    </div>

    <div v-if="display == 'Analysis'">
      <Analysis />
    </div>

    <div v-if="display == 'SessionLogin'">
      <SessionLogin />
    </div>

    <div id="container" :hidden="!(display == 'SQL')">
      <SQLPlayground />
    </div>
  </div>
</template>

<script>
import SceneList from "./components/Categories/SceneList.vue";
import SQLPlayground from "./components/SQL/SQLPlayground.vue";
import Analysis from "./components/SQL/Analysis.vue";

import UsersSetup from "./components/Users/UsersSetup.vue";
import SessionLogin from "./components/Users/SessionLogin.vue";

import Sidebar from "./components/Sidebar/Sidebar.vue";
import { sidebarWidth } from "@/components/Sidebar/state";

import Header from "./components/Header/Header.vue";

export default {
  name: "App",
  components: {
    Header,
    SceneList,
    Sidebar,
    Analysis,
    SQLPlayground,
    UsersSetup,
    SessionLogin,
  },
  data() {
    return {
      title: "VR@COVID Paths Analysis",
      computeWorker: Worker,
      serializedDatabase: "",
      serializedDatabaseURL: "",

      //page to show
      display: "SQL",
      //option for computed paths
      sqlDebugData: { columns: [], values: [] },
    };
  },
  setup() {
    return { sidebarWidth };
  },
  methods: {
    sidebarManager(to) {
      this.display = to;
    },

    sceneUpdate(scene) {
      this.scenes.set(scene.id, scene);
      this.updateAndComputePaths();
    },
    async getSerializedDatabase() {
      let data = (
        await this.$store.state.sqlWorker.send({
          id: this.$store.state.sqlWorker.id,
          action: "export",
        })
      ).results;
      this.$store.commit("incrementWorkerId");
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
