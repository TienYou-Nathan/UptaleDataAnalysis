<template>
  <div class="container">
    <span>Exclude data before</span>
    <input
      type="date"
      id="start"
      name="start"
      :value="new Date(datemin).toISOString().substr(0, 10)"
      :min="new Date(datemin).toISOString().substr(0, 10)"
      :max="new Date(datemax).toISOString().substr(0, 10)"
      @change="changeStartFilter"
    />
    <span>Exclude data after</span>
    <input
      type="date"
      id="start"
      name="start"
      :value="new Date(datemax).toISOString().substr(0, 10)"
      :min="new Date(datemin).toISOString().substr(0, 10)"
      :max="new Date(datemax).toISOString().substr(0, 10)"
      @change="changeEndFilter"
    />

    <svg ref="svg" :width="width" :height="height"></svg>
  </div>
</template>

<script>
export default {
  name: "SessionLogin",
  data() {
    return {
      startFilter: 0,
      endFilter: Infinity,
      width: 500,
      height: 500,
      d3svg: null,
    };
  },
  computed: {
    sessions() {
      return this.$store.state.sessions;
    },
    filteredSessions() {
      return this.sessions.filter(
        (e) => e.StartTime >= this.startFilter && e.StartTime <= this.endFilter
      );
    },
    sessionsDates() {
      return this.sessions.map((e) => e.StartTime);
    },
    filteredSessionsDates() {
      return this.filteredSessions.map((e) => e.StartTime);
    },
    datemin() {
      return Math.min(...this.sessionsDates);
    },
    filteredDateMin() {
      return Math.min(...this.filteredSessionsDates);
    },
    datemax() {
      return Math.max(...this.sessionsDates);
    },
    filteredDateMax() {
      return Math.max(...this.filteredSessionsDates);
    },
  },
  watch: {
    filteredSessions() {
      this.renderSVG();
    },
    filteredSessionsDates() {
      this.renderSVG();
    },
    filteredDateMin() {
      this.renderSVG();
    },
    filteredDateMax() {
      this.renderSVG();
    },
  },
  created() {},
  mounted() {
    console.log(this.sessions);

    this.renderSVG();
  },
  methods: {
    renderSVG() {
      var data = this.filteredSessions;
      let difference = this.filteredDateMax - this.filteredDateMin;
      let scaleFactor =
        difference / this.$refs.svg.getBoundingClientRect().width;
      this.width = 500;
      //this.width = difference;
      console.log(this.filteredDateMin);
      this.d3svg = d3.select(this.$refs.svg);
      this.d3svg.selectAll("svg > *").remove();
      let acc = 1;
      this.d3svg
        .selectAll(null)
        .data(data)
        .enter()
        .append("circle")
        .attr(
          "cx",
          function (d) {
            return (d.StartTime - this.filteredDateMin) / scaleFactor;
          }.bind(this)
        )
        .attr("cy", function (d) {
          return ++acc;
        })
        .attr("r", 4);
      // .attr("fill", function (d) {
      //   return d[2];
      // })
    },
    changeStartFilter(e) {
      this.startFilter = new Date(e.target.value).getTime();
    },
    changeEndFilter(e) {
      this.endFilter = new Date(e.target.value).getTime();
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
}
svg {
  width: 95%;
}
</style>