# 🦊 Little Learners — Explore, Play & Grow
### An Interactive Kids Learning Platform & College DSA Project in Java

Welcome to **Little Learners**, an educational web platform designed for children aged 4–10 and engineered as a comprehensive college project for **Data Structures and Algorithms (DSA) in Java**.

---

## 📁 Project Architecture & Directory Structure

```
├── backend/                              # Spring Boot 3 & Java 21 REST API
│   ├── pom.xml                           # Maven dependencies (Spring Web, Validation, JUnit 5)
│   ├── src/
│   │   ├── main/java/com/littlelearners/
│   │   │   ├── LittleLearnersApplication.java # Spring Boot Main
│   │   │   ├── config/CorsConfig.java    # Permissive CORS configuration
│   │   │   ├── controller/               # REST API Endpoints
│   │   │   │   ├── LessonController.java # /api/health, /api/categories, /api/lessons
│   │   │   │   ├── QuizController.java   # /api/quizzes, /api/quizzes/submit
│   │   │   │   ├── GameController.java   # /api/games
│   │   │   │   ├── ProgressController.java # /api/challenges, /api/history
│   │   │   │   ├── RewardController.java # /api/rewards, /api/leaderboard
│   │   │   │   └── DsaVisualizerController.java # /api/dsa/concepts, benchmarks, search, sort
│   │   │   ├── dsa/                      # Custom Core DSA Implementations
│   │   │   │   ├── CustomArrayList.java  # Resizable dynamic array (1.5x growth)
│   │   │   │   ├── CustomHashMap.java    # Chained hash table for O(1) lookups
│   │   │   │   ├── ChallengeQueue.java   # FIFO Queue for daily challenge quests
│   │   │   │   ├── ActivityStack.java    # LIFO Stack for undo/redo & history
│   │   │   │   ├── SearchEngine.java     # Linear O(n) & Binary Search O(log n)
│   │   │   │   └── SortingEngine.java    # Merge Sort O(n log n) & Bubble Sort
│   │   │   ├── model/                    # Domain entities (Lesson, Category, Quiz...)
│   │   │   └── service/                  # Business logic services
│   │   └── test/java/com/littlelearners/ # JUnit 5 Unit Tests
│   └── README.md
│
├── frontend/                             # React 18, Vite & Tailwind CSS Client
│   ├── package.json
│   ├── vite.config.js                    # Dev server & reverse proxy configuration
│   ├── tailwind.config.js                # Pastel & child-friendly design tokens
│   ├── src/
│   │   ├── components/                   # Navbar, Lumi mascot SVG, Confetti
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx           # Hero banner with Lumi mascot
│   │   │   ├── Dashboard.jsx             # Home dashboard & daily challenge queue
│   │   │   ├── ExploreLearn.jsx          # 8 rich interactive learning modules
│   │   │   ├── PlayZone.jsx              # 6 interactive educational mini-games
│   │   │   ├── QuizAdventure.jsx         # Adaptive multiple-choice quiz engine
│   │   │   ├── RewardsRoom.jsx           # Badges, star vault & leaderboard
│   │   │   ├── CreativeCorner.jsx        # Drawing canvas with Stack Undo/Redo
│   │   │   ├── ParentCorner.jsx          # Analytics & parental verification gate
│   │   │   ├── Settings.jsx              # Sound, theme & accessibility options
│   │   │   └── DsaLab.jsx                # Interactive DSA visualizer & Viva defense
│   │   └── services/
│   │       ├── api.js                    # Auto-detecting REST client & fallback
│   │       ├── audioService.js           # Web Audio & SpeechSynthesis phonics
│   │       └── mockData.js               # Rich offline curricula dataset
│   └── README.md
```

---

## ⚡ How to Run Both Applications Locally

### Step 1: Run the Java Spring Boot Backend
1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
2. The Spring Boot backend starts at: **`http://localhost:8081`** (API endpoints under **`/api`**, e.g., `/api/health`, `/api/categories`, `/api/dsa/concepts`).
3. To run all automated DSA unit tests:
   ```bash
   cd backend
   mvn test
   ```

### Step 2: Run the React Frontend Client
1. Open a second terminal in the `frontend/` directory:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open your browser at: **`http://localhost:3000`** (or Vite's default dev port).
3. The frontend Vite server automatically proxies `/api/*` requests to the Spring Boot backend (`http://localhost:8081`), and the top navbar displays: **`● Spring Boot: Live`**!
4. When running standalone without the backend, the app falls back seamlessly to the client offline demo engine, showing **`● Demo Mode`**.

---

## 🎓 College Viva & DSA Mapping Guide

| Feature in Little Learners | DSA Concept | Java Class | Time Complexity | Why it was chosen |
|---|---|---|---|---|
| Lessons & Category Catalog | Dynamic Resizable Array | `CustomArrayList.java` | $O(1)$ read, $O(1)$ amortized insert | Contiguous memory array gives instant random access by index for flipping cards. |
| Category & Quiz Grading | Hash Table (Separate Chaining) | `CustomHashMap.java` | $O(1)$ average get/put | Instant retrieval of correct answers and category metadata regardless of dataset size. |
| Daily Quest Sequence | First-In, First-Out (FIFO) Queue | `ChallengeQueue.java` | $O(1)$ enqueue, dequeue, peek | Ensures quests are completed in orderly sequence; completed tasks cycle to the tail. |
| Drawing Canvas Undo/Redo | Last-In, First-Out (LIFO) Stack | `ActivityStack.java` | $O(1)$ push, pop, peek | The most recent stroke drawn is the first to be undone, naturally modeling a stack. |
| Lesson ID Search | Binary Search vs Linear Search | `SearchEngine.java` | $O(\log n)$ vs $O(n)$ | Halves search space on sorted lesson keys in logarithmic steps. |
| Student Leaderboard | Merge Sort | `SortingEngine.java` | $O(n \log n)$ guaranteed | Stable divide-and-conquer algorithm that sorts scores consistently without degradation. |
