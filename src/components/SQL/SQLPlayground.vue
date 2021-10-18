<template>
  <textarea
    id="area"
    autonomplete="on"
    autocorrect="off"
    spellcheck="off"
    @keyup="keyup"
  ></textarea>
  <a v-if="downloadDataURL" :href="downloadDataURL" download="result.csv"
    >Download Results</a
  >
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
  setup() {},
  created() {
    this.showData();
  },
  computed() {},
  methods: {
    keyup(e) {
      if (e.ctrlKey && e.code == "Enter") {
        this.$emit("SQLRequest", e.target.value);
      }
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
      this.reducedInterval = setInterval(() => {
        let temp = valuesCopy.splice(25);
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
      }, 15);
    },
  },
};
</script>

<style scoped>
#area {
  width: 50%;
  height: 20vh;
}
th,
td {
  border: 1px solid black;
}
</style>
