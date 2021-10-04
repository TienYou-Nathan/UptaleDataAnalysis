function resultsToObject(results) {
    return results?.values.reduce((acc, array) => {
        let temp = {}
        array.forEach((e, i) => {
            temp[results.columns[i]] = e
        })
        acc.push(temp)
        return acc
    }, []) || []
}

async function requestSQL(sqlWorker, request, params) {
    let results = (await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql: request,
        params: params
    })).results[0]
    return resultsToObject(results)
}


export async function getScenes(sqlWorker) {
    return requestSQL(sqlWorker,
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
        ON Themes.Id = Scenes.ThemeId`)
}

export async function getCategories(sqlWorker) {
    return requestSQL(sqlWorker,
        `SELECT Id, Name, Color FROM Categories`)
}

export async function addCategory(sqlWorker, category) {
    return requestSQL(sqlWorker,
        "INSERT INTO Categories (Name, Color) VALUES ($name, $color)",
        { $name: category.name, $color: category.color })
}

export async function updateCategory(sqlWorker, category) {
    return requestSQL(sqlWorker,
        `UPDATE Categories SET Color = $color WHERE Id = $id`,
        { $id: category.id, $color: category.color })
}

export async function getThemes(sqlWorker) {
    return requestSQL(sqlWorker,
        `SELECT Id, Name, Color FROM Themes`)
}

export async function addTheme(sqlWorker, theme) {
    return requestSQL(sqlWorker,
        "INSERT INTO Themes (Name, Color) VALUES ($name, $color);",
        { $name: theme.name, $color: theme.color })
}

export async function updateTheme(sqlWorker, theme) {
    return requestSQL(sqlWorker,
        `UPDATE Themes SET Color = $color WHERE Id = $id`,
        { $id: theme.id, $color: theme.color })
}

export async function updateScene(sqlWorker, scene) {
    return requestSQL(sqlWorker,
        `UPDATE Scenes SET CategoryId = $categoryId, ThemeId = $themeId WHERE Id = $id`,
        { $id: scene.sceneId, $categoryId: scene.categoryId, $themeId: scene.themeId })
}