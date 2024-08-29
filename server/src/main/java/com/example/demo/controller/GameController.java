package com.example.demo.controller;

import com.example.demo.dao.ScoreDao;
import com.example.demo.model.Hero;
import com.example.demo.model.Score;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.example.demo.dao.HeroDao;
import com.example.demo.model.Hero;

import java.util.List;

@RestController
@CrossOrigin
public class GameController {
    private final HeroDao heroDao;
    private final ScoreDao scoreDao;

    public GameController(HeroDao heroDao, ScoreDao scoreDao) {
        this.heroDao = heroDao;
        this.scoreDao = scoreDao;
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
    public Hero addHero(@RequestBody Hero name) {
        try {
            return heroDao.addHero(name.getName());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Hero not found", e);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////
    @RequestMapping(path = "api/hero/{heroId}", method = RequestMethod.POST)
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
    @RequestMapping(path = "api/score/{heroId}", method = RequestMethod.GET)
    public Score getScoreByHero(@PathVariable int heroId) {
        try {
            return scoreDao.getScoreByHero(heroId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Score not found", e);
        }
    }

}