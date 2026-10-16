package com.littlelearners.service;

import com.littlelearners.dsa.ActivityStack;
import com.littlelearners.dsa.SortingEngine;
import com.littlelearners.model.Badge;
import com.littlelearners.model.LeaderboardEntry;
import com.littlelearners.model.LearnerProfile;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class LearnerService {
    private LearnerProfile currentProfile;
    private final List<Badge> badges = new ArrayList<>();
    // Custom LIFO Stack tracking recent learning activities for history and undo
    private final ActivityStack<String> activityHistoryStack = new ActivityStack<>(50);

    @PostConstruct
    public void init() {
        initProfile();
        initBadges();
    }

    private void initProfile() {
        currentProfile = new LearnerProfile(
            "child-001",
            "Little Explorer",
            "🦊",
            24,   // Initial stars
            3,    // Badges earned
            6,    // Completed lessons
            4,    // 4-day streak
            42,   // 42 minutes spent
            92.5, // 92.5% accuracy
            new ArrayList<>(Arrays.asList("alpha-a", "alpha-b", "num-1", "num-2", "col-red", "shp-circle"))
        );
        activityHistoryStack.push("Explored Letter A with Lumi");
        activityHistoryStack.push("Mastered Counting Numbers 1 & 2");
        activityHistoryStack.push("Solved the Circle Shape riddle");
    }

    private void initBadges() {
        badges.add(new Badge("b-explorer", "Curious Explorer", "Begin your adventure by completing your very first lesson!", "🧭", "Journey", true, 5));
        badges.add(new Badge("b-alphabet", "Alphabet Ace", "Explore letters A to E with phonics and words", "🔤", "Language", true, 10));
        badges.add(new Badge("b-number", "Number Ninja", "Count from 1 to 10 without skipping a beat", "🔢", "Math", true, 15));
        badges.add(new Badge("b-rainbow", "Rainbow Artist", "Mix primary colors to discover magical secondary colors", "🎨", "Art", false, 30));
        badges.add(new Badge("b-shapes", "Shape Master", "Identify all 2D and 3D shapes in real-world objects", "🔷", "Geometry", false, 40));
        badges.add(new Badge("b-safari", "Wild Zoologist", "Discover animal habitats and listen to wild animal calls", "🦁", "Science", false, 50));
        badges.add(new Badge("b-quiz", "Quiz Champion", "Score 100% accuracy on a Challenge level quiz", "🏆", "Challenge", false, 60));
        badges.add(new Badge("b-streak", "Super Streaker", "Learn every single day for 5 days in a row", "🔥", "Dedication", false, 75));
    }

    public LearnerProfile getProfile() {
        return currentProfile;
    }

    public void addStars(int count, String activityName) {
        currentProfile.setTotalStars(currentProfile.getTotalStars() + count);
        activityHistoryStack.push(activityName + " (+" + count + " ⭐)");
        checkBadgeUnlocks();
    }

    public void completeLesson(String lessonId) {
        if (!currentProfile.getCompletedLessonIds().contains(lessonId)) {
            currentProfile.getCompletedLessonIds().add(lessonId);
            currentProfile.setCompletedLessonsCount(currentProfile.getCompletedLessonsCount() + 1);
            addStars(5, "Completed lesson " + lessonId);
        }
    }

    private void checkBadgeUnlocks() {
        int stars = currentProfile.getTotalStars();
        int unlockedCount = 0;
        for (Badge badge : badges) {
            if (!badge.isUnlocked() && stars >= badge.getRequiredStars()) {
                badge.setUnlocked(true);
            }
            if (badge.isUnlocked()) {
                unlockedCount++;
            }
        }
        currentProfile.setBadgesEarned(unlockedCount);
    }

    public List<Badge> getAllBadges() {
        return badges;
    }

    public List<String> getRecentActivityHistory() {
        return activityHistoryStack.toList();
    }

    /**
     * Demonstrates Merge Sort O(n log n) in action to rank the student leaderboard!
     */
    public List<LeaderboardEntry> getLeaderboard() {
        List<LeaderboardEntry> entries = new ArrayList<>();
        entries.add(new LeaderboardEntry("user-1", "Maya Star", "🦄", 85, 6, 0));
        entries.add(new LeaderboardEntry("user-2", "Leo Roar", "🦁", 64, 5, 0));
        entries.add(new LeaderboardEntry("user-3", currentProfile.getName() + " (You)", currentProfile.getAvatar(), currentProfile.getTotalStars(), currentProfile.getBadgesEarned(), 0));
        entries.add(new LeaderboardEntry("user-4", "Sammy Swift", "🚀", 52, 4, 0));
        entries.add(new LeaderboardEntry("user-5", "Ella Elephant", "🐘", 38, 3, 0));
        entries.add(new LeaderboardEntry("user-6", "Oliver Owl", "🦉", 95, 7, 0));
        entries.add(new LeaderboardEntry("user-7", "Penny Penguin", "🐧", 44, 3, 0));

        // Use our Custom Merge Sort (O(n log n)) to sort by stars descending
        SortingEngine.SortResult<LeaderboardEntry> sortResult = SortingEngine.mergeSort(
            entries,
            (a, b) -> Integer.compare(b.getStars(), a.getStars())
        );

        List<LeaderboardEntry> sorted = sortResult.getSortedList();
        for (int i = 0; i < sorted.size(); i++) {
            sorted.get(i).setRank(i + 1);
        }
        return sorted;
    }
}
