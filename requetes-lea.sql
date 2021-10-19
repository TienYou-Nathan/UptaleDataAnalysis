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

-- Toutes les sessions entre deux dates

SELECT 
    Sessions.Id AS SessionId,
    Sessions.UserId,
    strftime('%Y-%m-%d %H:%M', StartTime / 1000, 'unixepoch') AS StartDate,
    Sessions.StartTime,
    strftime('%Y-%m-%d %H:%M', EndTime / 1000, 'unixepoch') AS EndDate
FROM Sessions
WHERE Sessions.StartTime > 1618869600000 AND Sessions.StartTime < 1618956000000
GROUP BY UserId
ORDER BY StartTime

-- Group setup
UPDATE Users 
     SET UserGroupId = (SELECT Id FROM UsersGroups WHERE Name = "M1 EUK CVL")
WHERE Users.Id IN (
    SELECT Sessions.UserId AS Id
    FROM Sessions
    WHERE Sessions.StartTime > 1618869600000 AND Sessions.StartTime < 1618956000000
    GROUP BY UserId
    ORDER BY StartTime);

UPDATE Users 
     SET UserGroupId = (SELECT Id FROM UsersGroups WHERE Name = "M2 IFMK Bordeaux")
WHERE Users.Id IN (
    SELECT Sessions.UserId AS Id
    FROM Sessions
    WHERE Sessions.StartTime > 1620165600000 AND Sessions.StartTime < 1620252000000
    GROUP BY UserId
    ORDER BY StartTime);

UPDATE Users 
     SET UserGroupId = (SELECT Id FROM UsersGroups WHERE Name = "M1 IFMK Poitiers")
WHERE Users.Id IN (
    SELECT Sessions.UserId AS Id
    FROM Sessions
    WHERE Sessions.StartTime > 1620597600000 AND Sessions.StartTime < 1620640800000
    GROUP BY UserId
    ORDER BY StartTime);

UPDATE Users 
     SET UserGroupId = (SELECT Id FROM UsersGroups WHERE Name = "M2 IFMK Poitiers")
WHERE Users.Id IN (
    SELECT Sessions.UserId AS Id
    FROM Sessions
    WHERE Sessions.StartTime > 1620640800000 AND Sessions.StartTime < 1620684000000
    GROUP BY UserId
    ORDER BY StartTime);

UPDATE Users 
     SET UserGroupId = (SELECT Id FROM UsersGroups WHERE Name = "M2 EUK CVL")
WHERE Users.Id IN (
    SELECT Sessions.UserId AS Id
    FROM Sessions
    WHERE Sessions.StartTime > 1621202400000 AND Sessions.StartTime < 1621288800000
    GROUP BY UserId
    ORDER BY StartTime);

UPDATE Users 
     SET UserGroupId = (SELECT Id FROM UsersGroups WHERE Name = "M2 IFMK Croix Rouge Limoges")
WHERE Users.Id IN (
    SELECT Sessions.UserId AS Id
    FROM Sessions
    WHERE Sessions.StartTime > 1621461600000 AND Sessions.StartTime < 1621548000000
    GROUP BY UserId
    ORDER BY StartTime);


UPDATE Users 
     SET UserGroupId = (SELECT Id FROM UsersGroups WHERE Name = "M1 IFMK Croix Rouge Limoges")
WHERE Users.Id IN (
    SELECT Sessions.UserId AS Id
    FROM Sessions
    WHERE Sessions.StartTime > 1622498400000 AND Sessions.StartTime < 1622584800000
    GROUP BY UserId
    ORDER BY StartTime);

UPDATE Users 
     SET UserGroupId = (SELECT Id FROM UsersGroups WHERE Name = "M1 IFMK Bordeaux")
WHERE Users.Id IN (
    SELECT Sessions.UserId AS Id
    FROM Sessions
    WHERE Sessions.StartTime > 1624572000000 AND Sessions.StartTime < 1624658400000
    GROUP BY UserId
    ORDER BY StartTime);