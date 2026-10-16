# 🦊 Little Learners — Spring Boot Java 21 Backend

Backend service for **Little Learners — Explore, Play & Grow**, an interactive kids learning platform and college project demonstrating **Data Structures & Algorithms (DSA) in Java**.

---

## 🛠️ Technology Stack
- **Language**: Java 21 LTS
- **Framework**: Spring Boot 3.2.3 (Spring MVC, REST APIs, Validation)
- **Build Tool**: Apache Maven (`pom.xml`)
- **JSON Serialization**: Jackson (`com.fasterxml.jackson`)
- **Testing**: JUnit 5, AssertJ

---

## 📦 DSA Implementations & Architecture

All core DSA structures are implemented in `com.littlelearners.dsa`:

| Custom DSA Class | Java Collection Equivalent | Time Complexity | Little Learners Feature / Use Case |
|---|---|---|---|
| `CustomArrayList<T>` | `java.util.ArrayList<T>` | $O(1)$ read, $O(1)$ amortized insert | Dynamic curriculum management, lessons catalog with 1.5x array capacity growth. |
| `CustomHashMap<K, V>`| `java.util.HashMap<K, V>` | $O(1)$ avg read/write | Fast category lookup, quiz answer key grading with separate chaining linked nodes. |
| `ChallengeQueue<T>` | `java.util.Queue<T>` | $O(1)$ enqueue, dequeue, peek | Daily learning challenge queue (FIFO rotation). |
| `ActivityStack<T>` | `java.util.Stack<T>` / `Deque` | $O(1)$ push, pop, peek | Creative Corner canvas drawing Undo/Redo and lesson navigation history. |
| `SearchEngine` | `Collections.binarySearch` | $O(\log n)$ binary vs $O(n)$ linear | Lesson search with live step-counter benchmarks. |
| `SortingEngine` | `Arrays.sort` (TimSort) | $O(n \log n)$ Merge Sort | Stable leaderboard ranking by stars and scores. |

---

## 🚀 How to Run the Backend

### Prerequisites
- JDK 21 installed (`java -version` returns Java 21+)
- Apache Maven installed (`mvn -version`)

### 1. Build and Run Tests
```bash
cd backend
mvn clean test
```

### 2. Start the Spring Boot Server
```bash
mvn spring-boot:run
```
The server will start at: `http://localhost:8080/`

---

## 🌐 REST Endpoints

### 1. Categories & Curriculum
- `GET /api/categories` — List all 8 educational categories with completion stats.
- `GET /api/categories/{id}` — Fetch details for a specific category.
- `GET /api/lessons` — List all lessons (optional filter: `?category=alphabets`).
- `GET /api/lessons/{id}` — Get single lesson details.
- `GET /api/lessons/search/binary?id=alpha-a` — Run Binary Search on sorted curricula.

### 2. Quizzes
- `GET /api/quizzes?category=alphabets&difficulty=Easy` — Retrieve randomized quiz questions.
- `POST /api/quizzes/submit` — Submit answers for grading, returns star rewards & explanations.

### 3. Daily Challenges & Progress
- `GET /api/challenges/daily` — Peek next task in the FIFO queue.
- `POST /api/challenges/complete` — Dequeue completed quest and rotate next.
- `GET /api/progress` — Child profile, star balance, badge count, streak, accuracy.
- `POST /api/progress/complete-lesson?lessonId=alpha-a` — Mark lesson completed.
- `GET /api/progress/history` — Activity stack history.

### 4. Rewards & Leaderboard
- `GET /api/rewards` — View all 8 collectible badges with unlock statuses.
- `GET /api/leaderboard` — Leaderboard sorted via custom Merge Sort ($O(n \log n)$).

### 5. DSA College Viva Benchmarks
- `GET /api/dsa/concepts` — Complete DSA cheat sheet with complexities and use cases.
- `GET /api/dsa/benchmark/search?size=100` — Live comparison of Linear vs Binary search.
- `GET /api/dsa/benchmark/sort?size=100` — Live comparison of Bubble vs Merge sort.
