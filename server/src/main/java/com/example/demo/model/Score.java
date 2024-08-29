package com.example.demo.model;

public class Score {
    private int score_id;
    private String heroName;
    private int heroLevel;
    private int score;

    public int getScore_id() {
        return score_id;
    }

    public void setScore_id(int score_id) {
        this.score_id = score_id;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getHeroName() {
        return heroName;
    }

    public void setHeroName(String heroName) {
        this.heroName = heroName;
    }

    public int getHeroLevel() {
        return heroLevel;
    }

    public void setHeroLevel(int herolevel) {
        this.heroLevel = herolevel;
    }

    @Override
    public String toString() {
        return "Hero " + getHeroName() + ", level " + getHeroLevel() + ", has a score of " + getScore()+ "\n";
    }
}
