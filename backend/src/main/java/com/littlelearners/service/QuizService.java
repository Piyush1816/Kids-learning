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

        // Fruits & Veggies Questions
        addQ(new QuizQuestion("q-fv-1", "fruits-veggies", "Easy", "Which crunchy orange vegetable is famous for supporting bright healthy eyesight?", "🥕", Arrays.asList("Carrot", "Potato", "Cucumber", "Onion"), 0, "Carrots are rich in Vitamin A, which helps our eyes see clearly!"));
        addQ(new QuizQuestion("q-fv-2", "fruits-veggies", "Medium", "Which delicious red fruit wears about 200 tiny seeds right on the outside?", "🍓", Arrays.asList("Apple", "Watermelon", "Strawberry", "Grape"), 2, "Strawberries are unique because their tiny seeds sit on the outside skin!"));
        addQ(new QuizQuestion("q-fv-3", "fruits-veggies", "Challenge", "Why are botanical tomatoes classified as fruits instead of vegetables?", "🍅", Arrays.asList("They are red", "They grow from flowers and contain seeds", "They are sweet", "They grow underground"), 1, "Scientifically, anything that develops from a flower and contains seeds is a fruit!"));

        // Vehicles Questions
        addQ(new QuizQuestion("q-veh-1", "vehicles", "Easy", "Which amazing vehicle blasts off past Earth clouds into outer space?", "🚀", Arrays.asList("Bicycle", "Rocket", "Submarine", "Bus"), 1, "Rockets use powerful engines to escape Earth gravity and explore the stars!"));
        addQ(new QuizQuestion("q-veh-2", "vehicles", "Medium", "Which water vessel uses large cloth sails and ocean breezes to travel?", "⛵", Arrays.asList("Submarine", "Sailboat", "Helicopter", "Rocket"), 1, "Sailboats catch the natural power of the wind in their sails to glide across water!"));
        addQ(new QuizQuestion("q-veh-3", "vehicles", "Challenge", "What special power allows modern Maglev bullet trains to travel super fast and smooth?", "🚆", Arrays.asList("Rocket wings", "Magnetic levitation (floating above tracks)", "Jet engines", "Extra large wheels"), 1, "Maglev trains use powerful magnets to float above tracks, eliminating wheel friction!"));

        // Body Parts Questions
        addQ(new QuizQuestion("q-bod-1", "body-parts", "Easy", "Which body part beats all day and night to pump blood and oxygen through you?", "❤️", Arrays.asList("Heart", "Brain", "Knee", "Elbow"), 0, "Your heart beats around 100,000 times every single day to keep you energetic and healthy!"));
        addQ(new QuizQuestion("q-bod-2", "body-parts", "Medium", "Which part of our body contains 86 billion neurons and does all our thinking and dreaming?", "🧠", Arrays.asList("Stomach", "Brain", "Lungs", "Hands"), 1, "The human brain is our body control center for thinking, feeling, and learning!"));
        addQ(new QuizQuestion("q-bod-3", "body-parts", "Challenge", "What is the hardest and strongest substance in the entire human body?", "🦷", Arrays.asList("Finger bone", "Tooth enamel", "Skull", "Kneecap"), 1, "Tooth enamel is even stronger than human bone, protecting teeth while chewing!"));
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
