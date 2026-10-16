package com.littlelearners.model;

import java.util.List;

public class QuizResult {
    public static class QuestionReview {
        private String questionId;
        private String questionText;
        private int selectedIndex;
        private int correctIndex;
        private boolean isCorrect;
        private String explanation;

        public QuestionReview() {}

        public QuestionReview(String questionId, String questionText, int selectedIndex, int correctIndex, boolean isCorrect, String explanation) {
            this.questionId = questionId;
            this.questionText = questionText;
            this.selectedIndex = selectedIndex;
            this.correctIndex = correctIndex;
            this.isCorrect = isCorrect;
            this.explanation = explanation;
        }

        public String getQuestionId() { return questionId; }
        public String getQuestionText() { return questionText; }
        public int getSelectedIndex() { return selectedIndex; }
        public int getCorrectIndex() { return correctIndex; }
        public boolean isCorrect() { return isCorrect; }
        public String getExplanation() { return explanation; }
    }

    private int totalQuestions;
    private int correctAnswers;
    private double scorePercentage;
    private int starsEarned;
    private String feedbackMessage;
    private List<QuestionReview> reviews;

    public QuizResult() {}

    public QuizResult(int totalQuestions, int correctAnswers, double scorePercentage, int starsEarned, String feedbackMessage, List<QuestionReview> reviews) {
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.scorePercentage = scorePercentage;
        this.starsEarned = starsEarned;
        this.feedbackMessage = feedbackMessage;
        this.reviews = reviews;
    }

    public int getTotalQuestions() { return totalQuestions; }
    public int getCorrectAnswers() { return correctAnswers; }
    public double getScorePercentage() { return scorePercentage; }
    public int getStarsEarned() { return starsEarned; }
    public String getFeedbackMessage() { return feedbackMessage; }
    public List<QuestionReview> getReviews() { return reviews; }
}
