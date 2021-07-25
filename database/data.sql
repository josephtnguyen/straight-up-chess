insert into "games" ("message", "playerName", "playerSide", "opponentSide", "resolved")
values ('play me', 'Anonymous', 'black', 'white', FALSE),
       ('please go easy on me ;)', 'username12', 'white', 'black', FALSE)
returning *;
