package com.example.demo.dao;

import com.example.demo.model.Hero;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

@Component
public class JdbcHeroDao implements HeroDao {
    private static final Logger logger = LoggerFactory.getLogger(JdbcHeroDao.class);
    private final JdbcTemplate jdbcTemplate;

    public JdbcHeroDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Hero getHero(int heroId) {
        Hero hero = new Hero();
        String heroSql = "SELECT hero_id, name, level, health_points, magic_points, exp_points, damage, enemies_defeated " +
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

    public Hero addHero(String name) {
        String newHeroSql = "INSERT INTO hero VALUES(DEFAULT, ?, 1, 50, 20, 0, 10, 0) RETURNING hero_id;";
        int heroId = jdbcTemplate.queryForObject(newHeroSql, Integer.class, name);
        Hero newHero = new Hero();
        newHero.setHeroId(heroId);
        newHero.setName(name);
        return newHero;
    }

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

    public Hero checkForLevelUp(int heroId) {
        Hero hero = getHero(heroId);
        
        if (hero.getExpPoints() >= 100) {
            // Calculate the remainder of experience points after leveling up
            int remainder = hero.getExpPoints() - 100;
            
            // Increase the hero's level
            hero.setLevel(hero.getLevel() + 1);
            hero.setExpPoints(remainder);
            hero.setHealthPoints( (hero.getHealthPoints() * 5) / 2 );
            hero.setMagicPoints( hero.getMagicPoints() + 10 );
            hero.setDamage( (int)(Math.round((hero.getDamage() * 3) / 1.8)) );
            // Update the hero in the database
            String updateSql = "UPDATE hero SET level = ?, health_points = ?, magic_points = ?, exp_points = ?, damage = ? WHERE hero_id = ?";
            try {
                int rowsAffected = jdbcTemplate.update(updateSql, hero.getLevel(), hero.getHealthPoints(), hero.getMagicPoints(), hero.getExpPoints(), hero.getDamage(), heroId);
                if (rowsAffected > 0) {
                    return getHero(heroId);  // Return the updated hero
                } else {
                    throw new RuntimeException("Hero not found or update failed");
                }
            } catch (Exception e) {
                logger.error("Error updating hero level for ID {}: {}", heroId, e.getMessage());
                throw new RuntimeException("Error updating hero level", e);
            }
        }
        return hero;  // No level up needed, return the current hero
    }
}
