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
  computed: {
    sessions() {
      return this.$store.state.sessions;
    },
  },
  mounted() {
    console.log(this.$el);
    this.renderSVG();
  },
  methods: {
    renderSVG() {
      var data = this.sessions;
      data = data.filter((e) => e.StartTime > 978307200000);
      let onlyDates = data.map((e) => e.StartTime);
      console.log(onlyDates);
      let datemin = Math.min(...onlyDates);
      let datemax = Math.max(...onlyDates);
      let difference = datemax - datemin;
      let scaleFactor = difference / 500;
      this.width = 500;
      //this.width = difference;
      console.log(data);
      this.d3svg = d3.select(this.$el);
      let acc = 1;
      this.d3svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          return (d.StartTime - datemin) / scaleFactor;
        })
        .attr("cy", function (d) {
          return ++acc;
        })
        // .attr("fill", function (d) {
        //   return d[2];
        // })
        .attr("r", 4);
      console.log("end");
    },
  },
};
</script>

<style scoped>
</style>