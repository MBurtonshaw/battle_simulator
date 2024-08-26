BEGIN TRANSACTION;

DROP TABLE IF EXISTS hero CASCADE;
DROP TABLE IF EXISTS score CASCADE;

CREATE TABLE hero(
	hero_id SERIAL,
	name varchar(14) NOT NULL,
	health_points int,
	magic_points int,
	exp_points int,
	damage int,
	enemies_defeated int,
	CONSTRAINT PK_hero PRIMARY KEY (hero_id)
);

CREATE TABLE score(
	name varchar(14) NOT NULL,
	enemies_defeated int
);

INSERT INTO score VALUES('Matt', 10);

COMMIT TRANSACTION;