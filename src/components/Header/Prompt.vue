<template>
  <div class="prompt">
    <div id="background" @click="$emit('currentWindowChange', null)" />
    <div id="content" v-if="type == 'largePanels'">
      <div :key="field.name" v-for="field in data" @click="uploadFile">
        <label :for="field.name">{{ field.label }}</label>
        <input
          type="file"
          :id="field.name"
          :name="field.name"
          :accept="'.' + field.format"
          @change="$emit('fileChange', $event)"
        />
        <i>{{
          field.file
            ? field.file.name +
              "" +
              " " +
              ((field.file?.size / 1000000).toFixed(2) + "MB")
            : ""
        }}</i>
      </div>
    </div>
    <div id="content" v-if="type == 'propList'">
      <div :key="field.name" v-for="field in data" @click="downloadFile"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Prompt",
  emits: ["fileChange", "currentWindowChange"],
  components: {},
  data() {
    return {};
  },
  props: {
    data: Object,
    type: String,
  },
  methods: {
    uploadFile(e) {
      //We want to avoid triggering twice the same event
      if (e.target.tagName == "DIV") {
        e.target.querySelector("input").click();
      }
    },
  },
};
</script>

<style scoped>
.prompt {
  position: fixed;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
#background {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
}
#content {
  border-radius: 10px;
  position: absolute;
  display: flex;
  flex-direction: row;
  top: 20%;
  bottom: 20%;
  left: 20%;
  right: 20%;
  background: white;
}
#content > * {
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 5px;
  border: 1px dashed black;
  border-radius: 10px;
  flex-basis: 0;
  flex-grow: 1;
  min-width: 0;
}
#content > *:hover {
  background: lightgray;
}
#content * {
  cursor: pointer;
}
#content * input {
  display: none;
}
input {
  display: none;
}
</style>
