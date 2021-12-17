<template>
  <input type="file" :accept="'.csv'" @change="fileChange" />
  <button @click="saveData">Importer</button>
  <br />
  <span
    >Validated :
    {{ defaultUserAssociation.filter((e) => e[2] == 0).length }}</span
  >
  <table>
    <thead>
      <tr>
        <th>Csv</th>
        <th>Uptale</th>
        <th>Incertitude</th>
      </tr>
    </thead>
    <template
      v-for="association in defaultUserAssociation"
      :key="association[0]"
    >
      <tr v-if="association[2] && association[2] > 0">
        <th>{{ association[0] }}</th>
        <th>{{ association[1] }}</th>
        <th>{{ association[2] }}</th>
        <th>
          <button @click="validateAssociation(association[0])">Validate</button>
        </th>
        <th>
          <button @click="requestChangeAssociation(association[0])">
            edit
          </button>
        </th>
        <th>
          <button
            v-if="association[1]"
            @click="deleteAssociation(association[0])"
          >
            delete
          </button>
        </th>
        <th v-if="association[3]">
          <select @input="changeAssociation(association[0], $event)">
            <option
              v-for="namevalue in association[3]"
              :key="namevalue"
              :value="namevalue[0]"
            >
              {{ namevalue[0] }}
            </option>
          </select>
        </th>
      </tr>
    </template>
  </table>
</template>

<script>
const levenshtein = require("js-levenshtein");
export default {
  name: "SurveyLink",
  computed: {
    users() {
      return this.$store.state.users;
    },
  },
  data() {
    return {
      originalCSV: [],
      levensteinCache: {},
      defaultUserAssociation: [],
      associationData: {},
      uptaleEmail: " (leafrigo@hotmail.com)",
    };
  },
  methods: {
    load_file: async function (file) {
      function readFileAsync(file) {
        return new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsText(file);
        });
      }

      let data;
      try {
        let contentBuffer = await readFileAsync(file);
        data = d3.csvParse(contentBuffer, d3.autoType); // see https://github.com/d3/d3-dsv#autoType
      } catch (err) {
        console.log(err);
      }

      return data;
    },
    async fileChange(e) {
      let associationData = {};
      let csvUsers = await this.load_file(e.target.files[0]);
      this.originalCSV = csvUsers;
      console.log(csvUsers);
      let csvNames = csvUsers.map((e) => e["2. Nom &amp; Prénom :"]);
      let originalNames = this.users.map((e) =>
        e.Id.replace(this.uptaleEmail, "")
      );

      //Runs Levenstein up to 3 words
      csvNames.forEach((csvName) => {
        associationData[csvName] = {};
        let csvSplitted = this.stringToWords(csvName);
        originalNames.forEach((originame) => {
          let originSplitted = this.stringToWords(originame);
          if (originSplitted.length > 1) {
            // console.log("e");
            // console.log(csvSplitted, originSplitted);
            // return;
            associationData[csvName][originame] = this.nwordlevenstein(
              csvSplitted,
              originSplitted
            );
          }
        });
      });
      this.associationData = associationData;
      this.defaultUserAssociation = Object.entries(associationData).map((e) => [
        e[0],
        ...Object.entries(e[1]).reduce(
          (prev, current) => (prev[1] < current[1] ? prev : current),
          ["", +Infinity]
        ),
      ]);
      this.defaultUserAssociation.sort((a, b) => {
        if (a[2] < b[2]) return -1;
        if (a[2] > b[2]) return 1;
        return 0;
      });
      console.log();
    },
    nwordlevenstein(array1, array2) {
      if (array1.length == 3 && array2.length == 3) {
        return Math.min(
          this.levensteinCached(array1[0], array2[0]) +
            this.levensteinCached(array1[1], array2[1]) +
            this.levensteinCached(array1[2], array2[2]),
          this.levensteinCached(array1[0], array2[1]) +
            this.levensteinCached(array1[1], array2[2]) +
            this.levensteinCached(array1[2], array2[0]),
          this.levensteinCached(array1[0], array2[2]) +
            this.levensteinCached(array1[1], array2[0]) +
            this.levensteinCached(array1[2], array2[1])
        );
      } else if (array1.length == 2 && array2.length == 2) {
        return Math.min(
          this.levensteinCached(array1[0], array2[0]) +
            this.levensteinCached(array1[1], array2[1]),
          this.levensteinCached(array1[1], array2[0]) +
            this.levensteinCached(array1[0], array2[1])
        );
      }
      return +Infinity;
    },
    levensteinCached(word1, word2) {
      if (this.levensteinCache[word1] && this.levensteinCache[word1][word2]) {
        return this.levensteinCache[word1][word2];
      }
      if (this.levensteinCache[word2] && this.levensteinCache[word2][word1]) {
        return this.levensteinCache[word2][word1];
      }
      if (!this.levensteinCache[word1]) {
        this.levensteinCache[word1] = {};
      }
      this.levensteinCache[word1][word2] = levenshtein(word1, word2);
      return this.levensteinCache[word1][word2];
    },
    stringToWords(string) {
      return string
        .toLowerCase()
        .replace(/[^A-Za-z\s!?]/g, "")
        .split(" ")
        .filter((e) => e.length > 0);
    },
    requestChangeAssociation(name) {
      this.defaultUserAssociation.find((e) => e[0] == name)[3] = Object.entries(
        this.associationData[name]
      ).sort((a, b) => {
        if (a[1] < b[1]) return -1;
        if (a[1] > b[1]) return 1;
        return 0;
      });

      console.log(this.associationData[name]);
    },
    deleteAssociation(name) {
      let association = this.defaultUserAssociation.find((e) => e[0] == name);
      delete association[1];
      association[2] = +Infinity;
      delete association[3];
      this.defaultUserAssociation.sort((a, b) => {
        if (a[2] < b[2]) return -1;
        if (a[2] > b[2]) return 1;
        return 0;
      });
    },
    changeAssociation(name, event) {
      this.defaultUserAssociation.find((e) => e[0] == name)[1] =
        event.target.value;
    },
    validateAssociation(name) {
      let association = this.defaultUserAssociation.find((e) => e[0] == name);
      association[2] = 0;
    },
    async saveData() {
      console.log(
        await this.$store.state.sqlWorker.send({
          id: this.$store.state.sqlWorker.id++,
          action: "exec",
          sql: `CREATE TABLE IF NOT EXISTS SurveyQuestion (
            Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            Question TEXT
        );`,
        })
      );

      await this.$store.state.sqlWorker.send({
        id: this.$store.state.sqlWorker.id++,
        action: "exec",
        sql: `CREATE TABLE IF NOT EXISTS UserAnswers (
            UserId TEXT,
            QuestionId INTEGER,
            Answer TEXT,
            FOREIGN KEY (UserId) REFERENCES Users(Id)
            FOREIGN KEY(QuestionId) REFERENCES SurveyQuestion(Id),
            PRIMARY KEY(UserId, QuestionId)
        );`,
      });
      Object.keys(this.originalCSV[0]).forEach((e) => {
        this.$store.dispatch("addQuestion", { Question: e });
      });
      let onlyValidated = Array.from(this.defaultUserAssociation).filter(
        (e) => e[2] == 0
      );
      Array.from(this.originalCSV).forEach((userAnswers) => {
        let userCorrespondance = onlyValidated.find(
          (e) => e[0] == userAnswers["2. Nom &amp; Prénom :"]
        );
        if (userCorrespondance) {
          let userId = userCorrespondance[1] + this.uptaleEmail;
          Object.entries(userAnswers).forEach((singleAnswer) => {
            this.$store.dispatch("addAnswer", {
              Question: singleAnswer[0],
              Answer: singleAnswer[1],
              UserId: userId,
            });
          });
        }
      });
    },
  },
};
</script>

<style scoped>
</style>