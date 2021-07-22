insert into "games" ("playerName", "playerSide", "message")
values ('Anonymous', 'black', 'play me'),
       ('username12', 'white', 'please go easy on me ;)')
returning *;
