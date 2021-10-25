<template>
  <table>
    {{
      title
    }}
    <tr>
      <th
        v-for="(column, index) in data.columns"
        :key="column"
        @click="sort(column, index)"
      >
        {{
          column + (sortIndex == index ? (sortDirection ? "▲" : "▼") : "&nbsp;")
        }}
      </th>
    </tr>
    <tr v-for="(row, rowIndex) in sortedValues" :key="row">
      <td
        v-for="(cell, cellIndex) in row"
        :key="cell"
        :style="
          compare
            ? {
                background: gradientSortedValues[rowIndex][cellIndex],
              }
            : null
        "
      >
        {{ cell }}
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "ViewTable",
  components: {},
  data() {
    return {
      sortIndex: 0,
      sortDirection: false,
    };
  },
  computed: {
    sortedValues() {
      return this.data.values.sort((a, b) => {
        let aSorter = a[this.sortIndex];
        let bSorter = b[this.sortIndex];
        let output = 0;

        if (aSorter < bSorter) {
          output = -1;
        }
        if (aSorter > bSorter) {
          output = 1;
        }
        if (this.sortDirection) {
          output *= -1;
        }
        return output;
      });
    },
    gradientSortedValues() {
      let gradientSortedValues = [];
      this.compare?.forEach((compareElement) => {
        let sorterIndex = this.data.columns.indexOf(compareElement.sorter);
        let indexesToCompare = compareElement.keys.map((e) => {
          return this.data.columns.indexOf(e.name);
        });

        this.sortedValues.forEach((row, index) => {
          if (!gradientSortedValues[index]) {
            gradientSortedValues[index] = [];
          }

          let valuesMax = Math.max(
            ...this.sortedValues.map((e) =>
              Math.abs(e[indexesToCompare[0]] - e[indexesToCompare[1]])
            )
          );

          let difference =
            (row[indexesToCompare[0]] - row[indexesToCompare[1]]) / valuesMax;

          if (difference > 0) {
            gradientSortedValues[index][
              sorterIndex
            ] = `linear-gradient(90deg, #ffffff ${50 - difference * 50}%, ${
              compareElement.keys[0].color
            } ${50 - difference * 50}%,  ${
              compareElement.keys[0].color
            } 50%,  #ffffff 50%)`;
          } else {
            gradientSortedValues[index][
              sorterIndex
            ] = `linear-gradient(90deg, #ffffff 50%, ${
              compareElement.keys[1].color
            } 50%,${compareElement.keys[1].color} ${50 - difference * 50}%,
            #ffffff ${50 - difference * 50}%
            )`;
          }
        });
      });
      return gradientSortedValues;
    },
  },
  props: {
    title: null,
    data: {
      columns: [],
      values: [],
    },
    compare: Array,
  },
  methods: {
    sort(column, index) {
      if (this.sortIndex == index) {
        this.sortDirection = !this.sortDirection;
      } else {
        this.sortIndex = index;
        this.sortDirection = false;
      }
    },
  },
};
</script>

<style scoped>
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
th {
  cursor: pointer;
  user-select: none;
}
th:hover {
  background: lightgray;
}
</style>
