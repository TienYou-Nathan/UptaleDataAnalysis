<template>
  <input
    type="date"
    id="start"
    name="start"
    value="2018-07-22"
    :min="datemin"
    :max="datemax"
  />

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
    sessionsDates() {
      return this.sessions.map((e) => e.StartTime);
    },
    datemin() {
      return Math.min(...this.sessionsDates);
    },
    datemax() {
      return Math.max(...this.sessionsDates);
    },
  },
  created() {},
  mounted() {
    console.log(this.$el);

    this.renderSVG();
  },
  methods: {
    renderSVG() {
      var data = this.sessions;
      data = data.filter((e) => e.StartTime > 978307200000);

      let difference = this.datemax - this.datemin;
      let scaleFactor = difference / 500;
      this.width = 500;
      //this.width = difference;
      console.log(data);
      this.d3svg = d3.select(this.$el);
      let acc = 1;
      this.d3svg
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          return (d.StartTime - this.datemin) / scaleFactor;
        })
        .attr("cy", function (d) {
          return ++acc;
        })
        .attr("r", 4);
      // .attr("fill", function (d) {
      //   return d[2];
      // })
    },
  },
};
</script>

<style scoped>
</style>