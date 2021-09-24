<template>
  <div>
    <div :key="field.name" v-for="field in fields">
      <label :for="field.name">{{ field.label }}</label>
      <input type="file" :id="field.name" :name="field.name" accept=".csv" />
    </div>
  </div>
  <button id="start" v-on:click="startAnalysis()">Start Analysis</button>
</template>

<script>
export default {
  name: "FileLoader",
  props: {
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
        const request = document.getElementById(f.name).files[0];
        query.push(
          request != undefined
            ? this.load_file(request)
            : d3[f.format](f.defaultPath)
        );
      });

      const arr = await Promise.all(query);
      let result = {};
      this.fields.forEach((f, i) => {
        result[f.name] = arr[i];
      });

      this.$emit("filesLoaded", result);
    },
  },
};
</script>

<style scoped>
</style>