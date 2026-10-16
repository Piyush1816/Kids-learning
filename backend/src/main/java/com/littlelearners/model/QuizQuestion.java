package com.littlelearners.model;

import java.util.List;

public class QuizQuestion {
    private String id;
    private String categoryId;
    private String difficulty; // Easy, Medium, Challenge
    private String questionText;
    private String illustration;
    private List<String> options;
    private int correctAnswerIndex;
    private String explanation;

    public QuizQuestion() {}

    public QuizQuestion(String id, String categoryId, String difficulty, String questionText,
                        String illustration, List<String> options, int correctAnswerIndex, String explanation) {
        this.id = id;
        this.categoryId = categoryId;
        this.difficulty = difficulty;
        this.questionText = questionText;
        this.illustration = illustration;
        this.options = options;
        this.correctAnswerIndex = correctAnswerIndex;
        this.explanation = explanation;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getIllustration() { return illustration; }
    public void setIllustration(String illustration) { this.illustration = illustration; }

    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }

    public int getCorrectAnswerIndex() { return correctAnswerIndex; }
    public void setCorrectAnswerIndex(int correctAnswerIndex) { this.correctAnswerIndex = correctAnswerIndex; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
