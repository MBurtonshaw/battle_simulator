package com.example.demo.dao;

import com.example.demo.model.Hero;
import com.example.demo.model.Score;

import java.util.List;
import java.util.ArrayList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

@Component
public class JdbcHeroDao implements HeroDao {
    private static final Logger logger = LoggerFactory.getLogger(JdbcHeroDao.class);
    
    @Autowired
    private final JdbcTemplate jdbcTemplate;

    public JdbcHeroDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Hero getHero(int heroId) {
        Hero hero = new Hero();
        String heroSql = "SELECT hero_id, name, level, health_points, magic_points, exp_points, damage, enemies_defeated "
                +
                "FROM hero WHERE hero_id = ?;";
        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(heroSql, heroId);
            if (results.next()) {
                hero.setHeroId(results.getInt("hero_id"));
                hero.setName(results.getString("name"));
                hero.setLevel(results.getInt("level"));
                hero.setHealthPoints(results.getInt("health_points"));
                hero.setMagicPoints(results.getInt("magic_points"));
                hero.setExpPoints(results.getInt("exp_points"));
                hero.setDamage(results.getInt("damage"));
                hero.setEnemiesDefeated(results.getInt("enemies_defeated"));
            }
        } catch (Exception e) {
            logger.error("Error retrieving hero with ID {}: {}", heroId, e.getMessage());
        }
        return hero;
    }

    @Override
    public Hero addHero(String name) {
        String newHeroSql = "INSERT INTO hero(hero_id, name, level, health_points, magic_points, exp_points, damage, enemies_defeated) VALUES(DEFAULT, ?, 1, 50, 20, 0, 10, 0) RETURNING hero_id;";
        int heroId = jdbcTemplate.queryForObject(newHeroSql, Integer.class, name);
        Hero newHero = new Hero();
        newHero.setHeroId(heroId);
        newHero.setName(name);
        newHero.setLevel(1);
        newHero.setHealthPoints(50);
        newHero.setMagicPoints(20);
        newHero.setExpPoints(0);
        newHero.setDamage(10);
        newHero.setEnemiesDefeated(0);
        return newHero;
    }

    @Override
    public Hero takeDamage(int damage, int heroId) {
        Hero updatedHero = null;
        String damageSql = "UPDATE hero SET health_points = health_points - ? WHERE hero_id = ?;";
        try {
            int numberOfRows = jdbcTemplate.update(damageSql, damage, heroId);
            if (numberOfRows == 0) {
                throw new Exception("Could not update hero's health");
            } else {
                updatedHero = getHero(heroId);
            }
        } catch (Exception e) {
            logger.error("Error damaging hero with ID {}: {}", heroId, e.getMessage());
        }
        return updatedHero;
    }

    @Override
    public Hero defeatEnemy(int exp, int heroId) {
        String victorySql = "UPDATE hero SET enemies_defeated = enemies_defeated + 1, exp_points = exp_points + ? WHERE hero_id = ?;";
        try {
            int numberOfRows = jdbcTemplate.update(victorySql, exp, heroId);
            if (numberOfRows == 1) {
                return getHero(heroId);
            } else {
                logger.warn("No hero updated for ID {}", heroId);
                throw new RuntimeException("Hero not found or no update performed");
            }
        } catch (Exception e) {
            logger.error("Error claiming victory for hero with ID {}: {}", heroId, e.getMessage());
            throw new RuntimeException("Error claiming victory", e);
        }
    }

    @Override
    public Hero checkForLevelUp(int heroId) {
        Hero hero = getHero(heroId);

        if (hero.getExpPoints() >= 100) {
            // Calculate the remainder of experience points after leveling up
            int remainder = hero.getExpPoints() - 100;

            // Increase the hero's level
            hero.setLevel(hero.getLevel() + 1);
            hero.setExpPoints(remainder);
            hero.setHealthPoints((hero.getHealthPoints() * 5) / 2);
            hero.setMagicPoints(hero.getMagicPoints() + 10);
            hero.setDamage((int) (Math.round((hero.getDamage() * 3) / 1.8)));
            // Update the hero in the database
            String updateSql = "UPDATE hero SET level = ?, health_points = ?, magic_points = ?, exp_points = ?, damage = ? WHERE hero_id = ?";
            try {
                int rowsAffected = jdbcTemplate.update(updateSql, hero.getLevel(), hero.getHealthPoints(),
                        hero.getMagicPoints(), hero.getExpPoints(), hero.getDamage(), heroId);
                if (rowsAffected > 0) {
                    return getHero(heroId); // Return the updated hero
                } else {
                    throw new RuntimeException("Hero not found or update failed");
                }
            } catch (Exception e) {
                logger.error("Error updating hero level for ID {}: {}", heroId, e.getMessage());
                throw new RuntimeException("Error updating hero level", e);
            }
        }
        return hero; // No level up needed, return the current hero
    }

    @Override
    public Hero castFreezeSpell(int heroId, int magicPoints) {
        if (magicPoints <= 0) {
            throw new IllegalArgumentException("Magic points must be positive.");
        }

        // Retrieve the hero
        Hero hero = getHero(heroId);
        if (hero == null) {
            throw new IllegalArgumentException("Hero not found with ID: " + heroId);
        }

        if (hero.getMagicPoints() < magicPoints) {
            throw new IllegalArgumentException("Not enough magic points to cast freeze spell.");
        }

        // Update the hero's magic points in the database
        String freezeSql = "UPDATE hero SET magic_points = magic_points - ? WHERE hero_id = ?;";
        try {
            int rowsAffected = jdbcTemplate.update(freezeSql, magicPoints, heroId);
            if (rowsAffected > 0) {
                // Update in-memory state if the database update is successful
                hero.setMagicPoints(hero.getMagicPoints() - magicPoints);
                return hero;
            } else {
                throw new RuntimeException("Could not cast freeze spell; update error");
            }
        } catch (DataAccessException dae) {
            // Log specific database-related exceptions
            logger.error("Database error casting freeze spell for ID {}: {}", heroId, dae.getMessage());
            throw new RuntimeException("Database error updating hero", dae);
        } catch (Exception e) {
            // Log general exceptions
            logger.error("Error casting freeze spell for ID {}: {}", heroId, e.getMessage());
            throw new RuntimeException("Error updating hero level", e);
        }
    }

    @Override
    public Hero castFireSpell(int heroId, int magicPoints) {
        if (magicPoints <= 0) {
            throw new IllegalArgumentException("Magic points must be positive.");
        }

        // Retrieve the hero
        Hero hero = getHero(heroId);
        if (hero == null) {
            throw new IllegalArgumentException("Hero not found with ID: " + heroId);
        }

        if (hero.getMagicPoints() < magicPoints) {
            throw new IllegalArgumentException("Not enough magic points to cast fire spell.");
        }

        // Update the hero's magic points in the database
        String fireSql = "UPDATE hero SET magic_points = magic_points - ? WHERE hero_id = ?;";
        try {
            int rowsAffected = jdbcTemplate.update(fireSql, magicPoints, heroId);
            if (rowsAffected > 0) {
                // Update in-memory state if the database update is successful
                hero.setMagicPoints(hero.getMagicPoints() - magicPoints);
                return hero;
            } else {
                throw new RuntimeException("Could not cast fire spell; update error");
            }
        } catch (DataAccessException dae) {
            // Log specific database-related exceptions
            logger.error("Database error casting freeze spell for ID {}: {}", heroId, dae.getMessage());
            throw new RuntimeException("Database error updating hero", dae);
        } catch (Exception e) {
            // Log general exceptions
            logger.error("Error casting freeze spell for ID {}: {}", heroId, e.getMessage());
            throw new RuntimeException("Error updating hero level", e);
        }
    }

    @Override
    public List<Score> getHighScores() {
        List<Score> highScores = new ArrayList<>();
        String scoreSql = "SELECT name, level, enemies_defeated FROM hero WHERE enemies_defeated = 10;";
        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(scoreSql);
            while (results.next()) {
                Score newScore = new Score();
                newScore.setScore(results.getInt("enemies_defeated"));
                newScore.setHeroName(results.getString("name"));
                newScore.setHeroLevel(results.getInt("level"));
                highScores.add(newScore);
            }
        } catch (Exception e) {
            logger.error("Error retrieving high scores: {}", e.getMessage());
            throw new RuntimeException("Error retrieving high scores", e);
        }
        return highScores;
    }
}
