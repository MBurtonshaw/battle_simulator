package com.example.demo.model;

public class Score {
    private int score_id;
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


    public String toString() {
        return "Hero " + getScore_id() + " has a score of " + getScore()+ "\n";
    }
}
