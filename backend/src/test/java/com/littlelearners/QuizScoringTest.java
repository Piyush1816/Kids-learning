package com.littlelearners;

import com.littlelearners.model.QuizResult;
import com.littlelearners.model.QuizSubmission;
import com.littlelearners.service.QuizService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class QuizScoringTest {
    private QuizService quizService;

    @BeforeEach
    public void setup() {
        quizService = new QuizService();
        quizService.init();
    }

    @Test
    public void testQuizScoringFullAccuracy() {
        Map<String, Integer> answers = new HashMap<>();
        answers.put("q-alpha-1", 0); // Apple -> A (correct)
        answers.put("q-alpha-2", 1); // Cat -> Cat (correct)
        answers.put("q-alpha-3", 2); // D -> E (correct)

        QuizSubmission sub = new QuizSubmission("alphabets", "Easy", answers);
        QuizResult res = quizService.evaluateSubmission(sub);

        assertEquals(3, res.getTotalQuestions());
        assertEquals(3, res.getCorrectAnswers());
        assertEquals(100.0, res.getScorePercentage());
        assertEquals(5, res.getStarsEarned());
        assertTrue(res.getFeedbackMessage().contains("Superstar"));
    }

    @Test
    public void testQuizScoringPartialAccuracy() {
        Map<String, Integer> answers = new HashMap<>();
        answers.put("q-alpha-1", 0); // Correct
        answers.put("q-alpha-2", 0); // Incorrect (selected Dog instead of Cat)

        QuizSubmission sub = new QuizSubmission("alphabets", "Easy", answers);
        QuizResult res = quizService.evaluateSubmission(sub);

        assertEquals(2, res.getTotalQuestions());
        assertEquals(1, res.getCorrectAnswers());
        assertEquals(50.0, res.getScorePercentage());
        assertTrue(res.getStarsEarned() > 0);
    }
}
