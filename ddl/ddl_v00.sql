
DROP DATABASE IF EXISTS "tasks";
CREATE DATABASE "tasks" ENCODING='UTF8' LC_COLLATE='C' LC_CTYPE='C';

CREATE TABLE "members" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL
);

CREATE TABLE "projects" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "note" TEXT,
    "volume" INTEGER NOT NULL,
    "start" DATE NOT NULL,
    "last" DATE NOT NULL
);

CREATE TABLE "assigns" (
    "id" SERIAL PRIMARY KEY,
    "member_id" INTEGER NOT NULL references "members"("id"),
    "project_id" INTEGER NOT NULL references "projects"("id"),
    UNIQUE("member_id", "project_id")
);
