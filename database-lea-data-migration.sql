INSERT INTO UsersGroups (Name)
VALUES ("M1");
INSERT INTO UsersGroups (Name)
VALUES ("M2");
INSERT INTO UsersGroups (Name)
VALUES ("EUK CVL");
INSERT INTO UsersGroups (Name)
VALUES ("IFMK Bordeaux");
INSERT INTO UsersGroups (Name)
VALUES ("IFMK Poitiers");
INSERT INTO UsersGroups (Name)
VALUES ("IFMK Croix Rouge Limoges");
INSERT INTO UserGroupAssociation (UserId, UserGroupId)
SELECT Users.Id,
    (
        SELECT Id
        FROM UsersGroups
        WHERE Name = "M1"
    )
FROM Users
    LEFT JOIN UserGroupAssociation ON UserGroupAssociation.UserId = Users.Id
    LEFT JOIN UsersGroups ON UsersGroups.Id = UserGroupAssociation.UserGroupId
WHERE UsersGroups.Name LIKE "M1%";
INSERT INTO UserGroupAssociation (UserId, UserGroupId)
SELECT Users.Id,
    (
        SELECT Id
        FROM UsersGroups
        WHERE Name = "M2"
    )
FROM Users
    LEFT JOIN UserGroupAssociation ON UserGroupAssociation.UserId = Users.Id
    LEFT JOIN UsersGroups ON UsersGroups.Id = UserGroupAssociation.UserGroupId
WHERE UsersGroups.Name LIKE "M2%";
INSERT INTO UserGroupAssociation (UserId, UserGroupId)
SELECT Users.Id,
    (
        SELECT Id
        FROM UsersGroups
        WHERE Name = "EUK CVL"
    )
FROM Users
    LEFT JOIN UserGroupAssociation ON UserGroupAssociation.UserId = Users.Id
    LEFT JOIN UsersGroups ON UsersGroups.Id = UserGroupAssociation.UserGroupId
WHERE UsersGroups.Name LIKE "%EUK CVL";
INSERT INTO UserGroupAssociation (UserId, UserGroupId)
SELECT Users.Id,
    (
        SELECT Id
        FROM UsersGroups
        WHERE Name = "IFMK Bordeaux"
    )
FROM Users
    LEFT JOIN UserGroupAssociation ON UserGroupAssociation.UserId = Users.Id
    LEFT JOIN UsersGroups ON UsersGroups.Id = UserGroupAssociation.UserGroupId
WHERE UsersGroups.Name LIKE "%IFMK Bordeaux";
INSERT INTO UserGroupAssociation (UserId, UserGroupId)
SELECT Users.Id,
    (
        SELECT Id
        FROM UsersGroups
        WHERE Name = "IFMK Poitiers"
    )
FROM Users
    LEFT JOIN UserGroupAssociation ON UserGroupAssociation.UserId = Users.Id
    LEFT JOIN UsersGroups ON UsersGroups.Id = UserGroupAssociation.UserGroupId
WHERE UsersGroups.Name LIKE "%IFMK Poitiers";
INSERT INTO UserGroupAssociation (UserId, UserGroupId)
SELECT Users.Id,
    (
        SELECT Id
        FROM UsersGroups
        WHERE Name = "IFMK Croix Rouge Limoges"
    )
FROM Users
    LEFT JOIN UserGroupAssociation ON UserGroupAssociation.UserId = Users.Id
    LEFT JOIN UsersGroups ON UsersGroups.Id = UserGroupAssociation.UserGroupId
WHERE UsersGroups.Name LIKE "%IFMK Croix Rouge Limoges";
DELETE FROM UserGroupAssociation
WHERE (UserId, UserGroupId) IN (
        SELECT UserId,
            UserGroupId
        FROM UserGroupAssociation
            LEFT JOIN UsersGroups ON UsersGroups.Id = UserGroupAssociation.UserGroupId
        WHERE UsersGroups.Name = "M1 EUK CVL"
    );
DELETE FROM UserGroupAssociation
WHERE (UserId, UserGroupId) IN (
        SELECT UserId,
            UserGroupId
        FROM UserGroupAssociation
            LEFT JOIN UsersGroups ON UsersGroups.Id = UserGroupAssociation.UserGroupId
        WHERE UsersGroups.Name = "M2 IFMK Bordeaux"
    );
DELETE FROM UserGroupAssociation
WHERE (UserId, UserGroupId) IN (
        SELECT UserId,
            UserGroupId
        FROM UserGroupAssociation
            LEFT JOIN UsersGroups ON UsersGroups.Id = UserGroupAssociation.UserGroupId
        WHERE UsersGroups.Name = "M1 IFMK Poitiers"
    );
DELETE FROM UserGroupAssociation
WHERE (UserId, UserGroupId) IN (
        SELECT UserId,
            UserGroupId
        FROM UserGroupAssociation
            LEFT JOIN UsersGroups ON UsersGroups.Id = UserGroupAssociation.UserGroupId
        WHERE UsersGroups.Name = "M2 IFMK Poitiers"
    );
DELETE FROM UserGroupAssociation
WHERE (UserId, UserGroupId) IN (
        SELECT UserId,
            UserGroupId
        FROM UserGroupAssociation
            LEFT JOIN UsersGroups ON UsersGroups.Id = UserGroupAssociation.UserGroupId
        WHERE UsersGroups.Name = "M2 EUK CVL"
    );
DELETE FROM UserGroupAssociation
WHERE (UserId, UserGroupId) IN (
        SELECT UserId,
            UserGroupId
        FROM UserGroupAssociation
            LEFT JOIN UsersGroups ON UsersGroups.Id = UserGroupAssociation.UserGroupId
        WHERE UsersGroups.Name = "M2 IFMK Croix Rouge Limoges"
    );
DELETE FROM UserGroupAssociation
WHERE (UserId, UserGroupId) IN (
        SELECT UserId,
            UserGroupId
        FROM UserGroupAssociation
            LEFT JOIN UsersGroups ON UsersGroups.Id = UserGroupAssociation.UserGroupId
        WHERE UsersGroups.Name = "M1 IFMK Croix Rouge Limoges"
    );
DELETE FROM UserGroupAssociation
WHERE (UserId, UserGroupId) IN (
        SELECT UserId,
            UserGroupId
        FROM UserGroupAssociation
            LEFT JOIN UsersGroups ON UsersGroups.Id = UserGroupAssociation.UserGroupId
        WHERE UsersGroups.Name = "M1 IFMK Bordeaux"
    );
DELETE FROM UsersGroups
WHERE Name = "M1 EUK CVL"
    OR Name = "M2 IFMK Bordeaux"
    OR Name = "M1 IFMK Poitiers"
    OR Name = "M2 IFMK Poitiers"
    OR Name = "M2 EUK CVL"
    OR Name = "M2 IFMK Croix Rouge Limoges"
    OR Name = "M1 IFMK Croix Rouge Limoges"
    OR Name = "M1 IFMK Bordeaux";