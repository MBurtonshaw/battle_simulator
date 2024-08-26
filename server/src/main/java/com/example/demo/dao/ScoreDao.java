package com.example.demo.dao;

import com.example.demo.model.Hero;
import com.example.demo.model.Score;

import java.util.List;

public interface ScoreDao {
    List<Score> getScores();
    Score getScoreByHero(int heroId); // Method signature
    // Add other methods if necessary
}