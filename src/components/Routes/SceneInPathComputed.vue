<template>
  <div
    class="container"
    @click="toggleInfo"
    :style="{
      border: `3px solid ${categoriesInfo.get(this.scene.category).color}`,
    }"
  >
    <div class="sceneInPath">
      <p>{{ scene.category }}</p>
      <p>{{ scene.theme }}</p>
      <i class="far fa-plus-square"></i>
    </div>
    <transition name="expand">
      <div v-if="infoCollapse == false" class="sceneInPathInfo">
        <div :key="thematic.theme" v-for="thematic in scene.thematicsData">
          <p>**********************</p>
          <div>
            {{
              `${thematic.theme}--- Occ:${thematic.occurences} - Acc:${thematic.accesses}`
            }}
          </div>
          <div :key="details.name" v-for="details in thematic.accesDetails">
            <div>
              {{
                `${details.name}--- Occ:${details.occurences} - Acc:${details.accesses}`
              }}
            </div>
            <div v-if="scene.category == 'chambre_entrainement'">
              {{
                `Found : Min ${
                  details.zonesFoundMin
                } - Moy ${details.zonesFoundMoy.toFixed(1)} - Max ${
                  details.zonesFoundMax
                }`
              }}
            </div>
            <div v-if="scene.category == 'chambre_entrainement'">
              {{
                `Scored : Min ${
                  details.zonesScoredMin
                } - Moy ${details.zonesScoredMoy.toFixed(1)} - Max ${
                  details.zonesScoredMax
                }`
              }}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "SceneInPathComputed",
  props: {
    scene: Object,
    categoriesInfo: {
      type: Map,
    },
  },
  data() {
    return {
      color: String,
      infoCollapse: true,
    };
  },
  created() {
    this.color = "red";
  },
  methods: {
    toggleInfo() {
      this.infoCollapse = !this.infoCollapse;
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  margin: 5px;
}

.sceneInPath {
  background: #bebebe;
  padding: 5px 5px;
  width: auto;
}

.sceneInPathInfo {
  background: #e6e6e6;
  width: 500px;

  /* display: grid;
  grid-template-columns: 4fr 1fr 1fr;
  grid-template-rows: auto; */
}

/* always present
.expand-transition {
  transition: all .3s ease;
  height: 30px;
  padding: 10px;
  background-color: #eee;
  overflow: hidden;
}
/* .expand-enter defines the starting state for entering */
/* .expand-leave defines the ending state for leaving */
/* .expand-enter, .expand-leave {
  height: 0;
  padding: 0 10px;
  opacity: 0;
} */

.expand-enter-active {
  transition: width 0.2s ease;
}
.expand-leave-active {
  transition: width 0.5s cubic-bezier(1, 0.5, 0.8, 1), color 0.2s;
}
.expand-enter-from,
.expand-leave-to {
  width: 0px;
  color: rgba(0, 0, 0, 0);
}
</style>