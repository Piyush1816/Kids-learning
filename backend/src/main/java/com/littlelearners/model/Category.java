package com.littlelearners.model;

public class Category {
    private String id;
    private String name;
    private String title;
    private String description;
    private String icon;
    private String color;
    private int lessonCount;
    private int completedCount;

    public Category() {}

    public Category(String id, String name, String title, String description, String icon, String color, int lessonCount, int completedCount) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.description = description;
        this.icon = icon;
        this.color = color;
        this.lessonCount = lessonCount;
        this.completedCount = completedCount;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public int getLessonCount() { return lessonCount; }
    public void setLessonCount(int lessonCount) { this.lessonCount = lessonCount; }

    public int getCompletedCount() { return completedCount; }
    public void setCompletedCount(int completedCount) { this.completedCount = completedCount; }
}
