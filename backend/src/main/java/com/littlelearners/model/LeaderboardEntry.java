package com.littlelearners.model;

public class LeaderboardEntry {
    private String learnerId;
    private String name;
    private String avatar;
    private int stars;
    private int badges;
    private int rank;

    public LeaderboardEntry() {}

    public LeaderboardEntry(String learnerId, String name, String avatar, int stars, int badges, int rank) {
        this.learnerId = learnerId;
        this.name = name;
        this.avatar = avatar;
        this.stars = stars;
        this.badges = badges;
        this.rank = rank;
    }

    public String getLearnerId() { return learnerId; }
    public void setLearnerId(String learnerId) { this.learnerId = learnerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public int getStars() { return stars; }
    public void setStars(int stars) { this.stars = stars; }

    public int getBadges() { return badges; }
    public void setBadges(int badges) { this.badges = badges; }

    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }
}
