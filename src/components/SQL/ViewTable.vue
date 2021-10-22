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
        :style="{
          background: gradientSortedValues[rowIndex][cellIndex],
        }"
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
      let M1Color = "#e6b122";
      let M2Color = "#22e6d9";
      let M1ClicksIndex = this.data.columns.indexOf("M1 Clicks");
      let M2ClicksIndex = this.data.columns.indexOf("M2 Clicks");
      let ClicksDifferenceIndex =
        this.data.columns.indexOf("Clicks Difference");

      let M1VisitsIndex = this.data.columns.indexOf("M1 Order Avg");
      let M2VisitsIndex = this.data.columns.indexOf("M2 Order Avg");
      let OrderDifferenceIndex = this.data.columns.indexOf("Order Difference");
      let outputValues = [];
      let maxClicksDifference = Math.max(
        ...this.sortedValues.map((e) => Math.abs(e[ClicksDifferenceIndex]))
      );
      let maxOrderDifference = Math.max(
        ...this.sortedValues.map((e) => Math.abs(e[OrderDifferenceIndex]))
      );
      this.sortedValues.forEach((row, index) => {
        outputValues[index] = [];
        let ClicksDifference = row[ClicksDifferenceIndex] / maxClicksDifference;

        let OrderDifference = row[OrderDifferenceIndex] / maxOrderDifference;

        if (ClicksDifference > 0) {
          outputValues[index][
            M1ClicksIndex
          ] = `linear-gradient(90deg, #ffffff ${
            (1 - ClicksDifference) * 100
          }%, ${M1Color} 0)`;
        } else {
          outputValues[index][
            M2ClicksIndex
          ] = `linear-gradient(90deg, ${M2Color} ${
            -ClicksDifference * 100
          }%, #ffffff 0)`;
        }

        if (OrderDifference > 0) {
          outputValues[index][
            M1VisitsIndex
          ] = `linear-gradient(90deg, #ffffff ${
            (1 - OrderDifference) * 100
          }%, ${M1Color} 0)`;
        } else {
          outputValues[index][
            M2VisitsIndex
          ] = `linear-gradient(90deg, ${M2Color} ${
            -OrderDifference * 100
          }%, #ffffff 0)`;
        }
      });
      console.log(outputValues);
      return outputValues;
    },
  },
  props: {
    title: null,
    data: {
      columns: [],
      values: [],
    },
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
    // generateGradient(columnIndex) {
    //   let backgroundStyle = "";
    //   if (this.data.columns[columnIndex].match(/^M/)) {
    //     backgroundStyle = "linear-gradient(90deg, #FFC0CB 95%, #00FFFF 5%)";
    //   }

    //   return { background: backgroundStyle };
    // },
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
