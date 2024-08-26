package com.example.demo.dao;

import com.example.demo.model.Hero;

public interface HeroDao {
    Hero getHero(int id); // Method signature
    Hero addHero(String name);
    // Add other methods if necessary
}