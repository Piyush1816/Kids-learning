# 🎨 Little Learners — React 18 Frontend

Frontend client for **Little Learners — Explore, Play & Grow**, built with React 18, Vite, Tailwind CSS, Lucide icons, HTML5 Canvas, and Web Audio API.

---

## 🚀 Quick Start Instructions

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173/`

### 3. Build for Production
```bash
npm run build
```

---

## 🌟 Key Features

1. **8 Rich Learning Modules**: Alphabets A-Z, Numbers 1-100, Colors, Shapes, Animals, Fruits/Veggies, Vehicles, Human Body Parts.
2. **6 Interactive Mini-Games**: Animal Matcher, Memory Cards Matrix, Mystery Shadow Guesser, Healthy Basket Sorter, Counting Safari, Color & Shape Lightning Blitz.
3. **Adaptive Quiz Adventure**: Easy, Medium, and Challenge questions with randomized options, instantaneous feedback, and friendly explanations.
4. **Creative Corner Drawing Canvas**: HTML5 Canvas with pastel color palette, brush sizes, eraser, and **dual Stack (LIFO) Undo/Redo**.
5. **Parent & Educator Corner**: Private COPPA-compliant analytics, time spent tracking, subject mastery progress, and simple parental security gate.
6. **Dedicated DSA Lab & College Viva Showcase**: Real-time visualizers for:
   - Dynamic `ArrayList` resizing simulation
   - `HashMap` separate chaining and collision resolution
   - `ChallengeQueue` (FIFO) daily quest rotation
   - `ActivityStack` (LIFO) drawing canvas undo/redo
   - Linear Search $O(n)$ vs Binary Search $O(\log n)$ comparison
   - Bubble Sort $O(n^2)$ vs Merge Sort $O(n \log n)$ benchmark
   - Viva Defense Q&A cheat sheet

---

## 🔗 Connecting to the Spring Boot Backend

The frontend features automatic backend detection:
- When the Spring Boot backend is running on `http://localhost:8080/api`, the Navbar displays a **green status pill: `Spring Boot: Live`** and performs live REST requests.
- When the backend is offline, the frontend seamlessly operates in **Demo Mode (Local Storage)** so you can explore all games and lessons without any installation hurdles!
