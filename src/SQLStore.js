import { createStore } from "vuex";

import { WorkerManager } from "./WorkerManager";

import {
  getScenes,
  getCategories,
  getThemes,
  getUsers,
  getUsersGroups,
  getSessions,
  addCategory,
  addTheme,
  addUserGroup,
  addUserGroupAssociation,
  updateCategory,
  updateTheme,
  updateScene,
  updateUserGroup,
  updateUser,
  deleteUserGroup,
  deleteCategory,
  deleteTheme,
  deleteUserGroupAssociation,
} from "./sqlRequests";

const sqlWorker = new WorkerManager(new Worker("scripts/workers/database.js"));

export const SQLStore = createStore({
  state() {
    return {
      scenes: [],
      categories: [],
      themes: [],
      users: [],
      usersGroups: [],
      sessions:[],
      progress: {
        progress: 0,
        message: "",
      },
      isLoading: 0,
      sqlWorker: sqlWorker,
    };
  },
  mutations: {
    setData(state, { key, value }) {
      state[key] = value;
    },
    incrementWorkerId(state) {
      return state.sqlWorker.id++;
    },
  },
  actions: {
    async computeData({ commit, state }, files) {
      commit("setData", { key: "IsLoading", value: 0 });
      if (files.database) {
        await sqlWorker.send({
          id: sqlWorker.id++,
          action: "open",
          buffer: files.database,
        });
      } else {
        await sqlWorker.send({
          id: sqlWorker.id++,
          action: "open",
        });

        await sqlWorker.send({
          id: sqlWorker.id++,
          action: "extractCSVData",
          files,
        });
      }
      commit("setData", { key: "scenes", value: await getScenes(sqlWorker) });
      commit("setData", {
        key: "categories",
        value: await getCategories(sqlWorker),
      });
      commit("setData", { key: "themes", value: await getThemes(sqlWorker) });
      commit("setData", { key: "users", value: await getUsers(sqlWorker) });
      commit("setData", {
        key: "usersGroups",
        value: await getUsersGroups(sqlWorker),
      });
      commit("setData", {
        key: "sessions",
        value: await getSessions(sqlWorker),
      });
      commit("setData", { key: "IsLoading", value: 2 });
      commit("setData", { key: "IsLoading", value: 0 });
    },
    async addCategory({ commit, state }, category) {
      commit("setData", { key: "IsLoading", value: 1 });
      await addCategory(sqlWorker, category);
      commit("setData", {
        key: "categories",
        value: await getCategories(sqlWorker),
      });
      commit("setData", { key: "IsLoading", value: 0 });
    },
    async addTheme({ commit, state }, theme) {
      commit("setData", { key: "IsLoading", value: 1 });
      await addTheme(sqlWorker, theme);
      commit("setData", { key: "themes", value: await getThemes(sqlWorker) });
      commit("setData", { key: "IsLoading", value: 0 });
    },
    async addUserGroup({ commit, state }, userGroup) {
      commit("setData", { key: "IsLoading", value: 1 });
      await addUserGroup(sqlWorker, userGroup);
      commit("setData", {
        key: "usersGroups",
        value: await getUsersGroups(sqlWorker),
      });
      commit("setData", { key: "IsLoading", value: 0 });
    },
    async addUserGroupAssociation({ commit, state }, UserGroupAssociation) {
      commit("setData", { key: "IsLoading", value: 1 });
      await addUserGroupAssociation(sqlWorker, UserGroupAssociation);
      commit("setData", { key: "users", value: await getUsers(sqlWorker) });
      commit("setData", { key: "IsLoading", value: 0 });
    },
    async updateCategory({ commit, state }, category) {
      commit("setData", { key: "IsLoading", value: 1 });
      await updateCategory(sqlWorker, category);
      commit("setData", {
        key: "categories",
        value: await getCategories(sqlWorker),
      });
      commit("setData", { key: "scenes", value: await getScenes(sqlWorker) });
      commit("setData", { key: "IsLoading", value: 0 });
    },
    async updateTheme({ commit, state }, theme) {
      commit("setData", { key: "IsLoading", value: 1 });
      await updateTheme(sqlWorker, theme);
      commit("setData", { key: "themes", value: await getThemes(sqlWorker) });
      commit("setData", { key: "scenes", value: await getScenes(sqlWorker) });
      commit("setData", { key: "IsLoading", value: 0 });
    },
    async updateScene({ commit, state }, scene) {
      commit("setData", { key: "IsLoading", value: 1 });
      await updateScene(sqlWorker, scene);
      commit("setData", { key: "scenes", value: await getScenes(sqlWorker) });
      commit("setData", { key: "IsLoading", value: 0 });
    },
    async updateUserGroup({ commit, state }, userGroup) {
      commit("setData", { key: "IsLoading", value: 1 });
      await updateUserGroup(sqlWorker, userGroup);
      commit("setData", {
        key: "usersGroups",
        value: await getUsersGroups(sqlWorker),
      });
      commit("setData", { key: "users", value: await getUsers(sqlWorker) });
      commit("setData", {
        key: "sessions",
        value: await getSessions(sqlWorker),
      });
      commit("setData", { key: "IsLoading", value: 0 });
    },
    async updateUser({ commit, state }, user) {
      commit("setData", { key: "IsLoading", value: 1 });
      await updateUser(sqlWorker, user);
      commit("setData", { key: "users", value: await getUsers(sqlWorker) });
      commit("setData", {
        key: "sessions",
        value: await getSessions(sqlWorker),
      });
      commit("setData", { key: "IsLoading", value: 0 });
    },
    async deleteUserGroup({ commit, state }, groupId) {
      commit("setData", { key: "IsLoading", value: 1 });
      await deleteUserGroup(sqlWorker, groupId);
      commit("setData", {
        key: "usersGroups",
        value: await getUsersGroups(sqlWorker),
      });
      commit("setData", { key: "users", value: await getUsers(sqlWorker) });
      commit("setData", {
        key: "sessions",
        value: await getSessions(sqlWorker),
      });
      commit("setData", { key: "IsLoading", value: 0 });
    },
    async deleteCategory({ commit, state }, category) {
      commit("setData", { key: "IsLoading", value: 1 });
      await deleteCategory(sqlWorker, category);
      commit("setData", { key: "scenes", value: await getScenes(sqlWorker) });
      commit("setData", {
        key: "categories",
        value: await getCategories(sqlWorker),
      });
      commit("setData", { key: "IsLoading", value: 0 });
    },
    async deleteTheme({ commit, state }, theme) {
      commit("setData", { key: "IsLoading", value: 1 });
      await deleteTheme(sqlWorker, theme);
      commit("setData", { key: "scenes", value: await getScenes(sqlWorker) });
      commit("setData", { key: "themes", value: await getThemes(sqlWorker) });
      commit("setData", { key: "IsLoading", value: 0 });
    },
    async deleteUserGroupAssociation({ commit, state }, UserGroupAssociation) {
      commit("setData", { key: "IsLoading", value: 1 });
      await deleteUserGroupAssociation(sqlWorker, UserGroupAssociation);
      commit("setData", { key: "users", value: await getUsers(sqlWorker) });
      commit("setData", {
        key: "sessions",
        value: await getSessions(sqlWorker),
      });
      commit("setData", { key: "IsLoading", value: 0 });
    },
  },
});

sqlWorker.onProgress = (progress) => {
  SQLStore.commit("setData", { key: "progress", value: 0 });
};
