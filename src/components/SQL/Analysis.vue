<template>
  <tt>
    <table>
      <tr>
        <th>Focus</th>
        <th v-for="column in columns" :key="column">
          {{ column }}
        </th>
      </tr>

      <tr v-for="row in values" :key="row">
        <td><input type="checkbox" name="focus" /></td>
        <td v-for="cell in row" :key="cell">{{ cell }}</td>
      </tr>
    </table>
  </tt>
</template>

<script>
import { wait } from "../../utilities";

export default {
  name: "Analysis",
  emits: [],
  components: {},
  props: {
    sqlWorker: Object,
  },
  data() {
    return {
      columns: [],
      values: [],
    };
  },
  created() {
    this.sqlWorker
      .send({
        id: this.sqlWorker.id++,
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
                  COUNT(CASE WHEN UserGroupName = "M1" THEN UserGroupName END) AS "M1 Visits",
                  COUNT(CASE WHEN UserGroupName = "M2" THEN UserGroupName END) AS "M2 Visits",
                  COUNT(CASE WHEN UserGroupName = "M1" THEN UserGroupName END) - COUNT(CASE WHEN UserGroupName = "M2" THEN UserGroupName END) AS "Visits Difference",
                  AVG(CASE WHEN UserGroupName = "M1" THEN SceneOrder END) AS "M1 Order Avg",
                  AVG(CASE WHEN UserGroupName = "M2" THEN SceneOrder END) AS "M2 Order Avg",
                  AVG(CASE WHEN UserGroupName = "M1" THEN SceneOrder END) - AVG(CASE WHEN UserGroupName = "M2" THEN SceneOrder END) AS "Order Difference"
                FROM Visites 
                GROUP BY SCeneId
                ORDER BY "Order Difference";`,
      })
      .then((e) => {
        this.columns = e.results[0].columns;
        this.values = e.results[0].values;
      });
  },
  watch: {},
  mounted() {},
  methods: {},
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
}
th,
td {
  border: 1px solid black;
}
</style>
