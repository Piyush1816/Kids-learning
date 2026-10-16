package com.littlelearners.model;

import java.util.List;

public class LearnerProfile {
    private String id;
    private String name;
    private String avatar;
    private int totalStars;
    private int badgesEarned;
    private int completedLessonsCount;
    private int streakDays;
    private int timeSpentMinutes;
    private double quizAccuracy;
    private List<String> completedLessonIds;

    public LearnerProfile() {}

    public LearnerProfile(String id, String name, String avatar, int totalStars, int badgesEarned,
                          int completedLessonsCount, int streakDays, int timeSpentMinutes,
                          double quizAccuracy, List<String> completedLessonIds) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.totalStars = totalStars;
        this.badgesEarned = badgesEarned;
        this.completedLessonsCount = completedLessonsCount;
        this.streakDays = streakDays;
        this.timeSpentMinutes = timeSpentMinutes;
        this.quizAccuracy = quizAccuracy;
        this.completedLessonIds = completedLessonIds;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public int getTotalStars() { return totalStars; }
    public void setTotalStars(int totalStars) { this.totalStars = totalStars; }

    public int getBadgesEarned() { return badgesEarned; }
    public void setBadgesEarned(int badgesEarned) { this.badgesEarned = badgesEarned; }

    public int getCompletedLessonsCount() { return completedLessonsCount; }
    public void setCompletedLessonsCount(int completedLessonsCount) { this.completedLessonsCount = completedLessonsCount; }

    public int getStreakDays() { return streakDays; }
    public void setStreakDays(int streakDays) { this.streakDays = streakDays; }

    public int getTimeSpentMinutes() { return timeSpentMinutes; }
    public void setTimeSpentMinutes(int timeSpentMinutes) { this.timeSpentMinutes = timeSpentMinutes; }

    public double getQuizAccuracy() { return quizAccuracy; }
    public void setQuizAccuracy(double quizAccuracy) { this.quizAccuracy = quizAccuracy; }

    public List<String> getCompletedLessonIds() { return completedLessonIds; }
    public void setCompletedLessonIds(List<String> completedLessonIds) { this.completedLessonIds = completedLessonIds; }
}
