package com.littlelearners.model;

public class Challenge {
    private String id;
    private String title;
    private String description;
    private String categoryId;
    private int starReward;
    private boolean isCompleted;

    public Challenge() {}

    public Challenge(String id, String title, String description, String categoryId, int starReward, boolean isCompleted) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.categoryId = categoryId;
        this.starReward = starReward;
        this.isCompleted = isCompleted;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public int getStarReward() { return starReward; }
    public void setStarReward(int starReward) { this.starReward = starReward; }

    public boolean isCompleted() { return isCompleted; }
    public void setCompleted(boolean completed) { isCompleted = completed; }
}
