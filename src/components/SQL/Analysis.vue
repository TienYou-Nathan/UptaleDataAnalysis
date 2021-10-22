<template>
  <table>
    Visite des Scenes
    <tr>
      <th>Focus</th>
      <th v-for="column in columns" :key="column">
        {{ column }}
      </th>
    </tr>

    <tr v-for="row in values" :key="row">
      <td>
        <input
          type="checkbox"
          name="focus"
          @change="changeSceneFocus(row[0], $event)"
        />
      </td>
      <td v-for="cell in row" :key="cell">{{ cell }}</td>
    </tr>
  </table>

  <ViewTable
    :title="'Clicks sur les tags'"
    :data="{ columns: specificColumns, values: specificValues }"
  />
</template>

<script>
import ViewTable from "./ViewTable.vue";

export default {
  name: "Analysis",
  emits: [],
  components: {
    ViewTable,
  },
  props: {
    sqlWorker: Object,
  },
  data() {
    return {
      columns: [],
      values: [],
      specificColumns: [],
      specificValues: [],
      checked: {},
    };
  },
  created() {
    this.$store.state.sqlWorker
      .send({
        id: this.$store.state.sqlWorker.id,
        action: "exec",
        sql: `WITH Visites AS
                (SELECT 
                  UsersGroups.Id AS "UsersGroupsId",
                  UsersGroups.Name AS "UserGroupName",
                  Scenes.Name AS "SceneName",
                  Scenes.Id AS "SceneId",
                  Categories.Name AS "CategoryName",
                  Categories.Id AS "Categories",
                  
                  ROW_NUMBER() OVER (
                                Partition by Users.Id
                            ) SceneOrder
                      
                FROM SceneVisit
                LEFT JOIN Sessions ON Sessions.Id = SceneVisit.SessionId
                LEFT JOIN Users ON Sessions.UserId = Users.Id
                LEFT JOIN UserGroupAssociation ON Users.Id = UserGroupAssociation.UserId
                LEFT JOIN UsersGroups ON UserGroupAssociation.UserGroupId = UsersGroups.Id
                LEFT JOIN Scenes ON Scenes.Id = SceneVisit.SceneId
                LEFT JOIN Categories ON Categories.Id = Scenes.CategoryId
                WHERE UsersGroups.Type = "Expertise" AND Categories.Name != "Obligatoire" AND Categories.Name != "Tutoriel")

                SELECT 
                  SceneId,
                  SceneName,
                  CategoryName,
                  COUNT(CASE WHEN UserGroupName = "M1" THEN UserGroupName END) AS "M1 Visits",
                  COUNT(CASE WHEN UserGroupName = "M2" THEN UserGroupName END) AS "M2 Visits",
                  COUNT(CASE WHEN UserGroupName = "M1" THEN UserGroupName END) - COUNT(CASE WHEN UserGroupName = "M2" THEN UserGroupName END) AS "Visits Difference",
                  ROUND(AVG(CASE WHEN UserGroupName = "M1" THEN SceneOrder END),2) AS "M1 Order Avg",
                  ROUND(AVG(CASE WHEN UserGroupName = "M2" THEN SceneOrder END),2) AS "M2 Order Avg",
                  ROUND(AVG(CASE WHEN UserGroupName = "M1" THEN SceneOrder END) - AVG(CASE WHEN UserGroupName = "M2" THEN SceneOrder END),2) AS "Order Difference"
                FROM Visites 
                GROUP BY SCeneId
                ORDER BY "Order Difference";`,
      })
      .then((e) => {
        this.columns = e.results[0].columns;
        this.values = e.results[0].values;
      });
    this.$store.commit("incrementWorkerId");
  },
  watch: {},
  mounted() {},
  methods: {
    changeSceneFocus(sceneId, event) {
      this.checked[sceneId] = event.currentTarget.checked;
      let wantedScenes = Object.entries(this.checked)
        .filter((e) => e[1])
        .map((e) => e[0]);
      let filterOutput = "";
      if (wantedScenes.length > 0) {
        filterOutput += `Scenes.Id = "${wantedScenes.shift()}"`;
        wantedScenes.forEach((e) => {
          filterOutput += ` OR Scenes.Id = "${e}"`;
        });
        filterOutput = `AND (${filterOutput})`;
        this.$store.state.sqlWorker
          .send({
            id: this.$store.state.sqlWorker.id,
            action: "exec",
            sql: `WITH 
            AllClicks AS (
            SELECT 
              Topics.Name AS "TopicName",
              Topics.Id AS "TopicId",
              Scenes.Name AS "SceneName",
              Scenes.Id AS "SceneId",
                Categories.Name AS "CategoryName",
                Categories.Color AS "CategoryColor",
                Categories.Id AS "CategoryId",
              Users.Id AS "UserId",
              UsersGroups.Name AS "UserGroupName",
              UsersGroups.Id AS "UserGroupId",
              ROW_NUMBER() OVER (
                            Partition by Users.Id
                        ) TopicOrder

            FROM TopicsClicks
            LEFT JOIN Topics ON TopicsClicks.TopicId = Topics.Id
            LEFT JOIN Scenes ON Topics.SceneId = Scenes.Id
            LEFT JOIN Categories ON Categories.Id = Scenes.CategoryId
            LEFT JOIN Sessions ON Sessions.Id = TopicsClicks.SessionId
            LEFT JOIN Users ON Sessions.UserId = Users.Id
            LEFT JOIN UserGroupAssociation ON Users.Id = UserGroupAssociation.UserId
            LEFT JOIN UsersGroups ON UserGroupAssociation.UserGroupId = UsersGroups.Id
            WHERE UsersGroups.Type = "Expertise" AND Categories.Name != "Tutoriel" AND Topics.Name NOT LIKE "Masquer%" ${filterOutput})


            SELECT 
              TopicName, SceneName, CategoryName,
              COUNT(CASE WHEN UserGroupName = "M1" THEN UserGroupName END) AS "M1 Clicks",
              COUNT(CASE WHEN UserGroupName = "M2" THEN UserGroupName END) AS "M2 Clicks",
              COUNT(CASE WHEN UserGroupName = "M1" THEN UserGroupName END) - COUNT(CASE WHEN UserGroupName = "M2" THEN UserGroupName END) AS "Clicks Difference",
              ROUND(AVG(CASE WHEN UserGroupName = "M1" THEN TopicOrder END),2) AS "M1 Order Avg",
              ROUND(AVG(CASE WHEN UserGroupName = "M2" THEN TopicOrder END),2) AS "M2 Order Avg",
              ROUND(AVG(CASE WHEN UserGroupName = "M1" THEN TopicOrder END) - AVG(CASE WHEN UserGroupName = "M2" THEN TopicOrder END),2) AS "Order Difference"
              FROM AllClicks
              WHERE CategoryName != "Obligatoire"
            GROUP BY TopicId
            ORDER BY "Order Difference";`,
          })
          .then((e) => {
            this.specificColumns = e.results[0].columns;
            this.specificValues = e.results[0].values;
          });
        this.$store.commit("incrementWorkerId");
      } else {
        this.specificColumns = [];
        this.specificValues = [];
      }
    },
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
</style>
