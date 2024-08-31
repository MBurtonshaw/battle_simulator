package com.example.demo.controller;

import com.example.demo.model.Hero;
import com.example.demo.model.Score;
import com.example.demo.model.Item;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.example.demo.dao.HeroDao;
import java.util.List;

@RestController
@CrossOrigin
public class GameController {
    private final HeroDao heroDao;

    public GameController(HeroDao heroDao) {
        this.heroDao = heroDao;
    }

    //////////////////////////////////////////////////////////////////////////////////
    @RequestMapping(path = "api/hero/{heroId}", method = RequestMethod.GET)
    public Hero getHero(@PathVariable int heroId) {
        try {
            return heroDao.getHero(heroId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Hero not found", e);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////
    @RequestMapping(path = "api/hero/{heroId}/level", method = RequestMethod.POST)
    public Hero checkForLevelUp(@PathVariable int heroId) {
        try {
            return heroDao.checkForLevelUp(heroId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Hero not found", e);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////
    @RequestMapping(path = "api/hero", method = RequestMethod.POST)
    public Hero addHero(@RequestBody String name) {
        // Remove surrounding quotes if they exist
        if (name != null && name.startsWith("\"") && name.endsWith("\"")) {
            name = name.substring(1, name.length() - 1);
        }

        try {
            Hero newHero = heroDao.addHero(name);
            if (newHero == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error creating hero");
            }
            return newHero;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error adding hero", e);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////
    @RequestMapping(path = "api/hero/{heroId}/damage", method = RequestMethod.POST)
    public Hero takeDamage(@PathVariable int heroId, @RequestBody int damage) {
        try {
            return heroDao.takeDamage(damage, heroId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Score not found", e);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////
    @RequestMapping(path = "api/hero/{heroId}/win", method = RequestMethod.POST)
    public Hero defeatEnemy(@PathVariable int heroId, @RequestBody int exp) {
        try {
            return heroDao.defeatEnemy(exp, heroId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Score not found", e);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////
    @RequestMapping(path = "api/hero/{heroId}/freeze", method = RequestMethod.POST)
    public Hero castFreezeSpell(@PathVariable int heroId, @RequestBody int magicPoints) {
        try {
            return heroDao.castFreezeSpell(heroId, magicPoints);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Score not found", e);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////
    @RequestMapping(path = "api/hero/{heroId}/fire", method = RequestMethod.POST)
    public Hero castFireSpell(@PathVariable int heroId, @RequestBody int magicPoints) {
        try {
            return heroDao.castFireSpell(heroId, magicPoints);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Score not found", e);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////
    @RequestMapping(path = "api/hero/{heroId}/addItem", method = RequestMethod.POST)
    public void addItem(@PathVariable int heroId, @RequestBody String item) {
        try {
            heroDao.addItem(heroId, item);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not added", e);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////
    @RequestMapping(path = "api/hero/{heroId}/getItems", method = RequestMethod.GET)
    public List<Item> getItems(@PathVariable int heroId) {
        try {
            return heroDao.getItems(heroId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not added", e);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////
    @RequestMapping(path = "api/hero/{heroId}/useItem", method = RequestMethod.POST)
    public Hero useItem(@PathVariable int heroId, @RequestBody String item) {
        try {
            return heroDao.useItem(heroId, item);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not used", e);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////
    @RequestMapping(path = "api/score/high", method = RequestMethod.GET)
    public List<Score> getHighScores() {
        try {
            return heroDao.getHighScores();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error retrieving high scores", e);
        }
    }

}