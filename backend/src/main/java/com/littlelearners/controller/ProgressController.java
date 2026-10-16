package com.littlelearners.controller;

import com.littlelearners.model.Challenge;
import com.littlelearners.model.LearnerProfile;
import com.littlelearners.service.ChallengeQueueService;
import com.littlelearners.service.CurriculumService;
import com.littlelearners.service.LearnerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ProgressController {
    private final LearnerService learnerService;
    private final CurriculumService curriculumService;
    private final ChallengeQueueService challengeQueueService;

    public ProgressController(LearnerService learnerService,
                              CurriculumService curriculumService,
                              ChallengeQueueService challengeQueueService) {
        this.learnerService = learnerService;
        this.curriculumService = curriculumService;
        this.challengeQueueService = challengeQueueService;
    }

    @GetMapping("/progress")
    public ResponseEntity<LearnerProfile> getProgress() {
        return ResponseEntity.ok(learnerService.getProfile());
    }

    @PostMapping("/progress/complete-lesson")
    public ResponseEntity<LearnerProfile> completeLesson(@RequestParam String lessonId) {
        curriculumService.markLessonCompleted(lessonId);
        learnerService.completeLesson(lessonId);
        return ResponseEntity.ok(learnerService.getProfile());
    }

    @GetMapping("/challenges/daily")
    public ResponseEntity<Challenge> getCurrentDailyChallenge() {
        return ResponseEntity.ok(challengeQueueService.peekCurrentChallenge());
    }

    @PostMapping("/challenges/complete")
    public ResponseEntity<Challenge> completeDailyChallenge() {
        Challenge completed = challengeQueueService.completeCurrentChallenge();
        learnerService.addStars(completed.getStarReward(), "Completed Daily Quest: " + completed.getTitle());
        return ResponseEntity.ok(completed);
    }

    @GetMapping("/challenges/all")
    public ResponseEntity<List<Challenge>> getAllChallengesInQueue() {
        return ResponseEntity.ok(challengeQueueService.getAllQueuedChallenges());
    }

    @GetMapping("/progress/history")
    public ResponseEntity<List<String>> getActivityHistory() {
        return ResponseEntity.ok(learnerService.getRecentActivityHistory());
    }
}
