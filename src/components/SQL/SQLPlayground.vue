<template>
  <textarea
    id="area"
    ref="area"
    autonomplete="on"
    autocorrect="off"
    spellcheck="off"
  ></textarea>
  <a v-if="downloadDataURL" :href="downloadDataURL" download="result.csv"
    >Download Results</a
  >
  <ViewTable :data="{ columns: data.columns, values: reducedValues }" />
</template>

<script>
import { wait } from "../../utilities";
import { debug } from "../../sqlRequests";

import ViewTable from "./ViewTable.vue";

export default {
  name: "SQLPlayground",
  emits: ["SQLRequest", "progress"],
  components: {
    ViewTable,
  },
  data() {
    return {
      data: {
        columns: [],
        values: [],
      },
      dataObject: {},
      downloadDataURL: null,
      reducedValues: [],
      reducedInterval: 0,
      codeMirror: null,
    };
  },
  watch: {
    dataObject() {
      URL.revokeObjectURL(this.downloadDataURL);
      this.downloadDataURL = URL.createObjectURL(
        new Blob([d3.csvFormat(this.dataObject)], { type: "text/csv" })
      );
    },
    data() {
      this.showData();
    },
  },
  props: {
    columns: Array,
    values: Array,
  },
  mounted() {
    this.codeMirror = CodeMirror.fromTextArea(this.$refs.area, {
      lineNumbers: true,
      mode: "text/x-mysql",
      viewportMargin: Infinity,
      indentWithTabs: true,
      smartIndent: true,
      lineNumbers: true,
      matchBrackets: true,
      autofocus: true,
      extraKeys: {
        "Ctrl-Enter": this.execEditorContents,
        // "Ctrl-S": savedb,
      },
    });
  },
  methods: {
    async execEditorContents() {
      ({ data: this.data, dataObject: this.dataObject } = await debug(
        this.$store.state.sqlWorker,
        this.codeMirror.getValue() + ";"
      ));
    },
    async showData() {
      clearInterval(this.reducedInterval);
      this.$store.commit("setData", {
        key: "progress",
        value: {
          progress: 100,
        },
      });

      let delay = 15;
      let batchSize = 25;
      await wait(delay);
      this.reducedValues = [];
      let valuesCopy = [...this.data.values];
      let totalLength = this.data.values.length;
      let currentLength = 0;

      this.reducedInterval = setInterval(() => {
        let temp = valuesCopy.splice(batchSize);
        this.reducedValues = [...this.reducedValues, ...valuesCopy];
        valuesCopy = temp;
        currentLength = this.reducedValues.length;
        this.$store.commit("setData", {
          key: "progress",
          value: {
            progress: (currentLength * 100) / totalLength,
            message: `Displaying results\n${currentLength}/${totalLength}\nCSV ready`,
          },
        });
        if (valuesCopy.length == 0) {
          clearInterval(this.reducedInterval);
        }
      }, delay);
    },
  },
};
</script>

<style scoped>
#area {
  width: 50%;
  height: 20vh;
}
table {
  width: auto;
  margin: auto;
  border: 1px solid black;
  border-collapse: collapse;
  margin-bottom: 10px;
  text-align: left;
  font-family: monospace;
}
th,
td {
  border: 1px solid black;
}
</style>
<style>
.CodeMirror {
  text-align: left;
  height: auto;
  border: 1px solid black;
}
</style>
