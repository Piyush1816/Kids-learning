package com.littlelearners.model;

import java.util.List;

public class Lesson implements Comparable<Lesson> {
    private String id;
    private String categoryId;
    private int orderIndex;
    private String title;
    private String phonics;
    private String illustration;
    private String explanation;
    private List<String> examples;
    private String soundKey;
    private String funFact;
    private String difficulty; // Easy, Medium, Challenge
    private boolean isCompleted;

    public Lesson() {}

    public Lesson(String id, String categoryId, int orderIndex, String title, String phonics,
                  String illustration, String explanation, List<String> examples,
                  String soundKey, String funFact, String difficulty, boolean isCompleted) {
        this.id = id;
        this.categoryId = categoryId;
        this.orderIndex = orderIndex;
        this.title = title;
        this.phonics = phonics;
        this.illustration = illustration;
        this.explanation = explanation;
        this.examples = examples;
        this.soundKey = soundKey;
        this.funFact = funFact;
        this.difficulty = difficulty;
        this.isCompleted = isCompleted;
    }

    @Override
    public int compareTo(Lesson other) {
        if (other == null) return 1;
        // Sort by orderIndex first, then id
        int cmp = Integer.compare(this.orderIndex, other.orderIndex);
        if (cmp != 0) return cmp;
        return this.id.compareTo(other.id);
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public int getOrderIndex() { return orderIndex; }
    public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getPhonics() { return phonics; }
    public void setPhonics(String phonics) { this.phonics = phonics; }

    public String getIllustration() { return illustration; }
    public void setIllustration(String illustration) { this.illustration = illustration; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public List<String> getExamples() { return examples; }
    public void setExamples(List<String> examples) { this.examples = examples; }

    public String getSoundKey() { return soundKey; }
    public void setSoundKey(String soundKey) { this.soundKey = soundKey; }

    public String getFunFact() { return funFact; }
    public void setFunFact(String funFact) { this.funFact = funFact; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public boolean isCompleted() { return isCompleted; }
    public void setCompleted(boolean completed) { isCompleted = completed; }
}
