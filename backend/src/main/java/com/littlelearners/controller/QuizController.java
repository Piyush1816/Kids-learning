package com.littlelearners.controller;

import com.littlelearners.model.QuizQuestion;
import com.littlelearners.model.QuizResult;
import com.littlelearners.model.QuizSubmission;
import com.littlelearners.service.LearnerService;
import com.littlelearners.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "*")
public class QuizController {
    private final QuizService quizService;
    private final LearnerService learnerService;

    public QuizController(QuizService quizService, LearnerService learnerService) {
        this.quizService = quizService;
        this.learnerService = learnerService;
    }

    @GetMapping
    public ResponseEntity<List<QuizQuestion>> getQuestions(
            @RequestParam(required = false, defaultValue = "all") String category,
            @RequestParam(required = false, defaultValue = "all") String difficulty) {
        return ResponseEntity.ok(quizService.getQuestionsByCategory(category, difficulty));
    }

    @GetMapping("/{category}")
    public ResponseEntity<List<QuizQuestion>> getQuestionsByCategory(
            @PathVariable String category,
            @RequestParam(required = false, defaultValue = "all") String difficulty) {
        return ResponseEntity.ok(quizService.getQuestionsByCategory(category, difficulty));
    }

    @PostMapping("/submit")
    public ResponseEntity<QuizResult> submitQuiz(@RequestBody QuizSubmission submission) {
        QuizResult result = quizService.evaluateSubmission(submission);
        if (result.getStarsEarned() > 0) {
            learnerService.addStars(result.getStarsEarned(), "Completed Quiz (" + submission.getDifficulty() + ")");
        }
        return ResponseEntity.ok(result);
    }
}
