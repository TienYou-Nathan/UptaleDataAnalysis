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
    <span @click="currentWindow = 'download'">
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
  <Prompt
    v-if="currentWindow == 'download'"
    :data="perUserAnswers"
    @currentWindowChange="currentWindow = $event"
    :type="'propList'"
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
    };
  },
  props: {
    mapScenes: {
      type: Map,
      default: [],
    },
    mapCategories: {
      type: Map,
      default: [],
    },
    mapThemes: {
      type: Map,
      default: [],
    },
    csvData: String,
    isLoading: Number,
    perUserAnswers: Object,
    fields: {
      type: Array,
      default: [
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
    },
  },
  emits: ["filesLoaded"],
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

      this.fields.forEach((f) => {
        let request = f.file;
        query.push(
          request != undefined
            ? this.load_file(request)
            : d3[f.format](f.defaultPath)
        );
      });
      let result = {};
      let arr = await Promise.all(query);
      this.fields.forEach((f, i) => {
        result[f.name] = arr[i];
      });
      this.$emit("filesLoaded", result);
    },

    fileChange(e) {
      this.fields.find((field) => field.name == e.target.id).file =
        e.target.files[0];
    },
    mapToArray(data) {
      return mapToArray(data);
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