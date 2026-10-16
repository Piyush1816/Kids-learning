package com.littlelearners.service;

import com.littlelearners.dsa.CustomArrayList;
import com.littlelearners.dsa.CustomHashMap;
import com.littlelearners.dsa.SearchEngine;
import com.littlelearners.model.Category;
import com.littlelearners.model.Lesson;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class CurriculumService {
    // Custom DSA structures holding our curriculum
    private final CustomArrayList<Category> categoryList = new CustomArrayList<>();
    private final CustomHashMap<String, Category> categoryMap = new CustomHashMap<>();
    private final CustomArrayList<Lesson> lessonList = new CustomArrayList<>();
    private final CustomHashMap<String, Lesson> lessonMap = new CustomHashMap<>();

    @PostConstruct
    public void init() {
        seedCategories();
        seedLessons();
    }

    private void seedCategories() {
        Category[] cats = {
            new Category("alphabets", "Alphabets", "Alphabet Safari", "Explore letters A-Z with phonics and words", "🔤", "#70C1B3", 26, 0),
            new Category("numbers", "Numbers", "Number Kingdom", "Learn counting, basic math and numbers 1-100", "🔢", "#B8E986", 20, 0),
            new Category("colors", "Colors", "Rainbow Studio", "Discover vibrant colors and magic color mixing", "🎨", "#FF6B6B", 10, 0),
            new Category("shapes", "Shapes", "Shape Adventure", "Explore 2D and 3D geometric shapes all around us", "🔷", "#9B5DE5", 10, 0),
            new Category("animals", "Animals & Birds", "Wild Wonder", "Meet creatures from jungles, farms, and oceans", "🦁", "#FFE45E", 15, 0),
            new Category("fruits-veggies", "Fruits & Veggies", "Garden Market", "Learn tasty healthy fruits and fresh vegetables", "🍎", "#FF8C42", 12, 0),
            new Category("vehicles", "Vehicles", "Motion World", "Zoom with cars, airplanes, boats and trains", "🚀", "#4D96FF", 10, 0),
            new Category("body-parts", "Human Body", "My Amazing Body", "Discover eyes, ears, heart and how our bodies work", "🖐️", "#FFB7B2", 10, 0)
        };

        for (Category cat : cats) {
            categoryList.add(cat);
            categoryMap.put(cat.getId(), cat);
        }
    }

    private void seedLessons() {
        // Alphabets sample seeds
        addLesson(new Lesson("alpha-a", "alphabets", 1, "Letter A", "a-a-apple", "🍎", "A is for Apple! Crisp, red, and delicious.", Arrays.asList("Apple", "Ant", "Airplane", "Alligator"), "apple", "Apples can float in water because 25% of their volume is air!", "Easy", false));
        addLesson(new Lesson("alpha-b", "alphabets", 2, "Letter B", "b-b-ball", "⚽", "B is for Ball! Bouncing high and rolling around.", Arrays.asList("Ball", "Bear", "Banana", "Butterfly"), "ball", "Butterflies taste food with their tiny feet!", "Easy", false));
        addLesson(new Lesson("alpha-c", "alphabets", 3, "Letter C", "k-k-cat", "🐱", "C is for Cat! Purring softly and leaping high.", Arrays.asList("Cat", "Car", "Cake", "Camel"), "cat", "Cats can jump up to 6 times their height!", "Easy", false));
        addLesson(new Lesson("alpha-d", "alphabets", 4, "Letter D", "d-d-dog", "🐶", "D is for Dog! Man's best loyal companion.", Arrays.asList("Dog", "Duck", "Dolphin", "Drum"), "dog", "A dog's sense of smell is 10,000 to 100,000 times stronger than humans!", "Easy", false));
        addLesson(new Lesson("alpha-e", "alphabets", 5, "Letter E", "e-e-elephant", "🐘", "E is for Elephant! Gentle giant with a long trunk.", Arrays.asList("Elephant", "Egg", "Eagle", "Earth"), "elephant", "Elephants communicate with low rumbles humans cannot hear!", "Easy", false));

        // Numbers seeds
        addLesson(new Lesson("num-1", "numbers", 1, "Number 1 (One)", "w-u-n", "☝️", "1 is a single shining star in the sky.", Arrays.asList("1 Sun", "1 Moon", "1 Nose", "1 Heart"), "one", "Earth has exactly 1 natural moon orbiting it!", "Easy", false));
        addLesson(new Lesson("num-2", "numbers", 2, "Number 2 (Two)", "t-oo", "✌️", "2 is a pair of bright shining eyes.", Arrays.asList("2 Shoes", "2 Wings", "2 Hands", "2 Ears"), "two", "Most birds have 2 wings to soar high into clouds!", "Easy", false));
        addLesson(new Lesson("num-3", "numbers", 3, "Number 3 (Three)", "th-r-ee", "🔺", "3 is a lucky triangle with three sharp corners.", Arrays.asList("3 Traffic Lights", "3 Primary Colors", "3 Wheels on Tricycle"), "three", "Honeybees have 3 tiny extra eyes on top of their head!", "Easy", false));
        addLesson(new Lesson("num-4", "numbers", 4, "Number 4 (Four)", "f-o-r", "🍀", "4 is the legs of a cozy chair or puppy.", Arrays.asList("4 Seasons", "4 Wheels on Car", "4 Clover Leaves"), "four", "Finding a four-leaf clover happens once in 10,000 clovers!", "Medium", false));
        addLesson(new Lesson("num-5", "numbers", 5, "Number 5 (Five)", "f-eye-v", "🖐️", "5 fingers waving hello on your cheerful hand.", Arrays.asList("5 Fingers", "5 Senses", "5 Ocean Oceans"), "five", "Starfish typically have 5 arms radiating from the center!", "Medium", false));

        // Colors seeds
        addLesson(new Lesson("col-red", "colors", 1, "Red Ruby", "r-e-d", "🔴", "Red is warm, energetic, and bright like strawberries.", Arrays.asList("Strawberries", "Firetruck", "Roses", "Ruby"), "red", "Red is the very first color a newborn baby can see!", "Easy", false));
        addLesson(new Lesson("col-blue", "colors", 2, "Blue Ocean", "b-l-oo", "🔵", "Blue is calm and vast like ocean waves and morning skies.", Arrays.asList("Ocean", "Sky", "Blueberry", "Blue Jay"), "blue", "Blue whales are the largest creatures to ever live on Earth!", "Easy", false));
        addLesson(new Lesson("col-yellow", "colors", 3, "Sunshine Yellow", "y-e-l-o", "🟡", "Yellow is cheerful, shining warmly like the bright sun.", Arrays.asList("Sun", "Lemon", "Sunflower", "School Bus"), "yellow", "Sunflowers turn their heads to follow the sun across the sky!", "Easy", false));
        addLesson(new Lesson("col-green", "colors", 4, "Green Meadow", "g-r-ee-n", "🟢", "Green is fresh like grassy hills, frog jumps, and leafy trees.", Arrays.asList("Grass", "Leaf", "Frog", "Cucumber"), "green", "Leaves look green because of a magic sun-catcher called chlorophyll!", "Medium", false));

        // Shapes seeds
        addLesson(new Lesson("shp-circle", "shapes", 1, "Circle", "s-er-k-l", "⭕", "A circle is perfectly round with zero straight edges.", Arrays.asList("Full Moon", "Clock", "Wheel", "Coin"), "circle", "A wheel is shaped like a circle so it rolls smoothly without bumps!", "Easy", false));
        addLesson(new Lesson("shp-square", "shapes", 2, "Square", "s-k-w-air", "⬛", "A square has 4 straight sides that are all exactly equal.", Arrays.asList("Building Block", "Tile", "Chessboard", "Gift Box"), "square", "All 4 interior corners of a square are 90-degree right angles!", "Easy", false));
        addLesson(new Lesson("shp-triangle", "shapes", 3, "Triangle", "t-r-eye-ang-l", "🔺", "A triangle has 3 sides and 3 pointy corners.", Arrays.asList("Pizza Slice", "Sailboat Sail", "Pyramid", "Mountain Peak"), "triangle", "Triangles are the strongest structural shape used in bridges!", "Medium", false));

        // Animals seeds
        addLesson(new Lesson("ani-lion", "animals", 1, "Lumi's Friend: Lion", "l-eye-u-n", "🦁", "The lion is the King of the Jungle with a golden mane.", Arrays.asList("Savannah", "Big Cats", "Carnivore", "Pride"), "lion", "A lion's mighty roar can be heard from 8 kilometers (5 miles) away!", "Easy", false));
        addLesson(new Lesson("ani-dolphin", "animals", 2, "Playful Dolphin", "d-o-l-f-i-n", "🐬", "Dolphins are super smart sea mammals who love to jump.", Arrays.asList("Ocean", "Pods", "Echolocation", "Swimmer"), "dolphin", "Dolphins sleep with one eye open and half their brain awake!", "Medium", false));

        // Fruits/Veggies seeds
        addLesson(new Lesson("frt-banana", "fruits-veggies", 1, "Sweet Banana", "b-u-n-a-n-u", "🍌", "Bananas grow in bunches and are packed with potassium energy.", Arrays.asList("Yellow Fruit", "Smoothies", "Potassium", "Peelable"), "banana", "Bananas naturally curve upwards toward the sun as they grow!", "Easy", false));
        addLesson(new Lesson("frt-carrot", "fruits-veggies", 2, "Crisp Carrot", "k-a-r-u-t", "🥕", "Carrots grow under soil and are rich in Vitamin A for eyes.", Arrays.asList("Root Veggie", "Orange", "Crunchy", "Vitamin A"), "carrot", "Carrots were originally purple and yellow before orange varieties were cultivated!", "Easy", false));

        // Vehicles seeds
        addLesson(new Lesson("veh-rocket", "vehicles", 1, "Space Rocket", "r-o-k-e-t", "🚀", "Rockets blast fiery engines to escape Earth gravity into stars.", Arrays.asList("Spacecraft", "Astronaut", "Orbit", "Thrusters"), "rocket", "A space rocket must travel over 28,000 km/h to stay in Earth orbit!", "Challenge", false));
        addLesson(new Lesson("veh-airplane", "vehicles", 2, "Jet Airplane", "air-p-l-ay-n", "✈️", "Airplanes use aerofoil wings to soar above fluffy clouds.", Arrays.asList("Sky Travel", "Wings", "Pilot", "Runway"), "airplane", "The Wright brothers' first flight lasted only 12 seconds in 1903!", "Medium", false));

        // Body Parts seeds
        addLesson(new Lesson("bdy-heart", "body-parts", 1, "Loving Heart", "h-ar-t", "❤️", "Your heart is a tireless pump sending blood to your whole body.", Arrays.asList("Pumping Organ", "Chest", "Pulse", "Circulation"), "heart", "Your heart beats about 100,000 times every single day!", "Medium", false));
        addLesson(new Lesson("bdy-eyes", "body-parts", 2, "Curious Eyes", "eye-z", "👀", "Eyes capture light so your brain can see colors and shapes.", Arrays.asList("Vision", "Eyelashes", "Pupil", "Blinking"), "eyes", "Humans blink about 15 to 20 times every minute to keep eyes moist!", "Easy", false));
    }

    private void addLesson(Lesson lesson) {
        lessonList.add(lesson);
        lessonMap.put(lesson.getId(), lesson);
    }

    public List<Category> getAllCategories() {
        List<Category> list = new ArrayList<>();
        for (Category cat : categoryList) {
            list.add(cat);
        }
        return list;
    }

    public Category getCategoryById(String id) {
        return categoryMap.get(id); // O(1) hash map lookup
    }

    public List<Lesson> getAllLessons() {
        List<Lesson> list = new ArrayList<>();
        for (Lesson l : lessonList) {
            list.add(l);
        }
        return list;
    }

    public List<Lesson> getLessonsByCategory(String categoryId) {
        List<Lesson> filtered = new ArrayList<>();
        for (Lesson l : lessonList) {
            if (l.getCategoryId().equalsIgnoreCase(categoryId)) {
                filtered.add(l);
            }
        }
        return filtered;
    }

    public Lesson getLessonById(String id) {
        return lessonMap.get(id); // O(1) custom hash map
    }

    public SearchEngine.SearchResult<Lesson> searchLessonBinary(String sortedLessonId) {
        // Collect sorted list for Binary Search
        List<Lesson> sorted = getAllLessons();
        Collections.sort(sorted);
        Lesson dummy = new Lesson();
        dummy.setId(sortedLessonId);
        dummy.setOrderIndex(0);
        return SearchEngine.binarySearch(sorted, dummy);
    }

    public void markLessonCompleted(String lessonId) {
        Lesson lesson = lessonMap.get(lessonId);
        if (lesson != null && !lesson.isCompleted()) {
            lesson.setCompleted(true);
            Category cat = categoryMap.get(lesson.getCategoryId());
            if (cat != null) {
                cat.setCompletedCount(cat.getCompletedCount() + 1);
            }
        }
    }
}
