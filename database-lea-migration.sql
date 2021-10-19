PRAGMA foreign_keys = off;
BEGIN TRANSACTION;
ALTER TABLE Users
    RENAME TO _Users_old;
CREATE TABLE IF NOT EXISTS Users (Id TEXT PRIMARY KEY, Name TEXT);
INSERT INTO Users
SELECT Id,
    Name
FROM _Users_old;
COMMIT;
PRAGMA foreign_keys = on;
CREATE TABLE IF NOT EXISTS UserGroupAssociation (
    UserId TEXT,
    UserGroupId INTEGER,
    FOREIGN KEY(UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY(UserGroupId) REFERENCES UsersGroups(Id) ON DELETE CASCADE,
    PRIMARY KEY(UserId, UserGroupId)
);
INSERT INTO UserGroupAssociation (UserId, UserGroupId)
SELECT Id,
    UserGroupId
FROM _Users_old
WHERE UserGroupId IS NOT NULL;
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;
DROP TABLE _Users_old;
COMMIT;
PRAGMA foreign_keys = on;