<template>
  <form @submit.prevent="addUserGroup">
    <input id="userGroup" type="text" placeholder="add userGroup" />
  </form>
  <select name="GroupType" id="GroupType" @change="changeFocusedGroupType">
    <option v-for="group in groupTypes" :key="group" :value="group">
      {{ group }}
    </option>
  </select>
  <table id="userList">
    <tr>
      <th>User</th>
      <th v-for="group in reducedGroups" :key="group.Id">
        {{ group.Name }}<br />
        <input
          type="color"
          :value="group.Color"
          @change="colorchange($event, group.Id)"
        />
        <br />
        <input
          type="button"
          @click="deleteUserGroup(group.Id)"
          value="Delete"
        />
      </th>
    </tr>
    <tr v-for="user in users" :key="user.Id">
      <td :style="{ color: user.Color }">{{ user.Id }}</td>
      <td
        v-for="group in reducedGroups"
        :key="group.Id"
        @click="$event.target.querySelector('input').click()"
      >
        <input
          type="radio"
          :name="user.Id"
          :value="group.Name"
          @click.stop="updateUser(user.Id, group.Id)"
          :checked="group.Id == user.UserGroupId"
        />
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "UsersSetup",
  emits: [
    "addUserGroup",
    "updateUser",
    "updateUserGroup",
    "deleteUserGroup",
    "changeFocusedGroupType",
  ],
  components: {},
  props: {
    users: Array,
    usersGroups: Array,
    focusedGroupType: String,
  },
  data() {
    return {
      groupTypes: [],
      reducedGroups: [],
    };
  },
  created() {
    this.updateReducedGroups();
  },
  watch: {
    focusedGroupType() {
      this.updateReducedGroups();
    },
    usersGroups() {
      this.groupTypes = Object.keys(
        this.usersGroups.reduce((acc, e) => {
          acc[e.Type] = e.Type;
          return acc;
        }, {})
      );
      this.updateReducedGroups();
    },
  },
  methods: {
    addUserGroup(e) {
      this.$emit("addUserGroup", {
        name: e.srcElement.querySelector("#userGroup").value,
        color: "#ffffff",
      });
    },
    deleteUserGroup(groupId) {
      // if (confirm("Are you sure you want to delete this group?")) {
      this.$emit("deleteUserGroup", { id: groupId });
      // }
    },
    updateUser(userId, groupId) {
      this.$emit("updateUser", { id: userId, userGroupId: groupId });
    },
    colorchange(e, id) {
      this.$emit("updateUserGroup", { id, color: e.srcElement.value });
    },
    changeFocusedGroupType(event) {
      this.$emit("changeFocusedGroupType", event.srcElement.value);
    },
    updateReducedGroups() {
      this.reducedGroups = this.usersGroups.filter(
        (e) => e.Type == this.focusedGroupType
      );
    },
  },
};
</script>

<style scoped>
td {
  border-bottom: 1px solid black;
  border-right: solid 1px black;
  cursor: pointer;
}
input {
  cursor: pointer;
}

td:hover {
  background: lightgray;
}

td:first-child {
  text-align: left;
  padding: 0 30px;
  cursor: initial;
}

td:first-child:hover {
  background: none;
}
</style>