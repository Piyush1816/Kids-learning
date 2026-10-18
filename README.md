# 🦊 Little Learners — Explore, Play & Grow
### Interactive Kids Learning & Educational DSA Platform in React

Welcome to **Little Learners**, a vibrant educational web application designed for children aged 4–10 and expanded with an interactive **Data Structures and Algorithms (DSA) Laboratory** for computer science learning and demonstration.

---

## 🚀 Overview

The application has been rewritten from the original Android wrapper into a standalone, modern **React + Vite** single-page application (SPA) with **Tailwind CSS**. It preserves all original features, 8-category curricula (175 interactive lessons), 6 educational mini-games, an adaptive quiz engine, drawing studio with undo/redo stack, parental dashboard, and interactive DSA visualizers with real-time algorithm benchmarks.

---

## 🌟 Key Features

1. **Explore & Learn (8 Interactive Curricula - 175 Lessons)**
   - **Alphabets (A-Z)**: Phonics, letter tracing, spoken pronunciation, fun facts, and micro-activities.
   - **Numbers (0-100 & Math)**: Interactive digital abacus, pattern counting, and arithmetic.
   - **Rainbow Studio (Colors)**: Color mixing laboratory (e.g., Red + Yellow = Orange).
   - **Shape Explorer**: 2D & 3D geometric shapes with real-world recognition.
   - **Wild Safari (Animals & Birds)**: Animal sounds, habitats, and trivia.
   - **Garden Market (Fruits & Veggies)**: Nutritional benefits and healthy eating habits.
   - **Motion World (Vehicles)**: Land, water, and air transportation.
   - **Human Body**: Anatomy, senses, and personal wellness.

2. **Play Zone (6 Interactive Mini-Games)**
   - Animal Sound Matcher
   - Memory Matrix Card Flip
   - Mystery Shadow Silhouette Guesser
   - Healthy Food & Item Category Sorter
   - Bubble Pop Math Challenger
   - Color Pattern Memory Sequence

3. **Quiz Adventure**
   - Filter by curriculum category and difficulty (Easy, Medium, Challenge).
   - Instant auditory and visual feedback, streak tracking, star rewards, and answer explanations.

4. **Creative Corner (Drawing Studio)**
   - Full HTML5 Canvas drawing board with color palette, brush sizes, and eraser.
   - LIFO **Stack-based Undo/Redo engine** demonstrating stack data structures.
   - Download finished art directly as an image.

5. **Parent & Educator Corner**
   - Private parental gate challenge (arithmetic challenge or PIN).
   - Progress analytics, lesson completion rates, time spent, and educator recommendations.

6. **DSA Visualizer Lab & College Viva Defense**
   - **Dynamic ArrayList Visualizer**: Watch capacity double with contiguous memory buffer visualization.
   - **Chained HashMap Visualizer**: Separate chaining collision handling with bucket visualization.
   - **FIFO Challenge Queue**: Enqueue and dequeue daily quests in First-In, First-Out order.
   - **Activity Stack**: Push and pop canvas stroke states with LIFO demonstration.
   - **Search & Sort Benchmarking Engine**: Side-by-side performance comparisons ($O(n)$ Linear vs $O(\log n)$ Binary Search, and $O(n^2)$ Bubble Sort vs $O(n \log n)$ Merge Sort).
   - **College Viva Cheat Sheet**: Curated answers for examiners on algorithm tradeoffs and complexities.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: React 18 (Functional Components, Hooks)
- **Bundler & Dev Server**: Vite 6 (`--host 0.0.0.0 --port 3000`)
- **Styling**: Tailwind CSS with custom pastel/brand design tokens and full Dark Mode support
- **Audio & Speech**: Web Audio API synthesis for celebratory chimes and native `SpeechSynthesis` for phonics
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage for persistent stars, badges, progress, and activity history

---

## 💻 Development & Build

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Build production bundle
npm run build
```
