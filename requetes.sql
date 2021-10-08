-- Toutes les questions avec leurs propriétés utiles
SELECT QCMAnswers.Id, IsCorrect, Users.Id, UsersGroups.Name
FROM QCMAnswers
LEFT JOIN Sessions ON Sessions.Id = QCMAnswers.SessionId
LEFT JOIN Users ON Users.Id = Sessions.UserID
LEFT JOIN UsersGroups ON Users.UserGroupId = UsersGroups.Id
WHERE UsersGroups.Name = "Expert"

-- Moyenne de score des utilisateurs novices
SELECT COUNT(QCMAnswers.Id), AVG(IsCorrect)
FROM QCMAnswers
LEFT JOIN Sessions ON Sessions.Id = QCMAnswers.SessionId
LEFT JOIN Users ON Users.Id = Sessions.UserID
LEFT JOIN UsersGroups ON Users.UserGroupId = UsersGroups.Id
WHERE UsersGroups.Name = "Novice"

-- Score par utilisateur Novice
SELECT COUNT(QCMAnswers.Id), Users.Id, AVG(IsCorrect)
FROM QCMAnswers
LEFT JOIN Sessions ON Sessions.Id = QCMAnswers.SessionId
LEFT JOIN Users ON Users.Id = Sessions.UserID
LEFT JOIN UsersGroups ON Users.UserGroupId = UsersGroups.Id
WHERE UsersGroups.Name = "Novice"
GROUP BY Users.Id

-- Combien de fois chaque zone a été trouvée
SELECT QCM.Name, COUNT(QCMAnswers.Id) as count
FROM QCMAnswers
LEFT JOIN QCM ON QCM.Id = QCMAnswers.TagId
GROUP BY QCM.Id
ORDER BY count

-- Temps avant le premier click
SELECT Sessions.Id, Sessions.UserId, MIN(TopicsClicks.Timestamp - Sessions.StartTime) FROM Sessions  
LEFT JOIN topicsClicks ON sessions.Id = topicsClicks.SessionId
GROUP BY Sessions.Id

-- Toutes les actions des utilisateurs
SELECT Sessions.UserId, Topics.Name, Topics.SceneId, TopicsClicks.Timestamp, Topics.Type 
FROM topicsClicks
left join topics on topicsClicks.TopicId = topics.Id
left join sessions on sessions.Id = topicsClicks.sessionId

-- Toutes les actions des utilisateurs, dans un autre format
SELECT Sessions.UserId, GROUP_CONCAT(Topics.Name)
FROM topicsClicks
left join topics on topicsClicks.TopicId = topics.Id
left join sessions on sessions.Id = topicsClicks.sessionId
GROUP BY Sessions.ID

-- 5 premières actions de tous les utilisateurs
SELECT UserId, Name FROM(
    SELECT Sessions.UserId, 
        Topics.Name, 
        Topics.SceneId, 
        TopicsClicks.Timestamp, 
        Topics.Type, 
        ROW_NUMBER() 
            OVER (
                Partition by Sessions.UserId
                Order by Sessions.UserId
            ) RowNumb
    FROM topicsClicks
    left join topics on topicsClicks.TopicId = topics.Id
    left join sessions on sessions.Id = topicsClicks.sessionId)
WHERE RowNumb <= 5;

-- Quels 5 premieras tags ont été les plus cliqués ?
SELECT Name, COUNT(Name) AS Count FROM(

SELECT Sessions.UserId, 
    Topics.Name, 
    Topics.SceneId, 
    TopicsClicks.Timestamp, 
    Topics.Type, 
    ROW_NUMBER() 
        OVER (
            Partition by Sessions.UserId
            Order by Sessions.UserId
        ) RowNumb
FROM topicsClicks
left join topics on topicsClicks.TopicId = topics.Id
left join sessions on sessions.Id = topicsClicks.sessionId)
WHERE RowNumb <= 5
GROUP BY Name
ORDER BY Count