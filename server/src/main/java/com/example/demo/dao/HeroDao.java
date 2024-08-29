package com.example.demo.dao;

import com.example.demo.model.Hero;

public interface HeroDao {
    Hero getHero(int id); // Method signature
    Hero addHero(String name);
    Hero takeDamage(int damage, int heroId);
    Hero defeatEnemy(int exp, int heroId);
    Hero checkForLevelUp(int heroId);
}