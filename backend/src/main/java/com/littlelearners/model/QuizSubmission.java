package com.littlelearners.model;

import java.util.List;
import java.util.Map;

public class QuizSubmission {
    private String categoryId;
    private String difficulty;
    private Map<String, Integer> answers; // questionId -> selectedOptionIndex

    public QuizSubmission() {}

    public QuizSubmission(String categoryId, String difficulty, Map<String, Integer> answers) {
        this.categoryId = categoryId;
        this.difficulty = difficulty;
        this.answers = answers;
    }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Map<String, Integer> getAnswers() { return answers; }
    public void setAnswers(Map<String, Integer> answers) { this.answers = answers; }
}
