<template>
  <Sidebar @sidebar_click="sidebarManager" />

  <div id="nav" :style="{ 'margin-left': sidebarWidth }">
    <Header title="VR@COVID Paths Analysis" />
    <FileLoader @filesLoaded="computeData" :fields="fields" />

    <div v-if="display == 'all'">
      <AllRoutes :paths="paths" />
    </div>

    <div v-if="display == 'compute'">
      <ComputedRoutes
        :categories="categories"
        :computedPaths="computedPaths"
        @updateAndComputePaths="updateAndComputePaths"
        @mergeThematic="mergeThematic"
      />
    </div>

    <div v-if="display == 'categories'">
      <SceneList
        :mapScenes="scenes"
        :mapCategories="categories"
        :mapThemes="themes"
      />
    </div>
  </div>
</template>

<script>
import { arrayToMap } from "./utilities";

import ComputedRoutes from "./components/Routes/Computed/ComputedRoutes.vue";
import AllRoutes from "./components/Routes/All/AllRoutes.vue";
import SceneList from "./components/Categories/SceneList.vue";

import Sidebar from "./components/Sidebar/Sidebar.vue";
import { sidebarWidth } from "@/components/Sidebar/state";

import Header from "./components/Header.vue";
import FileLoader from "./components/FileLoader.vue";

const objectsEqual = (o1, o2) => {
  var objectsAreSame = true;
  for (var propertyName in o1) {
    if (o1[propertyName] !== o2[propertyName]) {
      objectsAreSame = false;
      break;
    }
  }
  return objectsAreSame;
};
const arraysObjEqual = (a1, a2) => {
  a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));
};
function fieldSorterOptimized(fields) {
  var dir = [],
    i,
    l = fields.length;
  fields = fields.map(function (o, i) {
    if (o[0] === "-") {
      dir[i] = -1;
      o = o.substring(1);
    } else {
      dir[i] = 1;
    }
    return o;
  });

  return function (a, b) {
    for (i = 0; i < l; i++) {
      var o = fields[i];
      if (a[o] > b[o]) return dir[i];
      if (a[o] < b[o]) return -dir[i];
    }
    return 0;
  };
}

export default {
  name: "App",
  components: {
    Header,
    FileLoader,
    ComputedRoutes,
    AllRoutes,
    Sidebar,
    SceneList,
  },
  data() {
    return {
      //page to show
      display: "all",
      //raw general file
      general_usage_output: [],
      //raw detail file
      detail_usage_output: [],
      //an entry per session, list of scenes visited this session
      paths: [],
      //list of reduced and merged paths
      computedPaths: [],
      //data about each scene
      scenes: [],
      //data about each categories
      categories: [],
      //data about each theme
      themes: [],
      //option for computed paths
      merge_themes: false,
      //data files loaded
      fields: [
        {
          name: "general",
          label: "Select general data file file here",
          defaultPath: "/general.csv",
          format: "csv",
        },
        {
          name: "detail",
          label: "Select detail data file file here",
          defaultPath: "/detail.csv",
          format: "csv",
        },
        {
          name: "categories",
          label: "Select categories and themes data file here",
          defaultPath: "/sceneInfo.json",
          format: "json",
        },
      ],
    };
  },
  setup() {
    return { sidebarWidth };
  },
  created() {
    return;
  },
  methods: {
    maptoarray(m) {
      let arr = [];
      for (const value of m.values()) {
        arr.push(value);
      }
      return arr;
    },
    updateAndComputePaths(e) {
      this.updatePathsWhitelist(this.paths);
      this.computePaths(this.paths);
    },

    mergeThematic(e) {
      this.merge_themes = e;
      this.computePaths(this.paths);
    },

    sidebarManager(to) {
      this.display = to;
    },

    updatePathsWhitelist(paths) {
      paths.forEach((p) => {
        this.updatePathWhiteList(p.scenes);
      });
    },

    //adapte la whitelist d'un parcours en fonction de la whitelist des catégories
    updatePathWhiteList(path) {
      path.forEach((e) => {
        e.whitelisted = this.categories.get(e.category).whitelisted;
      });
    },
    setPaths(data) {
      //on ne garde que les données concernant un changement de scène
      const scene_changes = data.filter((d) => {
        const actual_scene = this.scenes.get(d.SceneName);
        return (
          (d.EventName == "Launch_ChangeWorld" &&
            actual_scene != undefined &&
            actual_scene.whitelisted) ||
          d.EventName == "Launch_QcmAnswerClick" ||
          d.EventName == "Launch_WinStar" ||
          d.EventName == "Launch_CloseSession"
        );
      });

      let paths = [];

      let startW = undefined; //event entering the scene
      let zoneFoundList = []; //list of zones found during the scene
      let zoneScoreList = []; //list of zone found and question correctly answered
      let endW = undefined; //event leaving the scene

      scene_changes.forEach((e) => {
        if (startW == undefined) {
          startW = e;
        } else if (e.EventName == "Launch_WinStar") {
          zoneScoreList.push({
            tag: e.TagName,
            time: e.EventTime,
          });
        } else if (e.EventName == "Launch_QcmAnswerClick") {
          zoneFoundList.push({
            tag: e.TagName,
            time: e.EventTime,
          });
        } else if (
          e.EventName == "Launch_ChangeWorld" ||
          e.EventName == "Launch_CloseSession"
        ) {
          endW = e;

          const i = paths.findIndex((d) => startW.SessionId == d.id);
          //si la session actuelle n'est pas enregistrées, on crée une nouvelle entrée
          if (i == -1) {
            paths.push({
              id: startW.SessionId,
              name: startW.LearnerName,
              scenes: [
                {
                  enterTime: startW.EventTime,
                  scene: startW.SceneName,
                  fromScene: startW.FromSceneName,
                  category: this.scenes.get(startW.SceneName).category,
                  theme: this.scenes.get(startW.SceneName).theme,
                  whitelisted: true,
                  duration: e.EventTime - startW.EventTime,
                  zonesFound: zoneFoundList,
                  zonesScored: zoneScoreList,
                },
              ],
            });
            //si la session actuelle possède une entrée, on rajoute un scène à son parcours
          } else {
            paths[i].scenes.push({
              enterTime: startW.EventTime,
              scene: startW.SceneName,
              fromScene: startW.FromSceneName,
              category: this.scenes.get(startW.SceneName).category,
              theme: this.scenes.get(startW.SceneName).theme,
              whitelisted: true,
              duration: e.EventTime - startW.EventTime,
              zonesFound: zoneFoundList,
              zonesScored: zoneScoreList,
            });
          }

          //reset values for next scene
          startW = e.EventName == "Launch_CloseSession" ? undefined : e;

          zoneFoundList = [];
          zoneScoreList = [];

          endW = undefined;
        }
      });
      this.paths = paths;
    },

    computePaths(paths) {
      let computedPaths = [];
      paths.forEach((p, id) => {
        //reduce path to array of scenes
        let path = [];
        let acc = -1;

        //iterate on each scene of a path fuse them by category/theme based on option
        p.scenes.forEach((s) => {
          //ensure that the scene is allowed
          if (s.whitelisted) {
            //if it's the first scene of a path, add it's category, and register scene's personal data in scenes field
            if (acc == -1) {
              acc++;
              let found = s.zonesFound.map((e) => {
                return { tag: e.tag, time: e.time };
              }); //avoid passing a proxy as a parameter
              let scored = s.zonesScored.map((e) => {
                return { tag: e.tag, time: e.time };
              }); //only for lisibility in console
              path.push({
                id: acc,
                category: s.category,
                theme: this.merge_themes ? "---" : s.theme,
                scenes: [
                  {
                    name: s.scene,
                    duration: s.duration,
                    zonesFound: found,
                    zonesScored: scored,
                  },
                ],
              });

              //if a scene is already registered in this path
            } else {
              //check if the scne has the same properties (category and theme based on options) of the previous one in the list
              const obj1 = { category: path[acc].category };
              const obj2 = { category: s.category };
              if (!this.merge_themes) {
                obj1.theme = path[acc].theme;
                obj2.theme = s.theme;
              }
              //if different properties, add a new category in the path
              if (!objectsEqual(obj1, obj2)) {
                acc++;
                let found = s.zonesFound.map((e) => {
                  return { tag: e.tag, time: e.time };
                }); //avoid passing a proxy as a parameter
                let scored = s.zonesScored.map((e) => {
                  return { tag: e.tag, time: e.time };
                }); //only for lisibility in console
                path.push({
                  id: acc,
                  category: s.category,
                  theme: this.merge_themes ? "---" : s.theme,
                  scenes: [
                    {
                      name: s.scene,
                      duration: s.duration,
                      zonesFound: found,
                      zonesScored: scored,
                    },
                  ],
                });
                //if not, add scene's properties to the category on the path
              } else {
                let found = s.zonesFound.map((e) => {
                  return { tag: e.tag, time: e.time };
                }); //avoid passing a proxy as a parameter
                let scored = s.zonesScored.map((e) => {
                  return { tag: e.tag, time: e.time };
                }); //only for lisibility in console
                path[acc].scenes.push({
                  name: s.scene,
                  duration: s.duration,
                  zonesFound: found,
                  zonesScored: scored,
                });
              }
            }
          }
        });

        // console.log("---new reduced path---");
        // console.log(p.name);
        // console.log(path);

        //now that the path es reduced, check if a similar computed path exists, excluding scene's personnal properties
        const i = computedPaths.findIndex((d) => {
          if (d.path.length == path.length) {
            return d.path.every((element, index) => {
              return objectsEqual(
                {
                  id: element.id,
                  category: element.category,
                  theme: element.theme,
                },
                {
                  id: path[index].id,
                  category: path[index].category,
                  theme: path[index].theme,
                }
              );
            });
          }
          return false;
        });
        if (i == -1) {
          let tmp = [];
          path.forEach((e) =>
            tmp.push({
              id: e.id,
              category: e.category,
              theme: e.theme,
              scenes: [e.scenes],
            })
          );
          computedPaths.push({
            id: id,
            path: tmp,
            entries: 1,
            proportion: 0,
            users: [
              {
                id: "1",
                username: "mrX",
              },
            ],
          });
        } else {
          computedPaths[i].entries += 1;
          computedPaths[i].users.push({
            id: "2+",
            username: "mrZZZ",
          });
          computedPaths[i].path.forEach((p, ind) =>
            p.scenes.push(path[ind].scenes)
          );
        }
      });

      computedPaths.forEach((p) => {
        p.proportion =
          (p.entries / computedPaths.reduce((a, b) => +a + +b.entries, 0)) *
          100;
      });

      computedPaths = computedPaths.sort((a, b) =>
        a.proportion < b.proportion ? 1 : b.proportion < a.proportion ? -1 : 0
      );
      this.analyseComputedPaths(computedPaths);
      // console.log("Computed Path");
      // console.log(computedPaths);
      this.computedPaths = computedPaths;
    },

    // accededScenes(scenes){
    //   let result = [];
    //   scenes
    // }

    analyseComputedPaths(computedPaths) {
      // console.log(computedPaths);

      computedPaths.forEach((uniquePath) => {
        uniquePath.path.forEach((pathEntry) => {
          pathEntry.thematicsData = [];
          pathEntry.scenes.forEach((scenesEntry) => {
            let currentScenesAccedded = [];
            let currentThemesAccedded = [];
            scenesEntry.forEach((scene) => {
              if (
                scene.zonesFound.length > 0 ||
                pathEntry.category != "chambre_entrainement"
              ) {
                const currentTheme = this.scenes.get(scene.name).theme;
                let themeIndex = pathEntry.thematicsData.findIndex(
                  (e) => e.theme == currentTheme
                );

                const alreadyAccedded = currentScenesAccedded.some(
                  (e) => e == scene.name
                );
                if (!alreadyAccedded) currentScenesAccedded.push(scene.name);

                const themeAlreadyAccedded = currentThemesAccedded.some(
                  (e) => e == currentTheme
                );
                if (!themeAlreadyAccedded)
                  currentThemesAccedded.push(currentTheme);

                if (themeIndex == -1) {
                  pathEntry.thematicsData.push({
                    theme: currentTheme,
                    accesDetails: [],
                    occurences: 0,
                    accesses: 0,
                    duration: {
                      min: 0,
                      max: 0,
                    },
                  });
                  themeIndex = pathEntry.thematicsData.length - 1;
                }

                let nameIndex = pathEntry.thematicsData[
                  themeIndex
                ].accesDetails.findIndex((e) => e.name == scene.name);

                if (nameIndex == -1) {
                  pathEntry.thematicsData[themeIndex].accesDetails.push({
                    name: scene.name,
                    occurences: 1,
                    accesses: 1,
                    zonesFoundMin: scene.zonesFound.length,
                    zonesFoundMax: scene.zonesFound.length,
                    zonesFoundTotal: scene.zonesFound.length,
                    zonesFoundMoy: scene.zonesFound.length,
                    zonesScoredMin: scene.zonesScored.length,
                    zonesScoredMax: scene.zonesScored.length,
                    zonesScoredTotal: scene.zonesScored.length,
                    zonesScoredMoy: scene.zonesScored.length,
                  });
                  pathEntry.thematicsData[themeIndex].occurences += 1;
                  pathEntry.thematicsData[themeIndex].duration.min =
                    scene.duration;
                  pathEntry.thematicsData[themeIndex].duration.max =
                    scene.duration;
                  if (!themeAlreadyAccedded)
                    pathEntry.thematicsData[themeIndex].accesses++;
                } else {
                  pathEntry.thematicsData[themeIndex].accesDetails[nameIndex]
                    .occurences++;
                  if (!alreadyAccedded)
                    pathEntry.thematicsData[themeIndex].accesDetails[nameIndex]
                      .accesses++;

                  pathEntry.thematicsData[themeIndex].accesDetails[
                    nameIndex
                  ].zonesFoundMin =
                    scene.zonesFound.length <
                    pathEntry.thematicsData[themeIndex].accesDetails[nameIndex]
                      .zonesFoundMin
                      ? scene.zonesFound.length
                      : pathEntry.thematicsData[themeIndex].accesDetails[
                          nameIndex
                        ].zonesFoundMin;
                  pathEntry.thematicsData[themeIndex].accesDetails[
                    nameIndex
                  ].zonesFoundMax =
                    scene.zonesFound.length >
                    pathEntry.thematicsData[themeIndex].accesDetails[nameIndex]
                      .zonesFoundMax
                      ? scene.zonesFound.length
                      : pathEntry.thematicsData[themeIndex].accesDetails[
                          nameIndex
                        ].zonesFoundMax;
                  pathEntry.thematicsData[themeIndex].accesDetails[
                    nameIndex
                  ].zonesFoundTotal += scene.zonesFound.length;
                  pathEntry.thematicsData[themeIndex].accesDetails[
                    nameIndex
                  ].zonesFoundMoy =
                    pathEntry.thematicsData[themeIndex].accesDetails[nameIndex]
                      .zonesFoundTotal /
                    pathEntry.thematicsData[themeIndex].accesDetails[nameIndex]
                      .occurences;

                  pathEntry.thematicsData[themeIndex].accesDetails[
                    nameIndex
                  ].zonesScoredMin =
                    scene.zonesScored.length <
                    pathEntry.thematicsData[themeIndex].accesDetails[nameIndex]
                      .zonesScoredMin
                      ? scene.zonesScored.length
                      : pathEntry.thematicsData[themeIndex].accesDetails[
                          nameIndex
                        ].zonesScoredMin;
                  pathEntry.thematicsData[themeIndex].accesDetails[
                    nameIndex
                  ].zonesScoredMax =
                    scene.zonesScored.length >
                    pathEntry.thematicsData[themeIndex].accesDetails[nameIndex]
                      .zonesScoredMax
                      ? scene.zonesScored.length
                      : pathEntry.thematicsData[themeIndex].accesDetails[
                          nameIndex
                        ].zonesScoredMax;
                  pathEntry.thematicsData[themeIndex].accesDetails[
                    nameIndex
                  ].zonesScoredTotal += scene.zonesScored.length;
                  pathEntry.thematicsData[themeIndex].accesDetails[
                    nameIndex
                  ].zonesScoredMoy =
                    pathEntry.thematicsData[themeIndex].accesDetails[nameIndex]
                      .zonesScoredTotal /
                    pathEntry.thematicsData[themeIndex].accesDetails[nameIndex]
                      .occurences;

                  pathEntry.thematicsData[themeIndex].occurences++;
                  pathEntry.thematicsData[themeIndex].duration.min =
                    scene.duration <
                    pathEntry.thematicsData[themeIndex].duration.min
                      ? scene.duration
                      : pathEntry.thematicsData[themeIndex].duration.min;
                  pathEntry.thematicsData[themeIndex].duration.max =
                    scene.duration >
                    pathEntry.thematicsData[themeIndex].duration.max
                      ? scene.duration
                      : pathEntry.thematicsData[themeIndex].duration.max;
                  if (!themeAlreadyAccedded)
                    pathEntry.thematicsData[themeIndex].accesses++;
                }
              }
            });
          });
        });
      });
    },

    computeData(files) {
      this.general_usage_output = files.general;
      // console.log(files.categories);
      this.categories = arrayToMap(files.categories.arrayCategories);
      this.themes = arrayToMap(files.categories.arrayThemes);
      this.scenes = arrayToMap(files.categories.arrayScenes);

      //suppressing duplicate data due to an Uptale bug
      //daplicate matches EventTime, EventName and SessionID
      this.detail_usage_output = files["detail"].reduce(
        (accumulator, current) => {
          if (checkIfAlreadyExist(current)) {
            return accumulator;
          } else {
            return [...accumulator, current];
          }

          function checkIfAlreadyExist(currentVal) {
            return accumulator.some((item) => {
              return (
                item.EventTime === currentVal.EventTime &&
                item.EventName === currentVal.EventName &&
                item.SessionId === currentVal.SessionId
              );
            });
          }
        },
        []
      );

      //format EventTime to Date format
      this.detail_usage_output.forEach((e) => {
        e.EventTime = new Date(e.EventTime);
      });

      //sort data by sessionID and Date to ensure events are in correct order
      this.detail_usage_output = this.detail_usage_output.sort(
        fieldSorterOptimized(["SessionId", "EventTime"])
      );

      //remove all events in a session that fires after a Session_Close event
      //due to uptale bug when VR helmet is put in rest mode
      let currentId = undefined;
      let sessionClosed = false;
      this.detail_usage_output = this.detail_usage_output.filter((e) => {
        if (currentId == e.SessionId) {
          if (sessionClosed) {
            return false;
          } else {
            if (e.EventName == "Launch_CloseSession") {
              sessionClosed = true;
            }
          }
        } else {
          currentId = e.SessionId;
          sessionClosed = false;
        }
        return true;
      });

      this.setPaths(this.detail_usage_output);
      this.computePaths(this.paths);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#nav {
  padding: 30px;
}
</style>
