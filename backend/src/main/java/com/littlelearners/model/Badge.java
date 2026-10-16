package com.littlelearners.model;

public class Badge {
    private String id;
    private String title;
    private String description;
    private String icon;
    private String category;
    private boolean isUnlocked;
    private int requiredStars;

    public Badge() {}

    public Badge(String id, String title, String description, String icon, String category, boolean isUnlocked, int requiredStars) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.icon = icon;
        this.category = category;
        this.isUnlocked = isUnlocked;
        this.requiredStars = requiredStars;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public boolean isUnlocked() { return isUnlocked; }
    public void setUnlocked(boolean unlocked) { isUnlocked = unlocked; }

    public int getRequiredStars() { return requiredStars; }
    public void setRequiredStars(int requiredStars) { this.requiredStars = requiredStars; }
}
