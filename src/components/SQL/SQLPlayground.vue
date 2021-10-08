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
    <tr v-for="values in values" :key="values">
      <td v-for="value in values" :key="value">{{ value }}</td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "SQLPlayground",
  emits: ["SQLRequest"],
  components: {},
  data() {
    return {
      downloadDataURL: null,
    };
  },
  watch: {
    downloadData() {
      URL.revokeObjectURL(this.downloadDataURL);
      this.downloadDataURL = URL.createObjectURL(
        new Blob([d3.csvFormat(this.downloadData)], { type: "text/csv" })
      );
    },
  },
  props: {
    downloadData: [],
    columns: [],
    values: [],
  },
  setup() {},
  created() {
    console.log(this.downloadDataURL);
  },
  computed() {},
  methods: {
    keyup(e) {
      if (e.ctrlKey && e.code == "Enter") {
        this.$emit("SQLRequest", e.target.value);
      }
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
