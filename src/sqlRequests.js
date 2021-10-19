function resultsToObject(results) {
  return (
    results?.values.reduce((acc, array) => {
      let temp = {};
      array.forEach((e, i) => {
        temp[results.columns[i]] = e;
      });
      acc.push(temp);
      return acc;
    }, []) || []
  );
}

async function requestSQL(sqlWorker, request, params) {
  let results = await sqlWorker.send({
    id: sqlWorker.id++,
    action: "exec",
    sql: request,
    params: params,
  });
  if (results && results.results) {
    results = results.results[0];
  } else {
    results = null;
  }
  return resultsToObject(results);
}

export async function getScenes(sqlWorker) {
  return requestSQL(
    sqlWorker,
    `SELECT 
            Scenes.Id, 
            Scenes.Name, 
            Categories.Id AS "CategoryId",
            Categories.Name AS "CategoryName", 
            Categories.Color AS "CategoryColor",
            Themes.Id AS "ThemeId", 
            Themes.Name AS "ThemeName", 
            Themes.Color AS "ThemeColor" 
        FROM Scenes 
        LEFT JOIN Categories 
            ON Categories.Id = Scenes.CategoryId 
        LEFT JOIN Themes 
            ON Themes.Id = Scenes.ThemeId`
  );
}

export async function getCategories(sqlWorker) {
  return requestSQL(sqlWorker, `SELECT Id, Name, Color FROM Categories`);
}

export async function addCategory(sqlWorker, category) {
  return requestSQL(
    sqlWorker,
    "INSERT INTO Categories (Name, Color) VALUES ($name, $color)",
    { $name: category.name, $color: category.color }
  );
}

export async function updateCategory(sqlWorker, category) {
  return requestSQL(
    sqlWorker,
    `UPDATE Categories SET Color = $color WHERE Id = $id`,
    { $id: category.id, $color: category.color }
  );
}

export async function getThemes(sqlWorker) {
  return requestSQL(sqlWorker, `SELECT Id, Name, Color FROM Themes`);
}

export async function addTheme(sqlWorker, theme) {
  return requestSQL(
    sqlWorker,
    "INSERT INTO Themes (Name, Color) VALUES ($name, $color);",
    { $name: theme.name, $color: theme.color }
  );
}

export async function updateTheme(sqlWorker, theme) {
  return requestSQL(
    sqlWorker,
    `UPDATE Themes SET Color = $color WHERE Id = $id`,
    { $id: theme.id, $color: theme.color }
  );
}

export async function updateScene(sqlWorker, scene) {
  return requestSQL(
    sqlWorker,
    `UPDATE Scenes SET CategoryId = $categoryId, ThemeId = $themeId WHERE Id = $id`,
    {
      $id: scene.sceneId,
      $categoryId: scene.categoryId,
      $themeId: scene.themeId,
    }
  );
}

export async function getUsers(sqlWorker, groupType = "Expertise") {
  return requestSQL(
    sqlWorker,
    `WITH SpecificGroup AS (SELECT * FROM UsersGroups WHERE UsersGroups.Type = $groupType)

    SELECT Users.Id,
          Users.Name,
          MAX(SpecificGroup.Id) AS UserGroupId
        FROM USERS
            LEFT JOIN UserGroupAssociation ON UserGroupAssociation.UserId = Users.Id
            LEFT JOIN SpecificGroup ON SpecificGroup.Id = UserGroupAssociation.UserGroupId
        GROUP BY Users.Id;`,
        {
          $groupType:groupType
        }
  );
}

export async function getUsersGroups(sqlWorker) {
  return requestSQL(sqlWorker, `SELECT Id, Name, Color, Type FROM UsersGroups`);
}

export async function addUserGroup(sqlWorker, userGroup) {
  return requestSQL(
    sqlWorker,
    "INSERT INTO UsersGroups (Name, Color) VALUES ($name, $color)",
    { $name: userGroup.name, $color: userGroup.color }
  );
}

export async function updateUserGroup(sqlWorker, userGroup) {
  return requestSQL(
    sqlWorker,
    `UPDATE UsersGroups SET Color = $color WHERE Id = $id`,
    { $id: userGroup.id, $color: userGroup.color }
  );
}

export async function deleteUserGroup(sqlWorker, groupId) {
  return requestSQL(sqlWorker, `DELETE FROM UsersGroups WHERE Id = $id`, {
    $id: groupId.id,
  });
}

export async function updateUser(sqlWorker, user) {
  return requestSQL(
    sqlWorker,
    `UPDATE Users SET UserGroupId = $userGroupId WHERE Id = $id`,
    { $id: user.id, $userGroupId: user.userGroupId }
  );
}

export async function debug(sqlWorker, request) {
  let output = await sqlWorker.send({
    id: sqlWorker.id++,
    action: "exec",
    sql: request,
  });
  if (output.error) {
    throw output.error;
  }
  console.log("output", output.results[0].columns);
  console.table(output.results[0].values);

  if (output && output.results) {
    output = output.results[0];
  } else {
    output = null;
  }

  return { data: output, dataObject: resultsToObject(output) };
}
