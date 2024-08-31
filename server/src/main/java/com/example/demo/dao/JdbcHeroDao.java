package com.example.demo.dao;

import com.example.demo.model.Hero;
import com.example.demo.model.Score;
import com.example.demo.model.Item;

import java.util.List;
import java.util.ArrayList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

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
        // String heroSql = "SELECT hero.hero_id, hero.name, hero.level,
        // hero.health_points, hero.magic_points, hero.exp_points, hero.damage,
        // hero.enemies_defeated, item.item_name "
        // + "FROM hero "
        // + "JOIN hero_item ON hero.hero_id = hero_item.hero_id "
        // + "JOIN item ON hero_item.item_name = item.item_name "
        // + "WHERE hero.hero_id = ?;";
        String heroSql = "SELECT hero_id, name, level, health_points, magic_points, exp_points, damage, enemies_defeated "
                + "FROM hero "
                + "WHERE hero.hero_id = ?;";
        try {
            // Use query to handle multiple rows and build the Hero object
            return jdbcTemplate.query(heroSql, (rs) -> {
                Hero hero = null;
                

                while (rs.next()) {
                    if (hero == null) {
                        hero = new Hero();
                        hero.setHeroId(rs.getInt("hero_id"));
                        hero.setName(rs.getString("name"));
                        hero.setLevel(rs.getInt("level"));
                        hero.setHealthPoints(rs.getInt("health_points"));
                        hero.setMagicPoints(rs.getInt("magic_points"));
                        hero.setExpPoints(rs.getInt("exp_points"));
                        hero.setDamage(rs.getInt("damage"));
                        hero.setEnemiesDefeated(rs.getInt("enemies_defeated"));
                        List<Item>inventory = getItems(rs.getInt("hero_id"));
                        hero.setInventory(inventory);
                    }
                }
                return hero;
            }, heroId);
        } catch (EmptyResultDataAccessException e) {
            // Handle case when no result is found
            logger.info("No hero found with ID {}", heroId);
            return null;
        } catch (DataAccessException e) {
            // Handle other data access exceptions
            logger.error("Error retrieving hero with ID {}: {}", heroId, e.getMessage());
            return null;
        }
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
    public void addItem(int heroId, String item) {
        // Remove surrounding quotes if they exist
        if (item != null && item.startsWith("\"") && item.endsWith("\"")) {
            item = item.substring(1, item.length() - 1);
        }

        // Check if item exists in the item table
        String checkItemSql = "SELECT COUNT(*) FROM item WHERE item_name = ?";
        Integer count = jdbcTemplate.queryForObject(checkItemSql, Integer.class, item);

        if (count == null || count == 0) {
            // Handle item not found
            throw new IllegalArgumentException("Item does not exist in the item table");
        }

        // Check if hero exists in hero table
        String checkHeroSql = "SELECT COUNT(*) FROM hero WHERE hero_id = ?";
        Integer heroCount = jdbcTemplate.queryForObject(checkHeroSql, Integer.class, heroId);

        if (heroCount == null || heroCount == 0) {
            // Handle hero not found
            throw new IllegalArgumentException("Hero with ID " + heroId + " does not exist");
        }

        // Insert item into hero_item table
        String addItemSql = "INSERT INTO hero_item (hero_id, item_name) VALUES (?, ?)";
        try {
            jdbcTemplate.update(addItemSql, heroId, item);
        } catch (DataIntegrityViolationException e) {
            // Handle data integrity violations
            throw new RuntimeException("Data integrity violation: " + e.getMessage(), e);
        } catch (Exception e) {
            // Handle other exceptions
            throw new RuntimeException("An error occurred: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Item> getItems(int heroId) {
        List<Item> foundItems = new ArrayList<>();
        // SQL query to fetch item details based on heroId and itemName
        String query = "SELECT item.item_name " +
                "FROM item " +
                "JOIN hero_item ON item.item_name = hero_item.item_name " +
                "JOIN hero ON hero_item.hero_id = hero.hero_id " +
                "WHERE hero.hero_id = ?;";

        // Execute the query and obtain the result set
        SqlRowSet results = jdbcTemplate.queryForRowSet(query, heroId);

        // Check if the result set contains any rows
        while (results.next()) {
            // Extract data from the result set
            String name = results.getString("item_name");

            // Create and return an Item object with all necessary details
            Item foundItem = new Item();
            foundItem.setName(name);
            foundItems.add(foundItem);

        }
        return foundItems;
    }

    @Override
    public Hero useItem(int heroId, String item) {
        // Remove surrounding quotes if they exist
        item = (item != null && item.startsWith("\"") && item.endsWith("\""))
                ? item.substring(1, item.length() - 1)
                : item;

        // SQL to delete the item from the hero's inventory
        String useItemSql = "DELETE FROM hero_item WHERE hero_id = ? AND item_name = ?;";

        try {
            // Execute the delete operation
            int rowsAffected = jdbcTemplate.update(useItemSql, heroId, item);

            if (rowsAffected == 0) {
                // No rows were affected, meaning the item wasn't found for the specified hero
                logger.info("Item '{}' not found for hero with ID {}", item, heroId);
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found for the specified hero");
            }

            // Apply item-specific effects
            applyItemEffects(heroId, item);

            // Retrieve and return the updated hero
            return getHero(heroId);
        } catch (DataAccessException e) {
            // Handle data access exceptions
            logger.error("Error while using item '{}' for hero with ID {}: {}", item, heroId, e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error processing request", e);
        }
    }

    private void applyItemEffects(int heroId, String item) {
        switch (item) {
            case "Food":
                String foodSql = "UPDATE hero SET health_points = health_points + 30 WHERE hero_id = ?;";
                int rowsAffectedFood = jdbcTemplate.update(foodSql, heroId);

                if (rowsAffectedFood == 0) {
                    // No rows were affected, which means the hero wasn't updated
                    logger.info("Hero could not eat; hero with ID {}", heroId);
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Could not apply food effects for the specified hero");
                }
                break;

            case "Potion":
                String potionSql = "UPDATE hero SET magic_points = magic_points + 10 WHERE hero_id = ?;";
                int rowsAffectedPotion = jdbcTemplate.update(potionSql, heroId);

                if (rowsAffectedPotion == 0) {
                    // No rows were affected, which means the hero wasn't updated
                    logger.info("Hero could not drink; hero with ID {}", heroId);
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Could not apply potion effects for the specified hero");
                }
                break;

            default:
                logger.warn("Unsupported item type '{}'", item);
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported item type");
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
