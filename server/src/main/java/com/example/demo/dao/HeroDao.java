package com.example.demo.dao;

import com.example.demo.model.Hero;
import com.example.demo.model.Score;
import com.example.demo.model.Item;

import java.util.List;

public interface HeroDao {
    Hero getHero(int id); // Method signature
    Hero addHero(String name);
    Hero takeDamage(int damage, int heroId);
    Hero defeatEnemy(int exp, int heroId);
    Hero checkForLevelUp(int heroId);
    List<Score> getHighScores();
    Hero castFreezeSpell(int heroId, int magicPoints);
    Hero castFireSpell(int heroId, int magicPoints);
    void addItem(int heroId, String item);
    Hero useItem(int heroId, String item);
    List<Item> getItems(int heroId);
}