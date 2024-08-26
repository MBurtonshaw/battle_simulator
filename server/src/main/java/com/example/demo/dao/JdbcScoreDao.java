package com.example.demo.dao;

import com.example.demo.model.Hero;
import com.example.demo.model.Score;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class JdbcScoreDao implements ScoreDao {
    private static final Logger logger = LoggerFactory.getLogger(JdbcHeroDao.class);
    private final JdbcTemplate jdbcTemplate;

    public JdbcScoreDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Score> getScores() {
        List<Score> scores = new ArrayList<>();

        String scoresSql = "SELECT score_id, score FROM score";

        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(scoresSql);

            while (results.next()) {
                Score newScore = new Score();
                newScore.setScore_id(results.getInt("score_id"));
                newScore.setScore(results.getInt("score"));
                scores.add(newScore);
            }
        } catch (Exception e) {
            logger.error("Error retrieving scores {}", e.getMessage());
        }

        return scores;
    }

    public Score getScoreByHero(int heroId) {
        String scoreSql = "SELECT score.score_id, score.score FROM score " +
                        "JOIN hero_score on score.score_id = hero_score.score_id " +
                        "WHERE hero_id = ?;";
        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(scoreSql, heroId);
            if (results.next()) {
                Score score = new Score();
                score.setScore_id(results.getInt("score_id"));
                score.setScore(results.getInt("score"));
                return score;
            } else {
                logger.warn("No score found for hero with ID {}", heroId);
                return null; // or handle this case appropriately
            }
        } catch(Exception e) {
            logger.error("Error retrieving hero score with ID {}: {}", heroId, e.getMessage());
            return null;
        }

    }

}
