<template>
  <div id="accessButtons">
    <!-- <span v-if="!isLoading" @click="startAnalysis">
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
    </span> -->
    <span @click="getSerializedDatabase">
      <i class="fas fa-download icon"></i>
    </span>
  </div>
  <Prompt
    v-if="!fields[0].file && !fields[1].file"
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
      fields: [
        {
          name: "detail",
          label: "Select detail data file file here",
          defaultPath: "/detail.csv",
          format: "csv",
        },
        {
          name: "database",
          label: "Select database file here",
          defaultPath: "/database.db",
          format: "db",
        },
      ],
    };
  },
  props: {
    isLoading: Number,
    perUserAnswers: Object,
    serializedDatabase: [],
  },
  emits: ["updateSerializedDatabase", "downloadDatabase"],
  created() {},
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
      if (this.fields[0].file) {
        query.push(this.load_file(this.fields[0].file));
      }
      //If user selected a database manually
      if (this.fields[1].file) {
        result.database = new Uint8Array(
          await this.fields[1].file.arrayBuffer()
        );
        //if no database is selected but one is by default
      } else if (
        (await (await fetch("./database.db")).blob()).type ==
        "application/x-sql; charset=utf-8"
      ) {
        result.database = new Uint8Array(
          await (await fetch("./database.db")).arrayBuffer()
        );
      }

      let arr = await Promise.all(query);

      result[this.fields[0].name] = arr[0];

      this.$store.dispatch("computeData", result);
    },
    fileChange(e) {
      this.fields.find((field) => field.name == e.target.id).file =
        e.target.files[0];
      console.log(this.fields);
      this.startAnalysis();
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