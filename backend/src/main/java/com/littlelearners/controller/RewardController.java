package com.littlelearners.controller;

import com.littlelearners.model.Badge;
import com.littlelearners.model.LeaderboardEntry;
import com.littlelearners.service.LearnerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RewardController {
    private final LearnerService learnerService;

    public RewardController(LearnerService learnerService) {
        this.learnerService = learnerService;
    }

    @GetMapping("/rewards")
    public ResponseEntity<List<Badge>> getRewards() {
        return ResponseEntity.ok(learnerService.getAllBadges());
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardEntry>> getLeaderboard() {
        return ResponseEntity.ok(learnerService.getLeaderboard());
    }

    @PostMapping("/rewards/award-stars")
    public ResponseEntity<Void> awardStars(@RequestParam int stars, @RequestParam String activity) {
        learnerService.addStars(stars, activity);
        return ResponseEntity.ok().build();
    }
}
