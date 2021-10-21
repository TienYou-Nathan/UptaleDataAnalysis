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
  <tt>
    <table>
      <tr>
        <th v-for="column in columns" :key="column">
          {{ column }}
        </th>
      </tr>
      <tr v-for="row in reducedValues" :key="row">
        <td v-for="cell in row" :key="cell">{{ cell }}</td>
      </tr>
    </table>
  </tt>
</template>

<script>
import { wait } from "../../utilities";

export default {
  name: "SQLPlayground",
  emits: ["SQLRequest", "progress"],
  components: {},
  data() {
    return {
      downloadDataURL: null,
      reducedValues: [],
      reducedInterval: 0,
      codeMirror: null,
    };
  },
  watch: {
    downloadData() {
      URL.revokeObjectURL(this.downloadDataURL);
      this.downloadDataURL = URL.createObjectURL(
        new Blob([d3.csvFormat(this.downloadData)], { type: "text/csv" })
      );
    },
    values() {
      this.showData();
    },
  },
  props: {
    downloadData: {},
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
    execEditorContents() {
      this.$emit("SQLRequest", this.codeMirror.getValue() + ";");
    },
    async showData() {
      clearInterval(this.reducedInterval);
      this.$emit("progress", {
        progress: 100,
      });
      await wait(15);
      this.reducedValues = [];
      let valuesCopy = [...this.values];
      let totalLength = this.values.length;
      let currentLength = 0;

      let delay = 15;
      let batchSize = 25;

      this.reducedInterval = setInterval(() => {
        let temp = valuesCopy.splice(batchSize);
        this.reducedValues = [...this.reducedValues, ...valuesCopy];
        valuesCopy = temp;
        currentLength = this.reducedValues.length;
        this.$emit("progress", {
          progress: (currentLength * 100) / totalLength,
          message: `Displaying results\n${currentLength}/${totalLength}\nCSV ready`,
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
