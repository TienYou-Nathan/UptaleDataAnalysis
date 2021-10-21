-- Paths
WITH Visits AS (
    SELECT SceneVisit.SessionId,
        SceneVisit.EnterTime,
        Scenes.Name,
        Categories.Id,
        Categories.Name AS "Category"
    FROM SceneVisit
        LEFT JOIN Scenes ON SceneVisit.SceneId = Scenes.Id
        LEFT JOIN Categories ON Categories.Id = Scenes.CategoryId
    WHERE Category IS NOT NULL
    GROUP BY SceneVisit.SessionId,
        Categories.Name
    ORDER BY SceneVisit.SessionId,
        EnterTime
    LIMIT 1000
)
SELECT Path,
    COUNT(Path)
FROM (
        SELECT SessionId,
            GROUP_CONCAT(Category) AS Path
        FROM Visits
        GROUP BY SessionId
    )
GROUP BY Path
ORDER BY COUNT(Path) DESC;
-- Sessions by date
SELECT Sessions.Id,
    Sessions.UserId,
    strftime('%Y-%m-%d %H:%M', StartTime / 1000, 'unixepoch') AS StartTime,
    strftime('%Y-%m-%d %H:%M', EndTime / 1000, 'unixepoch') AS StartTime
FROM Sessions
ORDER BY StartTime;
-- Toutes les sessions entre deux dates
SELECT Sessions.Id AS SessionId,
    Sessions.UserId,
    strftime('%Y-%m-%d %H:%M', StartTime / 1000, 'unixepoch') AS StartDate,
    Sessions.StartTime,
    strftime('%Y-%m-%d %H:%M', EndTime / 1000, 'unixepoch') AS EndDate
FROM Sessions
WHERE Sessions.StartTime > 1618869600000
    AND Sessions.StartTime < 1618956000000
GROUP BY UserId
ORDER BY StartTime;
-- Group setup
UPDATE Users
SET UserGroupId = (
        SELECT Id
        FROM UsersGroups
        WHERE Name = "M1 EUK CVL"
    )
WHERE Users.Id IN (
        SELECT Sessions.UserId AS Id
        FROM Sessions
        WHERE Sessions.StartTime > 1618869600000
            AND Sessions.StartTime < 1618956000000
        GROUP BY UserId
        ORDER BY StartTime
    );
UPDATE Users
SET UserGroupId = (
        SELECT Id
        FROM UsersGroups
        WHERE Name = "M2 IFMK Bordeaux"
    )
WHERE Users.Id IN (
        SELECT Sessions.UserId AS Id
        FROM Sessions
        WHERE Sessions.StartTime > 1620165600000
            AND Sessions.StartTime < 1620252000000
        GROUP BY UserId
        ORDER BY StartTime
    );
UPDATE Users
SET UserGroupId = (
        SELECT Id
        FROM UsersGroups
        WHERE Name = "M1 IFMK Poitiers"
    )
WHERE Users.Id IN (
        SELECT Sessions.UserId AS Id
        FROM Sessions
        WHERE Sessions.StartTime > 1620597600000
            AND Sessions.StartTime < 1620640800000
        GROUP BY UserId
        ORDER BY StartTime
    );
UPDATE Users
SET UserGroupId = (
        SELECT Id
        FROM UsersGroups
        WHERE Name = "M2 IFMK Poitiers"
    )
WHERE Users.Id IN (
        SELECT Sessions.UserId AS Id
        FROM Sessions
        WHERE Sessions.StartTime > 1620640800000
            AND Sessions.StartTime < 1620684000000
        GROUP BY UserId
        ORDER BY StartTime
    );
UPDATE Users
SET UserGroupId = (
        SELECT Id
        FROM UsersGroups
        WHERE Name = "M2 EUK CVL"
    )
WHERE Users.Id IN (
        SELECT Sessions.UserId AS Id
        FROM Sessions
        WHERE Sessions.StartTime > 1621202400000
            AND Sessions.StartTime < 1621288800000
        GROUP BY UserId
        ORDER BY StartTime
    );
UPDATE Users
SET UserGroupId = (
        SELECT Id
        FROM UsersGroups
        WHERE Name = "M2 IFMK Croix Rouge Limoges"
    )
WHERE Users.Id IN (
        SELECT Sessions.UserId AS Id
        FROM Sessions
        WHERE Sessions.StartTime > 1621461600000
            AND Sessions.StartTime < 1621548000000
        GROUP BY UserId
        ORDER BY StartTime
    );
UPDATE Users
SET UserGroupId = (
        SELECT Id
        FROM UsersGroups
        WHERE Name = "M1 IFMK Croix Rouge Limoges"
    )
WHERE Users.Id IN (
        SELECT Sessions.UserId AS Id
        FROM Sessions
        WHERE Sessions.StartTime > 1622498400000
            AND Sessions.StartTime < 1622584800000
        GROUP BY UserId
        ORDER BY StartTime
    );
UPDATE Users
SET UserGroupId = (
        SELECT Id
        FROM UsersGroups
        WHERE Name = "M1 IFMK Bordeaux"
    )
WHERE Users.Id IN (
        SELECT Sessions.UserId AS Id
        FROM Sessions
        WHERE Sessions.StartTime > 1624572000000
            AND Sessions.StartTime < 1624658400000
        GROUP BY UserId
        ORDER BY StartTime
    );


-- IDK
SELECT 
	SceneVisit.SessionId,
	Topics.Name,
	Scenes.Name,
	Categories.Name
FROM SceneVisit
LEFT JOIN Scenes on Scenes.Id = SceneVisit.SceneId
LEFT JOIN Categories ON Scenes.CategoryId = Categories.Id
LEFT JOIN TopicsClicks On TopicsClicks.SessionId = SceneVisit.SessionId
LEFT JOIN Topics On Topics.Id = TopicsClicks.TopicId
WHERE SceneVisit.SessionId = "00b51d68-406f-4f91-84ee-2f6a7393f634" AND Categories.Name != "Obligatoire" AND Topics.Name NOT LIKE "Masquer%"
ORDER BY SceneVisit.EnterTime ASC;

SELECT * FROM TopicsClicks
LEFT JOIN Topics On Topics.Id = TopicsClicks.TopicId
LIMIT 100;


-- En globalité, quels sont les tags les plus cliqués par chaque groupe
WITH 
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
WHERE UsersGroups.Type = "Expertise" AND Categories.Name != "Tutoriel" AND Topics.Name NOT LIKE "Masquer%")


SELECT 
	TopicName, SceneName, CategoryName,
	COUNT(CASE WHEN UserGroupName = "M1" THEN UserGroupName END) AS "M1 Clicks",
	COUNT(CASE WHEN UserGroupName = "M2" THEN UserGroupName END) AS "M2 Clicks",
	COUNT(CASE WHEN UserGroupName = "M1" THEN UserGroupName END) - COUNT(CASE WHEN UserGroupName = "M2" THEN UserGroupName END) AS "Clicks Difference",
    AVG(CASE WHEN UserGroupName = "M1" THEN TopicOrder END) AS "M1 Order Avg",
	AVG(CASE WHEN UserGroupName = "M2" THEN TopicOrder END) AS "M2 Order Avg",
	AVG(CASE WHEN UserGroupName = "M1" THEN TopicOrder END) - AVG(CASE WHEN UserGroupName = "M2" THEN TopicOrder END) AS "Order Difference"
	FROM AllClicks
	WHERE CategoryName != "Obligatoire"
GROUP BY TopicId
ORDER BY "Order Difference";


--En Globalité, quelles sont les scènes les plus visitées par chaque groupe
WITH Visites AS
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
	SceneName,
	COUNT(CASE WHEN UserGroupName = "M1" THEN UserGroupName END) AS "M1 Visits",
	COUNT(CASE WHEN UserGroupName = "M2" THEN UserGroupName END) AS "M2 Visits",
	COUNT(CASE WHEN UserGroupName = "M1" THEN UserGroupName END) - COUNT(CASE WHEN UserGroupName = "M2" THEN UserGroupName END) AS "Visits Difference",
	AVG(CASE WHEN UserGroupName = "M1" THEN SceneOrder END) AS "M1 Order Avg",
	AVG(CASE WHEN UserGroupName = "M2" THEN SceneOrder END) AS "M2 Order Avg",
	AVG(CASE WHEN UserGroupName = "M1" THEN SceneOrder END) - AVG(CASE WHEN UserGroupName = "M2" THEN SceneOrder END) AS "Order Difference"
FROM Visites 
GROUP BY SCeneId
ORDER BY "Order Difference";