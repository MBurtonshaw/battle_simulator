BEGIN TRANSACTION;

DROP TABLE IF EXISTS hero CASCADE;
DROP TABLE IF EXISTS item CASCADE;
DROP TABLE IF EXISTS hero_item CASCADE;

CREATE TABLE hero (
    hero_id SERIAL,
    name varchar(14) NOT NULL,
    health_points int,
    magic_points int,
    exp_points int,
    damage int,
    enemies_defeated int,
    CONSTRAINT PK_hero PRIMARY KEY (hero_id)
);

CREATE TABLE item (
    item_name varchar(14) NOT NULL,
    CONSTRAINT PK_item PRIMARY KEY (item_name)
);

CREATE TABLE hero_item (
    hero_id int, 
    item_name varchar(14),  
    CONSTRAINT PK_hero_item PRIMARY KEY (hero_id, item_name),
    CONSTRAINT FK_hero_item_hero FOREIGN KEY (hero_id) REFERENCES hero (hero_id),
    CONSTRAINT FK_hero_item_item FOREIGN KEY (item_name) REFERENCES item (item_name)
);

COMMIT TRANSACTION;