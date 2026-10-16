package com.littlelearners.service;

import com.littlelearners.dsa.ChallengeQueue;
import com.littlelearners.model.Challenge;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.List;

@Service
public class ChallengeQueueService {
    // Custom FIFO Queue holding the sequential daily quests
    private final ChallengeQueue<Challenge> dailyQuestQueue = new ChallengeQueue<>();

    @PostConstruct
    public void init() {
        seedQuests();
    }

    private void seedQuests() {
        dailyQuestQueue.enqueue(new Challenge("quest-1", "Learn Letter A & B", "Explore the first two letters of Alphabet Safari", "alphabets", 3, false));
        dailyQuestQueue.enqueue(new Challenge("quest-2", "Count to 5 with Lumi", "Count five smiling apples on the abacus", "numbers", 3, false));
        dailyQuestQueue.enqueue(new Challenge("quest-3", "Mix a Rainbow Color", "Combine Yellow and Blue to create Green", "colors", 3, false));
        dailyQuestQueue.enqueue(new Challenge("quest-4", "Shape Detective", "Find 3 triangles in the shape playground", "shapes", 4, false));
        dailyQuestQueue.enqueue(new Challenge("quest-5", "Roar with the Lion", "Listen to animal sounds and discover jungle habitats", "animals", 5, false));
    }

    public Challenge peekCurrentChallenge() {
        if (dailyQuestQueue.isEmpty()) {
            seedQuests();
        }
        return dailyQuestQueue.peek(); // O(1) peek
    }

    public Challenge completeCurrentChallenge() {
        if (dailyQuestQueue.isEmpty()) {
            seedQuests();
        }
        Challenge completed = dailyQuestQueue.dequeue(); // O(1) dequeue
        completed.setCompleted(true);
        // Circular re-enqueue for infinite daily fun
        dailyQuestQueue.enqueue(new Challenge(
            "quest-" + System.currentTimeMillis(),
            "Bonus Quest: " + completed.getTitle(),
            completed.getDescription(),
            completed.getCategoryId(),
            completed.getStarReward() + 1,
            false
        ));
        return completed;
    }

    public List<Challenge> getAllQueuedChallenges() {
        return dailyQuestQueue.toList();
    }

    public int getQueueSize() {
        return dailyQuestQueue.size();
    }
}
