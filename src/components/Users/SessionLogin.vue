<template>
  <svg :width="width" :height="height"></svg>
</template>

<script>
export default {
  name: "SessionLogin",
  data() {
    return {
      width: 500,
      height: 500,
      d3svg: null,
    };
  },
  computed: {},
  mounted() {
    // this.$store.state.sqlWorker
    //   .send({
    //     id: this.$store.state.sqlWorker.id,
    //     action: "exec",
    //     sql: ``,
    //   })
    //   .then((e) => {});
    this.renderSVG();
  },
  methods: {
    renderSVG() {
      this.$store.commit("incrementWorkerId");

      var data = [
        [10, 20, "red"],
        [20, 100, "red"],
        [200, 50, "blue"],
        [25, 80, "blue"],
        [10, 200, "blue"],
        [150, 75, "green"],
        [10, 70, "green"],
        [30, 150, "yellow"],
        [100, 15, "yellow"],
      ];
      this.d3svg = d3.select(this.$el);
      this.d3svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          return d[0];
        })
        .attr("cy", function (d) {
          return d[1];
        })
        .attr("fill", function (d) {
          return d[2];
        })
        .attr("r", 4);
      console.log("end");
    },
  },
};
</script>

<style scoped>
</style>