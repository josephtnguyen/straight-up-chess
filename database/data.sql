insert into "games" ("message", "playerName", "playerSide", "opponentSide")
values ('play me', 'Anonymous', 'black', 'white'),
       ('please go easy on me ;)', 'username12', 'white', 'black')
returning *;

insert into "users" ("username", "hashedPassword")
values ('Anonymous', '$argon2i$v=19$m=4096,t=3,p=1$fXkHPjxT6IK9v4B24KSg5g$7l5Z1ToiLwwznekaFDcfGFqhESXHskA5nuDvxPXLJ78')
returning *;
