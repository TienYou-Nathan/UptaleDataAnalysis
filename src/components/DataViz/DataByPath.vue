<template>
    <div id=content>
        <PathSelector id=pathSelector :data='data'/>
        <PathVisualization id=graph :data='data[0].data'/> 
        <div id=users></div>
    </div>
</template>

<script>
import PathSelector from "./PathSelector.vue";
import UserList from "./UserList.vue";
import PathVisualization from "./PathVisualization.vue";

export default {
  name: "DataByPath",
  components: {
    PathSelector,
    UserList,
    PathVisualization
  },
  props: {
    data: Array
  }
};
</script>

<style scoped>

#content{
  height:100%;
  width:100%;
  display:grid;
  grid-template-columns:  1fr min-content;
  grid-template-rows:     min-content 1fr;
}

#pathSelector{
  grid-column: 1; 
  grid-row: 1;
  background-color: chartreuse;
}

#graph{
  grid-column: 1; 
  grid-row: 2;
  background-color: rgb(210, 30, 180);
}

#users{
  width:150px;
  grid-column: 2; 
  grid-row: 1  / span 2;
  background-color: darkgoldenrod;
}

</style>