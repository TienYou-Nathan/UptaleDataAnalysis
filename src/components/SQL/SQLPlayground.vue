<template>
  <textarea
    id="area"
    autonomplete="on"
    autocorrect="off"
    spellcheck="off"
    @keyup="keyup"
  ></textarea>
</template>

<script>
export default {
  name: "SQLPlayground",
  emits: ["SQLRequest"],
  components: {},
  data() {
    return {};
  },
  setup() {},
  created() {},
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

<style>
#area {
  width: 100%;
  height: 80%;
}
</style>
