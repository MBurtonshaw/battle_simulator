package com.example.demo.model;

import java.util.ArrayList;
import java.util.List;

public class Hero {
    private int heroId;
    private String name;
    private int level;
    private int healthPoints;
    private int magicPoints;
    private int expPoints;
    private int damage;
    private int enemiesDefeated;
    private List<Item> inventory;

    public Hero() {}

    public Hero(int heroId, String name, int level, int healthPoints, int magicPoints, int expPoints, int damage, int enemiesDefeated, List<Item> inventory) {
        this.heroId = heroId;
        this.name = name;
        this.level = level;
        this.healthPoints = healthPoints;
        this.magicPoints = magicPoints;
        this.expPoints = expPoints;
        this.damage = damage;
        this.enemiesDefeated = enemiesDefeated;
        this.inventory = inventory != null ? new ArrayList<>(inventory) : new ArrayList<>();
    }

    public int getHeroId() {
        return heroId;
    }

    public void setHeroId(int heroId) {
        this.heroId = heroId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public int getHealthPoints() {
        return healthPoints;
    }

    public void setHealthPoints(int healthPoints) {
        this.healthPoints = healthPoints;
    }

    public int getMagicPoints() {
        return magicPoints;
    }

    public void setMagicPoints(int magicPoints) {
        this.magicPoints = magicPoints;
    }

    public int getExpPoints() {
        return expPoints;
    }

    public void setExpPoints(int expPoints) {
        this.expPoints = expPoints;
    }

    public int getDamage() {
        return damage;
    }

    public void setDamage(int damage) {
        this.damage = damage;
    }

    public int getEnemiesDefeated() {
        return enemiesDefeated;
    }

    public void setEnemiesDefeated(int enemiesDefeated) {
        this.enemiesDefeated = enemiesDefeated;
    }

    public List<Item> getInventory() {
        return inventory;
    }

    public void setInventory(List<Item> inventory) {
        this.inventory = inventory;
    }

    public String toString() {
        return getName() + " is level " + getLevel() + ". Their health points are " + getHealthPoints() + " and their magic points are " + getMagicPoints() + "." +
                " Their damage is " + getDamage() + " and their score is " + getEnemiesDefeated() + ".";
    }
}
