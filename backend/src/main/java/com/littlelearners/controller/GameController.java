package com.littlelearners.controller;

import com.littlelearners.service.LearnerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "*")
public class GameController {
    private final LearnerService learnerService;
    private final Map<String, Integer> gameHighScores = new HashMap<>();

    public GameController(LearnerService learnerService) {
        this.learnerService = learnerService;
        gameHighScores.put("animal-match", 120);
        gameHighScores.put("memory-cards", 85);
        gameHighScores.put("silhouette-guess", 150);
        gameHighScores.put("category-sort", 95);
        gameHighScores.put("counting-safari", 110);
        gameHighScores.put("color-shape-blitz", 130);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getGames() {
        List<Map<String, Object>> games = new ArrayList<>();

        games.add(createGameInfo("animal-match", "Animal Sound & Picture Match", "Match wild animal sounds and names to their lovely portraits!", "🦁", "#FFB7B2", "Easy"));
        games.add(createGameInfo("memory-cards", "Memory Matrix Adventure", "Flip colorful cards and test your visual memory pairs!", "🃏", "#70C1B3", "Medium"));
        games.add(createGameInfo("silhouette-guess", "Mystery Shadow Guesser", "Uncover mysterious clues and identify the hidden creature!", "🔍", "#FFE45E", "Medium"));
        games.add(createGameInfo("category-sort", "Healthy Basket Sorter", "Organize delicious foods, vehicles, and items into happy baskets!", "🧺", "#B8E986", "Easy"));
        games.add(createGameInfo("counting-safari", "Counting Safari Quest", "Spot animated creatures in the savannah and count how many you see!", "🧮", "#4D96FF", "Easy"));
        games.add(createGameInfo("color-shape-blitz", "Color & Shape Lightning Blitz", "Quick reflex challenge! Tap matching shapes and colors before time ticks out!", "⚡", "#9B5DE5", "Challenge"));

        return ResponseEntity.ok(games);
    }

    @PostMapping("/{gameId}/score")
    public ResponseEntity<Map<String, Object>> submitGameScore(@PathVariable String gameId, @RequestParam int score) {
        int currentBest = gameHighScores.getOrDefault(gameId, 0);
        boolean isNewRecord = score > currentBest;
        if (isNewRecord) {
            gameHighScores.put(gameId, score);
        }

        int starsEarned = Math.max(1, Math.min(5, score / 30));
        learnerService.addStars(starsEarned, "Played Game " + gameId + " (Score: " + score + ")");

        Map<String, Object> resp = new HashMap<>();
        resp.put("gameId", gameId);
        resp.put("score", score);
        resp.put("highScore", Math.max(score, currentBest));
        resp.put("isNewRecord", isNewRecord);
        resp.put("starsEarned", starsEarned);
        return ResponseEntity.ok(resp);
    }

    private Map<String, Object> createGameInfo(String id, String title, String desc, String icon, String color, String difficulty) {
        Map<String, Object> g = new HashMap<>();
        g.put("id", id);
        g.put("title", title);
        g.put("description", desc);
        g.put("icon", icon);
        g.put("color", color);
        g.put("difficulty", difficulty);
        g.put("highScore", gameHighScores.getOrDefault(id, 0));
        return g;
    }
}
