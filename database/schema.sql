set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public.game" (
	"gameId" serial NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	CONSTRAINT "game_pk" PRIMARY KEY ("gameId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.moves" (
	"gameId" integer NOT NULL,
	"start" integer NOT NULL,
	"end" integer NOT NULL,
	"moveId" serial NOT NULL,
	CONSTRAINT "moves_pk" PRIMARY KEY ("moveId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.postedGames" (
	"gameId" integer NOT NULL,
	"message" TEXT NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
) WITH (
  OIDS=FALSE
);




ALTER TABLE "moves" ADD CONSTRAINT "moves_fk0" FOREIGN KEY ("gameId") REFERENCES "game"("gameId");

ALTER TABLE "postedGames" ADD CONSTRAINT "postedGames_fk0" FOREIGN KEY ("gameId") REFERENCES "game"("gameId");
