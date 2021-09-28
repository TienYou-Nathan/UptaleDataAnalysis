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
    <a
      id="download"
      :href="
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(
          JSON.stringify({
            arrayScenes: [...mapToArray(this.mapScenes)],
            arrayCategories: [...mapToArray(this.mapCategories)],
            arrayThemes: [...mapToArray(this.mapThemes)],
          })
        )
      "
    >
      <i class="fas fa-download icon" @click="download"></i
    ></a>
  </div>
  <div id="uploadPrompt" v-if="currentWindow == 'upload'">
    <div id="background" @click="currentWindow = null" />
    <div id="content">
      <div :key="field.name" v-for="field in fields" @click="uploadFile">
        <label :for="field.name">{{ field.label }}</label>
        <input
          type="file"
          :id="field.name"
          :name="field.name"
          :accept="'.' + field.format"
          @change="fileChange"
        />
        <i>{{
          field.file
            ? field.file.name +
              "" +
              " " +
              ((field.file?.size / 1000000).toFixed(2) + "MB")
            : ""
        }}</i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapToArray } from "../../utilities";

export default {
  name: "FileLoader",
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
    isLoading: Number,
    fields: {
      type: Array,
      default: [
        {
          name: "fileLoader",
          label: "Select a file here",
          defaultPath: "",
          format: ".csv",
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
    uploadFile(e) {
      //We want to avoid triggering twice the same event
      if (e.target.tagName == "DIV") {
        e.target.querySelector("input").click();
      }
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

#uploadPrompt {
  position: fixed;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
#background {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
}
#content {
  border-radius: 10px;
  position: absolute;
  display: flex;
  flex-direction: row;
  top: 20%;
  bottom: 20%;
  left: 20%;
  right: 20%;
  background: white;
}
#content > * {
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 5px;
  border: 1px dashed black;
  border-radius: 10px;
  flex-basis: 0;
  flex-grow: 1;
  min-width: 0;
}
#content > *:hover {
  background: lightgray;
}
#content * {
  cursor: pointer;
}
#content * input {
  display: none;
}
input {
  display: none;
}
</style>