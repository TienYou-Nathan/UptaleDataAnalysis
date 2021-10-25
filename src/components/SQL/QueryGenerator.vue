<template>
  <select @change="changeFocusedTable($event.target.value)">
    <option v-for="table in tables" :key="table" :value="table.name">
      {{ table.name }}
    </option>
  </select>
</template>

<script>
import { requestSQL } from "../../sqlRequests";
export default {
  name: "QueryGenerator",
  emits: [],
  components: {},
  data() {
    return {
      tables: [],
    };
  },
  created() {
    requestSQL(
      this.$store.state.sqlWorker,
      `SELECT 
            name
        FROM 
            sqlite_schema
        WHERE 
            type ='table' AND 
            name NOT LIKE 'sqlite_%';`
    ).then((result) => {
      this.tables = result;
      console.log(this.tables);
    });
  },
  computed: {},
  watch: {},
  props: {},
  mounted() {},
  methods: {
    changeFocusedTable(table) {
      console.log(table);
    },
  },
};
</script>

<style scoped>
</style>
