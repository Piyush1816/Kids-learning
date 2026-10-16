package com.littlelearners.service;

import com.littlelearners.dsa.CustomArrayList;
import com.littlelearners.dsa.CustomHashMap;
import com.littlelearners.model.QuizQuestion;
import com.littlelearners.model.QuizResult;
import com.littlelearners.model.QuizSubmission;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class QuizService {
    private final CustomArrayList<QuizQuestion> questionList = new CustomArrayList<>();
    private final CustomHashMap<String, QuizQuestion> questionMap = new CustomHashMap<>();

    @PostConstruct
    public void init() {
        seedQuestions();
    }

    private void seedQuestions() {
        // Alphabets Questions
        addQ(new QuizQuestion("q-alpha-1", "alphabets", "Easy", "What letter does the word 'Apple' start with?", "🍎", Arrays.asList("A", "B", "C", "D"), 0, "Apple begins with the letter A!"));
        addQ(new QuizQuestion("q-alpha-2", "alphabets", "Easy", "Which cute pet begins with the letter 'C'?", "🐱", Arrays.asList("Dog", "Cat", "Bird", "Fish"), 1, "Cat begins with the letter C (k-k-cat)!"));
        addQ(new QuizQuestion("q-alpha-3", "alphabets", "Medium", "What letter comes immediately after 'D' in the alphabet song?", "🎵", Arrays.asList("C", "F", "E", "G"), 2, "A, B, C, D, E! 'E' comes right after 'D'."));

        // Numbers Questions
        addQ(new QuizQuestion("q-num-1", "numbers", "Easy", "How many suns shine in our daytime sky?", "☀️", Arrays.asList("1", "2", "3", "0"), 0, "There is 1 brilliant sun in our sky!"));
        addQ(new QuizQuestion("q-num-2", "numbers", "Easy", "If you hold up both hands, how many fingers are there in total?", "🖐️🖐️", Arrays.asList("5", "8", "10", "12"), 2, "5 + 5 = 10 cheerful fingers!"));
        addQ(new QuizQuestion("q-num-3", "numbers", "Challenge", "Count the pattern: 2, 4, 6, 8, ... What number comes next?", "🔢", Arrays.asList("9", "10", "11", "12"), 1, "Skip counting by 2: 2, 4, 6, 8, 10!"));

        // Colors Questions
        addQ(new QuizQuestion("q-col-1", "colors", "Easy", "What color is a ripe sweet strawberry?", "🍓", Arrays.asList("Blue", "Green", "Red", "Yellow"), 2, "Strawberries turn radiant red when sweet and ripe!"));
        addQ(new QuizQuestion("q-col-2", "colors", "Medium", "What magic color do you get when you mix Yellow and Blue paint together?", "🎨", Arrays.asList("Purple", "Green", "Orange", "Brown"), 1, "Yellow + Blue creates fresh vibrant Green!"));

        // Shapes Questions
        addQ(new QuizQuestion("q-shp-1", "shapes", "Easy", "Which shape is perfectly round with zero corners?", "⭕", Arrays.asList("Square", "Triangle", "Circle", "Star"), 2, "A circle is round all around with no sharp corners!"));
        addQ(new QuizQuestion("q-shp-2", "shapes", "Medium", "How many equal sides does a square have?", "⬛", Arrays.asList("3", "4", "5", "6"), 1, "A square has 4 sides that are all the exact same length!"));

        // Animals Questions
        addQ(new QuizQuestion("q-ani-1", "animals", "Easy", "Which animal is famous as the 'King of the Jungle'?", "🦁", Arrays.asList("Lion", "Zebra", "Monkey", "Giraffe"), 0, "The majestic lion is celebrated as the King of the Jungle!"));
        addQ(new QuizQuestion("q-ani-2", "animals", "Medium", "Which friendly sea mammal loves jumping high over ocean waves?", "🌊", Arrays.asList("Shark", "Dolphin", "Crab", "Octopus"), 1, "Dolphins are playful and leap gracefully through waves!"));
    }

    private void addQ(QuizQuestion q) {
        questionList.add(q);
        questionMap.put(q.getId(), q);
    }

    public List<QuizQuestion> getQuestionsByCategory(String categoryId, String difficulty) {
        List<QuizQuestion> matching = new ArrayList<>();
        for (QuizQuestion q : questionList) {
            boolean catMatch = categoryId == null || categoryId.equalsIgnoreCase("all") || q.getCategoryId().equalsIgnoreCase(categoryId);
            boolean diffMatch = difficulty == null || difficulty.equalsIgnoreCase("all") || q.getDifficulty().equalsIgnoreCase(difficulty);
            if (catMatch && diffMatch) {
                matching.add(q);
            }
        }
        // Shuffle to ensure randomized quiz adventures
        Collections.shuffle(matching);
        return matching;
    }

    public QuizResult evaluateSubmission(QuizSubmission submission) {
        Map<String, Integer> answers = submission.getAnswers();
        List<QuizResult.QuestionReview> reviews = new ArrayList<>();
        int correctCount = 0;
        int total = answers != null ? answers.size() : 0;

        if (answers != null) {
            for (Map.Entry<String, Integer> entry : answers.entrySet()) {
                String questionId = entry.getKey();
                int selectedIdx = entry.getValue();
                QuizQuestion question = questionMap.get(questionId); // O(1) hash map lookup

                if (question != null) {
                    boolean isCorrect = selectedIdx == question.getCorrectAnswerIndex();
                    if (isCorrect) correctCount++;
                    reviews.add(new QuizResult.QuestionReview(
                        questionId,
                        question.getQuestionText(),
                        selectedIdx,
                        question.getCorrectAnswerIndex(),
                        isCorrect,
                        question.getExplanation()
                    ));
                }
            }
        }

        double scorePct = total > 0 ? ((double) correctCount / total) * 100.0 : 0.0;
        int starsEarned = (int) Math.round((scorePct / 100.0) * 5.0); // Up to 5 stars per quiz

        String feedback;
        if (scorePct >= 90) {
            feedback = "Superstar! Lumi is doing a happy celebration dance!";
        } else if (scorePct >= 70) {
            feedback = "Fantastic effort! You are getting smarter every single day!";
        } else {
            feedback = "Good try, little explorer! Let's practice once more together!";
        }

        return new QuizResult(total, correctCount, Math.round(scorePct * 10.0) / 10.0, starsEarned, feedback, reviews);
    }
}
