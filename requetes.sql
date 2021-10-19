-- Moyenne de score des utilisateurs par groupe
SELECT 
    COUNT(QCMAnswers.Id) AS "Nombre de réponses", 
    SUM(IsCorrect) AS "Nombre de réponses justes", 
    AVG(IIF(IsCorrect = 0, -1, 1)) AS "Moyenne", 
    UsersGroups.Name AS 'Groupe'
FROM QCMAnswers
LEFT JOIN Sessions ON Sessions.Id = QCMAnswers.SessionId
LEFT JOIN Users ON Users.Id = Sessions.UserID
LEFT JOIN UsersGroups ON Users.UserGroupId = UsersGroups.Id
GROUP BY UsersGroups.Name

-- Tous les utilisateurs qui ont pris moins de 10 secondes à faire une action
SELECT * FROM
(SELECT 
    Sessions.Id AS "Session",
    Users.Id AS "User",
    UsersGroups.Name AS "Group",
    MIN(TopicsClicks.Timestamp - Sessions.StartTime) AS "Temps avant le premier clic"
FROM Sessions  
LEFT JOIN topicsClicks ON sessions.Id = topicsClicks.SessionId
LEFT JOIN Users ON Users.Id = Sessions.UserId
LEFT JOIN UsersGroups ON Users.UserGroupId = UsersGroups.Id
GROUP BY Sessions.Id
ORDER BY UsersGroups.Name)
WHERE "Temps avant le premier clic" < 10000

-- Moyenne du temps avant le premier click, par groupe
SELECT 
    "Group",
    AVG("Temps avant le premier clic") AS "Moyenne du temps avant le premier clic"
FROM
    (SELECT 
        Sessions.Id AS "Session",
        Users.Id AS "User",
        UsersGroups.Name AS "Group",
        MIN(TopicsClicks.Timestamp - Sessions.StartTime) AS "Temps avant le premier clic"
    FROM Sessions  
    LEFT JOIN topicsClicks ON sessions.Id = topicsClicks.SessionId
    LEFT JOIN Users ON Users.Id = Sessions.UserId
    LEFT JOIN UsersGroups ON Users.UserGroupId = UsersGroups.Id
    GROUP BY Sessions.Id
    ORDER BY UsersGroups.Name)
GROUP BY "Group"

-- Tags les plus cliqués par groupe 
SELECT 
    "Nombre de clicks",
    "TagName",
    "Group"
FROM 
    (SELECT
        COUNT(TopicsClicks.Id) AS "Nombre de clicks",
        Topics.Name AS "TagName",
        UsersGroups.Name AS "Group",
        ROW_NUMBER() 
                OVER (
                    Partition by UsersGroups.Name
                    Order by COUNT(TopicsClicks.Id) DESC
                ) RowNumb
    FROM TopicsClicks
    LEFT JOIN Topics ON TopicsClicks.TopicId = Topics.Id
    LEFT JOIN Sessions ON Sessions.Id = TopicsClicks.SessionId
    LEFT JOIN Users on Users.Id = Sessions.UserId
    LEFT JOIN UsersGroups ON Users.UserGroupID = UsersGroups.Id
    WHERE Topics.Name != "Cas clinique" AND Topics.Name != "Detecteur porte"
    GROUP BY Topics.Id, UsersGroups.Id)

-- Paths
WITH Visits AS (
    SELECT
        SceneVisit.SessionId,
        SceneVisit.EnterTime,
        Scenes.Name,
        Categories.Id,
        Categories.Name AS "Category"
    FROM SceneVisit
    LEFT JOIN Scenes ON SceneVisit.SceneId = Scenes.Id
    LEFT JOIN Categories ON Categories.Id = Scenes.CategoryId
    WHERE Category IS NOT NULL
    GROUP BY SceneVisit.SessionId, Categories.Name
    ORDER BY SceneVisit.SessionId, EnterTime
    LIMIT 1000
)
SELECT
    Path,
    COUNT(Path)
FROM (
    SELECT SessionId, GROUP_CONCAT(Category) AS Path FROM Visits
    GROUP BY SessionId
)
GROUP BY Path
ORDER BY COUNT(Path) DESC

-- Sessions by date
SELECT 
    Sessions.Id,
    Sessions.UserId,
    strftime('%Y-%m-%d %H:%M', StartTime / 1000, 'unixepoch') AS StartTime,
    strftime('%Y-%m-%d %H:%M', EndTime / 1000, 'unixepoch') AS StartTime
FROM Sessions
ORDER BY StartTime

filtre poure prendre les données entre deux dates uniquement