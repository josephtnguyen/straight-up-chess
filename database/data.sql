insert into "games" ("message", "playerName", "playerSide", "opponentSide")
values ('play me', 'Anonymous', 'black', 'white'),
       ('please go easy on me ;)', 'username12', 'white', 'black')
returning *;

insert into "users" ("username", "hashedPassword")
values ('testing', 'lololol')
returning *;
