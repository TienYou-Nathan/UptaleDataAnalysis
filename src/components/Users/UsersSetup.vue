<template>
  <form @submit.prevent="addUserGroup">
    <input id="userGroup" type="text" placeholder="add userGroup" />
  </form>
  <div id="GroupFilter">
    <span
      v-for="group in usersGroups"
      :key="group.Id"
      :style="{ color: group.Color }"
    >
      <input type="checkbox" checked="true" disabled="true" />
      {{ group.Name + " : " + group.Type }}
    </span>
  </div>
  <table id="userList">
    <tr>
      <th>User</th>
      <th v-for="group in usersGroups" :key="group.Id">
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
      <td :style="{ color: user.Groups[0].Color }">{{ user.Id }}</td>
      <td
        v-for="group in usersGroups"
        :key="group.Id"
        @click="$event.target.querySelector('input').click()"
      >
        <input
          type="checkbox"
          :name="user.Id"
          :value="group.Name"
          @click.stop="updateUserGroupAssociation(user, group.Id)"
          :checked="user.Groups.find((e) => e.Id == group.Id)"
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
    "deleteUserGroupAssociation",
    "addUserGroupAssociation",
    "updateUserGroup",
    "deleteUserGroup",
  ],
  props: {
    users: Array,
    usersGroups: Array,
  },
  created() {
    console.log(this.users);
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
    updateUserGroupAssociation(user, groupId) {
      console.log({
        UserId: user.Id,
        UserGroupId: groupId,
      });
      if (user.Groups.find((e) => e.Id == groupId)) {
        this.$emit("deleteUserGroupAssociation", {
          UserId: user.Id,
          UserGroupId: groupId,
        });
      } else {
        console.log("add");
        this.$emit("addUserGroupAssociation", {
          UserId: user.Id,
          UserGroupId: groupId,
        });
      }
    },
    colorchange(e, id) {
      this.$emit("updateUserGroup", { id, color: e.srcElement.value });
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
#GroupFilter {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
#GroupFilter *:hover {
  background: lightgray;
  cursor: not-allowed;
}
</style>