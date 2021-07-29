insert into "games" ("message", "playerName", "playerSide", "opponentSide")
values ('play me', 'Anonymous', 'black', 'white'),
       ('please go easy on me ;)', 'username12', 'white', 'black')
returning *;

insert into "users" ("username", "hashedPassword")
values ('test2', '$argon2i$v=19$m=4096,t=3,p=1$j6w4qeRdFviCpxH8KU6jgg$o9+RuUBKIuTvx8CnhlcQaJcZCalXZ6Dyp/NozO8RrK0')
returning *;
