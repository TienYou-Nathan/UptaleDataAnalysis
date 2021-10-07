<template>
  <div id="accessButtons">
    <span v-if="!isLoading" @click="startAnalysis">
      <i class="fas fa-play-circle icon"></i>
    </span>
    <span v-if="isLoading == 1">
      <i class="fas fa-spinner fa-pulse icon"></i>
    </span>
    <span v-if="isLoading == 2">
      <i class="fas fa-spinner fa-spin icon"></i>
    </span>
    <span @click="currentWindow = 'upload'">
      <i class="fas fa-upload icon"></i>
    </span>
    <span @click="getSerializedDatabase">
      <i class="fas fa-download icon"></i>
    </span>
  </div>
  <Prompt
    v-if="currentWindow == 'upload'"
    :data="fields"
    @fileChange="fileChange"
    @currentWindowChange="currentWindow = $event"
    :type="'largePanels'"
  />
</template>

<script>
import { mapToArray } from "../../utilities";

import Prompt from "./Prompt.vue";

export default {
  name: "FileLoader",
  components: { Prompt },
  data() {
    return {
      currentWindow: "",
      isLoadingSerializedDatabase: 0,
    };
  },
  props: {
    isLoading: Number,
    perUserAnswers: Object,
    serializedDatabase: [],
    fields: {
      type: Array,
      default: [
        {
          name: "detail",
          label: "Select detail data file file here",
          defaultPath: "/detail.csv",
          format: "csv",
        },
        {
          name: "database",
          label: "Select database file here",
          defaultPath: "/database.sql",
          format: "sql",
        },
      ],
    },
  },
  emits: ["filesLoaded", "updateSerializedDatabase"],
  methods: {
    load_file: async function (file) {
      function readFileAsync(file) {
        return new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsText(file);
        });
      }

      let data;
      try {
        let contentBuffer = await readFileAsync(file);
        data = d3.csvParse(contentBuffer, d3.autoType); // see https://github.com/d3/d3-dsv#autoType
      } catch (err) {
        console.log(err);
      }

      return data;
    },
    startAnalysis: async function () {
      let query = [];
      let result = {};

      query.push(
        this.fields[0].file != undefined
          ? this.load_file(this.fields[0].file)
          : d3[this.fields[0].format](this.fields[0].defaultPath)
      );
      //If user selected a database manually
      if (this.fields[1].file) {
        result.database = new Uint8Array(
          await this.fields[1].file.arrayBuffer()
        );
        //if no database is selected but one is by default
      } else if (
        (await (await fetch("./database.sql")).blob()).type ==
        "application/x-sql; charset=utf-8"
      ) {
        result.database = new Uint8Array(
          await (await fetch("./database.sql")).arrayBuffer()
        );
      }

      let arr = await Promise.all(query);

      result[this.fields[0].name] = arr[0];

      this.$emit("filesLoaded", result);
    },
    fileChange(e) {
      this.fields.find((field) => field.name == e.target.id).file =
        e.target.files[0];
    },
    mapToArray(data) {
      return mapToArray(data);
    },
    getSerializedDatabase() {
      this.isLoadingSerializedDatabase = 1;
      this.$emit("downloadDatabase");
    },
  },
};
</script>

<style scoped>
#accessButtons {
  display: flex;
  align-items: center;
}
#accessButtons .icon {
  flex-basis: 0;
  flex-grow: 1;
  min-width: 0;
  margin: 10px;
  cursor: pointer;
}
</style>