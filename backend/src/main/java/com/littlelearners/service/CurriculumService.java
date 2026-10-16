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
            new Category("numbers", "Numbers", "Number Kingdom", "Learn counting, basic math and numbers 0-100", "🔢", "#B8E986", 33, 0),
            new Category("colors", "Colors", "Rainbow Studio", "Discover vibrant colors, shades, and magic color mixing", "🎨", "#FF6B6B", 15, 0),
            new Category("shapes", "Shapes", "Shape Adventure", "Explore 2D and 3D geometric shapes all around us", "🔷", "#9B5DE5", 17, 0),
            new Category("animals", "Animals & Birds", "Wild Wonder", "Meet creatures from jungles, skies, and oceans", "🦁", "#FFE45E", 30, 0),
            new Category("fruits-veggies", "Fruits & Veggies", "Garden Market", "Learn tasty healthy fruits and fresh crunchy vegetables", "🍎", "#FF8C42", 22, 0),
            new Category("vehicles", "Vehicles", "Motion World", "Zoom with cars, trains, boats, planes, and rockets", "🚀", "#4D96FF", 16, 0),
            new Category("body-parts", "Human Body", "My Amazing Body", "Discover eyes, brain, heart and healthy habits", "🖐️", "#FFB7B2", 16, 0)
        };

        for (Category cat : cats) {
            categoryList.add(cat);
            categoryMap.put(cat.getId(), cat);
        }
    }

    private void seedLessons() {
        seedAlphabets();
        seedNumbers();
        seedColors();
        seedShapes();
        seedAnimals();
        seedFruitsVeggies();
        seedVehicles();
        seedBodyParts();
    }

    private void seedAlphabets() {
        // A - Z (26 lessons)
        addL("alpha-a", "alphabets", 1, "Letter Aa — Apple", "a-a-apple", "🍎",
            "A is for Apple! Crisp, red, and delicious fruit.", Arrays.asList("Apple", "Ant", "Airplane", "Alligator"),
            "apple", "Apples float in water because 25% of their volume is air!", "Easy", "Ages 4-5",
            "Which fruit starts with the letter A?", Arrays.asList("Apple", "Banana", "Cat"), 0, "Look for the red fruit!");

        addL("alpha-b", "alphabets", 2, "Letter Bb — Ball", "b-b-ball", "⚽",
            "B is for Ball! Bouncing high and rolling around.", Arrays.asList("Ball", "Bear", "Banana", "Butterfly"),
            "ball", "Butterflies taste sweet flower nectar with their tiny feet!", "Easy", "Ages 4-5",
            "What sound does letter B make?", Arrays.asList("b-b-ball", "k-k-cat", "m-m-moon"), 0, "B makes the bouncy 'b' sound!");

        addL("alpha-c", "alphabets", 3, "Letter Cc — Cat", "k-k-cat", "🐱",
            "C is for Cat! Purring softly and leaping high.", Arrays.asList("Cat", "Car", "Cake", "Camel"),
            "cat", "Cats can jump up to 6 times their body height!", "Easy", "Ages 4-5",
            "Which vehicle begins with letter C?", Arrays.asList("Airplane", "Car", "Train"), 1, "Vroom! It drives on roads.");

        addL("alpha-d", "alphabets", 4, "Letter Dd — Dog", "d-d-dog", "🐶",
            "D is for Dog! A loyal buddy who wags its happy tail.", Arrays.asList("Dog", "Duck", "Dolphin", "Drum"),
            "dog", "A puppy's sense of smell is up to 100,000 times sharper than ours!", "Easy", "Ages 4-5",
            "Which ocean friend begins with letter D?", Arrays.asList("Dolphin", "Lion", "Giraffe"), 0, "It loves clicking and jumping waves!");

        addL("alpha-e", "alphabets", 5, "Letter Ee — Elephant", "e-e-elephant", "🐘",
            "E is for Elephant! Gentle giant with a magnificent trunk.", Arrays.asList("Elephant", "Egg", "Eagle", "Earth"),
            "elephant", "An elephant trunk has more than 40,000 muscles!", "Easy", "Ages 4-5",
            "Which majestic soaring bird begins with letter E?", Arrays.asList("Eagle", "Penguin", "Owl"), 0, "It has sharp eyes in the sky!");

        addL("alpha-f", "alphabets", 6, "Letter Ff — Fish", "f-f-fish", "🐟",
            "F is for Fish! Swimming smoothly through ocean reefs.", Arrays.asList("Fish", "Frog", "Fox", "Flower"),
            "fish", "Goldfish have great memories and can recognize faces!", "Easy", "Ages 4-5",
            "Which clever orange woodland creature starts with F?", Arrays.asList("Fox", "Bear", "Rabbit"), 0, "Lumi is a friendly little fox!");

        addL("alpha-g", "alphabets", 7, "Letter Gg — Giraffe", "j-j-giraffe", "🦒",
            "G is for Giraffe! The tallest mammal browsing sunny treetops.", Arrays.asList("Giraffe", "Grape", "Guitar", "Goat"),
            "giraffe", "A giraffe neck is about 6 feet long, just like its legs!", "Easy", "Ages 4-5",
            "Which sweet purple fruit grows on vines and starts with G?", Arrays.asList("Grape", "Apple", "Banana"), 0, "They come in juicy bunches!");

        addL("alpha-h", "alphabets", 8, "Letter Hh — Horse", "h-h-horse", "🐴",
            "H is for Horse! Galloping across meadows with a flowing mane.", Arrays.asList("Horse", "House", "Heart", "Hat"),
            "horse", "Horses can sleep both lying down and standing up!", "Easy", "Ages 4-5",
            "Which cozy home starts with letter H?", Arrays.asList("House", "Igloo", "Tent"), 0, "Where your family lives!");

        addL("alpha-i", "alphabets", 9, "Letter Ii — Igloo", "i-i-igloo", "🧊",
            "I is for Igloo! A cozy dome built from blocks of packed snow.", Arrays.asList("Igloo", "Island", "Insect", "Ice Cream"),
            "igloo", "An igloo traps body warmth inside to keep explorers safe from blizzards!", "Easy", "Ages 4-5",
            "Which sweet cold dessert starts with letter I?", Arrays.asList("Ice Cream", "Cake", "Pizza"), 0, "Scooped on a crunchy cone!");

        addL("alpha-j", "alphabets", 10, "Letter Jj — Jellyfish", "j-j-jellyfish", "🪼",
            "J is for Jellyfish! Glowing gently under moonlit ocean waves.", Arrays.asList("Jellyfish", "Jaguar", "Juice", "Jungle"),
            "jellyfish", "Jellyfish have drifted in our oceans for over 500 million years!", "Medium", "Ages 6-7",
            "Which fierce spotted wild cat starts with J?", Arrays.asList("Jaguar", "Lion", "Tiger"), 0, "It stalks quietly in the rainforest!");

        addL("alpha-k", "alphabets", 11, "Letter Kk — Kangaroo", "k-k-kangaroo", "🦘",
            "K is for Kangaroo! Hopping across sunny Australian plains.", Arrays.asList("Kangaroo", "Kite", "Koala", "King"),
            "kangaroo", "Baby kangaroos are called joeys and stay cozy in mom's pouch!", "Medium", "Ages 6-7",
            "Which diamond-shaped toy flies on windy days?", Arrays.asList("Kite", "Ball", "Drum"), 0, "Hold tightly to the string in the breeze!");

        addL("alpha-l", "alphabets", 12, "Letter Ll — Lion", "l-l-lion", "🦁",
            "L is for Lion! Brave King of the Jungle with a furry golden mane.", Arrays.asList("Lion", "Lemon", "Leaf", "Lamb"),
            "lion", "A lion's mighty roar can be heard from 5 whole miles away!", "Medium", "Ages 6-7",
            "Which sour yellow citrus fruit starts with L?", Arrays.asList("Lemon", "Apple", "Grape"), 0, "Squeeze it to make fresh lemonade!");

        addL("alpha-m", "alphabets", 13, "Letter Mm — Monkey", "m-m-monkey", "🐒",
            "M is for Monkey! Playful acrobat swinging through green branches.", Arrays.asList("Monkey", "Moon", "Mango", "Music"),
            "monkey", "Monkeys use their tail like an extra hand to balance and swing!", "Medium", "Ages 6-7",
            "What glows brightly in the night sky and starts with M?", Arrays.asList("Moon", "Sun", "Rainbow"), 0, "It changes shapes from crescent to full!");

        addL("alpha-n", "alphabets", 14, "Letter Nn — Nest", "n-n-nest", "🪹",
            "N is for Nest! A cozy woven cradle for sweet baby birds.", Arrays.asList("Nest", "Nut", "Nose", "Night"),
            "nest", "Weaver birds tie real knots with grass strands to build nests!", "Medium", "Ages 6-7",
            "Which body part smells fresh flowers and starts with N?", Arrays.asList("Nose", "Ear", "Eye"), 0, "Breathe in deeply through it!");

        addL("alpha-o", "alphabets", 15, "Letter Oo — Owl", "o-o-owl", "🦉",
            "O is for Owl! Wise nocturnal bird watching with huge luminous eyes.", Arrays.asList("Owl", "Octopus", "Orange", "Ocean"),
            "owl", "Owls can rotate their heads up to 270 degrees without moving their shoulders!", "Medium", "Ages 6-7",
            "Which 8-armed sea creature starts with letter O?", Arrays.asList("Octopus", "Fish", "Crab"), 0, "It swims with eight suction-cup tentacles!");

        addL("alpha-p", "alphabets", 16, "Letter Pp — Penguin", "p-p-penguin", "🐧",
            "P is for Penguin! Waddling on Antarctic ice and swimming like a torpedo.", Arrays.asList("Penguin", "Panda", "Pizza", "Parrot"),
            "penguin", "Penguins slide on their tummies across snow—it's called tobogganing!", "Medium", "Ages 6-7",
            "Which black-and-white bear loves eating bamboo and starts with P?", Arrays.asList("Panda", "Lion", "Koala"), 0, "Gentle panda munching green stalks!");

        addL("alpha-q", "alphabets", 17, "Letter Qq — Queen Bee", "kw-kw-queen", "👑",
            "Q is for Queen! Mother of the buzzing hive wearing a royal crown.", Arrays.asList("Queen", "Quilt", "Quiet", "Quick"),
            "queen", "A queen honeybee can lay up to 2,000 eggs every single day!", "Challenge", "Ages 8-10",
            "Which warm stitched blanket starts with letter Q?", Arrays.asList("Quilt", "Coat", "Pillow"), 0, "A colorful patchwork quilt keeps you warm!");

        addL("alpha-r", "alphabets", 18, "Letter Rr — Rainbow", "r-r-rainbow", "🌈",
            "R is for Rainbow! Seven vibrant arcs painted across the sky after rain.", Arrays.asList("Rainbow", "Rabbit", "Rocket", "Robot"),
            "rainbow", "Rainbows occur when sunlight is refracted through millions of tiny raindrops!", "Challenge", "Ages 8-10",
            "Which fluffy hopper with long ears starts with R?", Arrays.asList("Rabbit", "Duck", "Frog"), 0, "It hops through meadows and wiggles its nose!");

        addL("alpha-s", "alphabets", 19, "Letter Ss — Sun", "s-s-sun", "☀️",
            "S is for Sun! Our warm shining star providing light and life to Earth.", Arrays.asList("Sun", "Star", "Strawberry", "Ship"),
            "sun", "Light from the Sun takes about 8 minutes and 20 seconds to reach Earth!", "Challenge", "Ages 8-10",
            "Which sweet red berry with outside seeds starts with S?", Arrays.asList("Strawberry", "Apple", "Grape"), 0, "Juicy red strawberry!");

        addL("alpha-t", "alphabets", 20, "Letter Tt — Tiger", "t-t-tiger", "🐯",
            "T is for Tiger! The largest cat in the world with striking orange stripes.", Arrays.asList("Tiger", "Tree", "Train", "Turtle"),
            "tiger", "Every tiger has a completely unique stripe pattern, just like human fingerprints!", "Challenge", "Ages 8-10",
            "Which vehicle travels along iron tracks and starts with T?", Arrays.asList("Train", "Airplane", "Boat"), 0, "Choo-choo! The railway train.");

        addL("alpha-u", "alphabets", 21, "Letter Uu — Umbrella", "u-u-umbrella", "☂️",
            "U is for Umbrella! Popping open to keep you dry during rainy days.", Arrays.asList("Umbrella", "Unicorn", "Up", "Universe"),
            "umbrella", "The word umbrella comes from the Latin word 'umbra', meaning shade or shadow!", "Challenge", "Ages 8-10",
            "Which magical horse with a spiraling horn starts with U?", Arrays.asList("Unicorn", "Zebra", "Horse"), 0, "A sparkling mythical unicorn!");

        addL("alpha-v", "alphabets", 22, "Letter Vv — Violin", "v-v-violin", "🎻",
            "V is for Violin! A wooden instrument played with a horsehair bow.", Arrays.asList("Violin", "Van", "Vegetable", "Volcano"),
            "violin", "Playing the violin exercises both sides of your brain at the same time!", "Challenge", "Ages 8-10",
            "Which fiery mountain that erupts begins with letter V?", Arrays.asList("Volcano", "Pyramid", "Hill"), 0, "Hot lava flows from an active volcano!");

        addL("alpha-w", "alphabets", 23, "Letter Ww — Whale", "w-w-whale", "🐋",
            "W is for Whale! Magnificent ocean mammal gliding through deep blue waters.", Arrays.asList("Whale", "Water", "Wind", "Watermelon"),
            "whale", "The blue whale's heart is the size of a small car!", "Challenge", "Ages 8-10",
            "What sweet green and red melon begins with W?", Arrays.asList("Watermelon", "Banana", "Apple"), 0, "92% pure sweet hydrating water!");

        addL("alpha-x", "alphabets", 24, "Letter Xx — Xylophone", "ks-ks-xylophone", "🎶",
            "X is for Xylophone! Colorful tuned bars struck with mallets to make music.", Arrays.asList("Xylophone", "X-ray", "Fox", "Box"),
            "xylophone", "The name xylophone comes from two ancient Greek words meaning 'wood sound'!", "Challenge", "Ages 8-10",
            "Which medical picture lets doctors see bones inside and starts with X?", Arrays.asList("X-ray", "Camera", "Mirror"), 0, "An X-ray reveals healthy bones!");

        addL("alpha-y", "alphabets", 25, "Letter Yy — Yacht", "y-y-yacht", "⛵",
            "Y is for Yacht! A sleek sailing boat cruising across sparkling sunny waves.", Arrays.asList("Yacht", "Yellow", "Yo-yo", "Yogurt"),
            "yacht", "A yo-yo is one of the oldest toys in human history, dating back 2,500 years!", "Challenge", "Ages 8-10",
            "Which bright sunshine color starts with the letter Y?", Arrays.asList("Yellow", "Blue", "Red"), 0, "Yellow like a smiling sunflower!");

        addL("alpha-z", "alphabets", 26, "Letter Zz — Zebra", "z-z-zebra", "🦓",
            "Z is for Zebra! Striped wild horse roaming across wide savannah grasslands.", Arrays.asList("Zebra", "Zoo", "Zero", "Zigzag"),
            "zebra", "A zebra's black and white stripes confuse biting flies and camouflage in heat waves!", "Challenge", "Ages 8-10",
            "Which number means none or starting point and starts with Z?", Arrays.asList("Zero", "Ten", "One"), 0, "Zero: 0!");
    }

    private void seedNumbers() {
        // Stage 1: Counting 0 to 10 (11 lessons)
        addL("num-0", "numbers", 1, "Number 0 (Zero)", "z-ee-r-o", "⭕",
            "Zero means an empty basket, but placed behind other numbers it makes them 10 times bigger!",
            Arrays.asList("0 apples in empty bowl", "0 clouds in blue sky", "Base of all numbers"),
            "zero", "Ancient Indian mathematicians invented the symbol and concept of zero as a number!", "Easy", "Stage 1: Counting 0-10",
            "If your cookie jar is completely empty, how many cookies are inside?", Arrays.asList("0 cookies", "5 cookies", "10 cookies"), 0, "Empty means zero!");

        addL("num-1", "numbers", 2, "Number 1 (One)", "w-u-n", "☝️",
            "1 is the single bright Sun in our sky and one nose on your smiling face.",
            Arrays.asList("1 Sun", "1 Moon", "1 Nose", "1 Heart"),
            "one", "Earth has exactly 1 natural moon orbiting around us!", "Easy", "Stage 1: Counting 0-10",
            "How many suns shine warmly in our daytime sky?", Arrays.asList("1", "2", "5"), 0, "Just 1 bright sun!");

        addL("num-2", "numbers", 3, "Number 2 (Two)", "t-oo", "✌️",
            "2 is a pair of bright eyes to see the world, and 2 shoes for running.",
            Arrays.asList("2 Eyes", "2 Shoes", "2 Wings", "2 Ears"),
            "two", "Birds have 2 aerodynamic wings that enable them to soar high!", "Easy", "Stage 1: Counting 0-10",
            "How many wings does a soaring eagle have?", Arrays.asList("2", "4", "1"), 0, "A pair of 2 wings!");

        addL("num-3", "numbers", 4, "Number 3 (Three)", "th-r-ee", "🔺",
            "3 is the corners on a sturdy triangle and 3 traffic lights (Red, Yellow, Green).",
            Arrays.asList("3 Traffic Lights", "3 Primary Colors", "3 Wheels on Tricycle"),
            "three", "Honeybees have 3 tiny extra eyes on top of their heads to navigate!", "Easy", "Stage 1: Counting 0-10",
            "How many sides does a triangle have?", Arrays.asList("3 sides", "4 sides", "5 sides"), 0, "Triangles have 3 straight sides!");

        addL("num-4", "numbers", 5, "Number 4 (Four)", "f-o-r", "🍀",
            "4 seasons of the year: Spring, Summer, Autumn, Winter, and 4 wheels on a car.",
            Arrays.asList("4 Seasons", "4 Wheels", "4 Legs on Puppy", "4 Clover Leaflets"),
            "four", "Finding a rare four-leaf clover happens about once in 10,000 clovers!", "Easy", "Stage 1: Counting 0-10",
            "How many wheels does a family car drive on?", Arrays.asList("4 wheels", "2 wheels", "8 wheels"), 0, "4 sturdy wheels!");

        addL("num-5", "numbers", 6, "Number 5 (Five)", "f-eye-v", "🖐️",
            "5 fingers on your hand waving hello and 5 arms on a friendly sea star.",
            Arrays.asList("5 Fingers", "5 Senses", "5 Oceans", "5 Star Arms"),
            "five", "Most sea stars have 5 arms radiating outwards from their center!", "Easy", "Stage 1: Counting 0-10",
            "How many fingers are on one cheerful hand?", Arrays.asList("5", "10", "4"), 0, "Count them: 1, 2, 3, 4, 5!");

        addL("num-6", "numbers", 7, "Number 6 (Six)", "s-i-k-s", "🎲",
            "6 spots on a playing die and 6 jointed legs on all insects like ladybugs and bees.",
            Arrays.asList("6 Insect Legs", "6 Die Faces", "6 Strings on Guitar"),
            "six", "Every true insect on Earth has exactly 6 jointed legs!", "Easy", "Stage 1: Counting 0-10",
            "How many legs does a tiny ladybug walk on?", Arrays.asList("6 legs", "8 legs", "4 legs"), 0, "All insects have 6 legs!");

        addL("num-7", "numbers", 8, "Number 7 (Seven)", "s-e-v-u-n", "🌈",
            "7 glowing colors in a magical rainbow and 7 days in a whole week.",
            Arrays.asList("7 Rainbow Colors", "7 Days in Week", "7 Continents on Earth"),
            "seven", "There are 7 continents on planet Earth: Asia, Africa, Europe, Americas, Australia, Antarctica!", "Easy", "Stage 1: Counting 0-10",
            "How many days are in one complete week from Monday to Sunday?", Arrays.asList("7 days", "5 days", "10 days"), 0, "7 days in a week!");

        addL("num-8", "numbers", 9, "Number 8 (Eight)", "ay-t", "🐙",
            "8 flexible suction-cup tentacles on an octopus and 8 walking legs on a spider.",
            Arrays.asList("8 Octopus Tentacles", "8 Spider Legs", "8 Corners on Cube"),
            "eight", "An octopus has 8 flexible arms and 3 hearts pumping blue blood!", "Easy", "Stage 1: Counting 0-10",
            "How many arms does an ocean octopus swim with?", Arrays.asList("8 arms", "6 arms", "10 arms"), 0, "Octo means 8!");

        addL("num-9", "numbers", 10, "Number 9 (Nine)", "n-eye-n", "🪐",
            "9 is the largest single digit in our base-10 counting system!",
            Arrays.asList("9 Innings in Baseball", "9 Square Tic-Tac-Toe cells", "Largest single digit"),
            "nine", "A full game of baseball consists of 9 exciting innings!", "Easy", "Stage 1: Counting 0-10",
            "What number comes right after 8 when counting?", Arrays.asList("9", "7", "10"), 0, "7, 8, 9!");

        addL("num-10", "numbers", 11, "Number 10 (Ten)", "t-e-n", "🔟",
            "10 toes wiggling on your feet and 10 fingers across both your hands!",
            Arrays.asList("10 Toes", "10 Fingers", "Base 10 System", "Decade has 10 years"),
            "ten", "A decade is a period of exactly 10 whole years!", "Easy", "Stage 1: Counting 0-10",
            "How many fingers do you have in total across both hands?", Arrays.asList("10", "5", "20"), 0, "5 on left + 5 on right = 10!");

        // Stage 2: Teens & Early Twenties (10 lessons)
        addL("num-11", "numbers", 12, "Number 11 (Eleven)", "ee-l-e-v-u-n", "1️⃣1️⃣",
            "11 is ten plus one more (10 + 1 = 11). The first double digit twin number!",
            Arrays.asList("11 Players on Soccer Team", "10 + 1 = 11", "Palindrome number"),
            "eleven", "A full soccer team has 11 players on the field including the goalkeeper!", "Medium", "Stage 2: Teens 11-20",
            "What is 10 + 1?", Arrays.asList("11", "12", "10"), 0, "Add 1 to 10!");

        addL("num-12", "numbers", 13, "Number 12 (Twelve / Dozen)", "t-w-e-l-v", "🥚",
            "12 is called a dozen! 12 eggs in a carton and 12 hours on a clock face.",
            Arrays.asList("12 Eggs in Dozen", "12 Months in Year", "12 Hours on Clock"),
            "twelve", "There are exactly 12 months in a calendar year from January to December!", "Medium", "Stage 2: Teens 11-20",
            "How many eggs are in one full dozen?", Arrays.asList("12", "10", "6"), 0, "A dozen is always 12!");

        addL("num-13", "numbers", 14, "Number 13 (Thirteen)", "th-er-t-ee-n", "🌟",
            "13 is ten plus three (10 + 3 = 13). Bakers call 13 a 'baker's dozen'!",
            Arrays.asList("Baker's Dozen", "10 + 3 = 13", "Prime number"),
            "thirteen", "Bakers historically gave 13 loaves instead of 12 to ensure customers got enough bread!", "Medium", "Stage 2: Teens 11-20",
            "What is 10 plus 3?", Arrays.asList("13", "14", "12"), 0, "10 + 3 = 13!");

        addL("num-14", "numbers", 15, "Number 14 (Fourteen / Fortnight)", "f-o-r-t-ee-n", "📅",
            "14 days make exactly two full weeks! Two weeks together is called a fortnight.",
            Arrays.asList("14 Days in Fortnight", "10 + 4 = 14", "7 + 7 = 14"),
            "fourteen", "Valentine's Day is celebrated on February 14th around the world!", "Medium", "Stage 2: Teens 11-20",
            "How many days are in two full weeks (7 + 7)?", Arrays.asList("14", "12", "16"), 0, "7 + 7 = 14!");

        addL("num-15", "numbers", 16, "Number 15 (Fifteen)", "f-i-f-t-ee-n", "🕒",
            "15 minutes make a quarter of an hour on a clock face (15, 30, 45, 60).",
            Arrays.asList("Quarter Hour (15 mins)", "10 + 5 = 15", "3 groups of 5"),
            "fifteen", "Three nickel coins worth 5 cents each equal 15 cents!", "Medium", "Stage 2: Teens 11-20",
            "What is 5 + 5 + 5?", Arrays.asList("15", "20", "10"), 0, "Count by 5s: 5, 10, 15!");

        addL("num-16", "numbers", 17, "Number 16 (Sixteen)", "s-i-k-s-t-ee-n", "🧁",
            "16 is a perfect square: 4 rows of 4 cupcakes make 16 (4 × 4 = 16).",
            Arrays.asList("4 × 4 = 16", "10 + 6 = 16", "Sweet Sixteen"),
            "sixteen", "There are 16 ounces in 1 pound of weight!", "Medium", "Stage 2: Teens 11-20",
            "What is 4 times 4 (4 × 4)?", Arrays.asList("16", "12", "18"), 0, "4 groups of 4!");

        addL("num-17", "numbers", 18, "Number 17 (Seventeen)", "s-e-v-u-n-t-ee-n", "⚡",
            "17 is a prime number that can only be divided evenly by 1 and itself.",
            Arrays.asList("10 + 7 = 17", "Prime Number", "Odd Number"),
            "seventeen", "Some cicada insects stay underground for exactly 17 years before emerging!", "Medium", "Stage 2: Teens 11-20",
            "What number comes between 16 and 18?", Arrays.asList("17", "15", "19"), 0, "16, 17, 18!");

        addL("num-18", "numbers", 19, "Number 18 (Eighteen)", "ay-t-ee-n", "🗳️",
            "18 is two groups of 9 (9 + 9 = 18) and three groups of 6 (3 × 6 = 18).",
            Arrays.asList("9 + 9 = 18", "10 + 8 = 18", "18 Holes in Golf"),
            "eighteen", "A standard golf course has 18 playing holes!", "Medium", "Stage 2: Teens 11-20",
            "What is 9 + 9?", Arrays.asList("18", "17", "19"), 0, "Double 9 is 18!");

        addL("num-19", "numbers", 20, "Number 19 (Nineteen)", "n-eye-n-t-ee-n", "🚀",
            "19 is the last teen number before we reach the big milestone of twenty (10 + 9 = 19).",
            Arrays.asList("10 + 9 = 19", "Prime Number", "Last teen number"),
            "nineteen", "The 19th amendment guaranteed voting rights for women in the USA!", "Medium", "Stage 2: Teens 11-20",
            "What number comes right after 18?", Arrays.asList("19", "20", "17"), 0, "18, 19, 20!");

        addL("num-20", "numbers", 21, "Number 20 (Twenty)", "t-w-e-n-t-ee", "🪙",
            "20 is two full tens! 10 fingers plus 10 toes equal twenty (10 + 10 = 20).",
            Arrays.asList("Two Tens (10 + 10)", "20 Toes & Fingers", "A Score (20 years)"),
            "twenty", "In ancient times, a 'score' was the word used for the number 20!", "Medium", "Stage 2: Teens 11-20",
            "What is 10 plus 10?", Arrays.asList("20", "15", "25"), 0, "Two tens equal 20!");

        // Stage 3: Tens Milestones to 100 & Skip Counting (5 lessons)
        addL("num-tens-50", "numbers", 22, "Counting by Tens: 30, 40, 50", "t-e-n-z", "🔟",
            "Counting by tens is like adding full stacks of 10 coins: 10, 20, 30, 40, 50!",
            Arrays.asList("30 (Thirty)", "40 (Forty)", "50 (Fifty / Half a Hundred)"),
            "fifty", "50 is exactly half of one hundred (100 ÷ 2 = 50)!", "Medium", "Stage 3: Tens to 100",
            "If you have 4 stacks of 10 coins, how many coins is that?", Arrays.asList("40", "30", "50"), 0, "4 × 10 = 40!");

        addL("num-tens-90", "numbers", 23, "Counting Higher: 60, 70, 80, 90", "h-eye-er", "📈",
            "Keep climbing by tens: 60, 70, 80, 90! Nine tens make ninety, right before 100.",
            Arrays.asList("60 (Sixty)", "70 (Seventy)", "80 (Eighty)", "90 (Ninety)"),
            "ninety", "There are 60 seconds in a minute, and 60 minutes in an hour!", "Challenge", "Stage 3: Tens to 100",
            "What number comes next when counting tens: 70, 80, ...?", Arrays.asList("90", "85", "100"), 0, "70, 80, 90!");

        addL("num-100", "numbers", 24, "Number 100 (One Hundred!)", "w-u-n-h-u-n-d-r-e-d", "💯",
            "100 is ten full groups of ten! 100 cents make a dollar, and 100 years make a century.",
            Arrays.asList("10 × 10 = 100", "100 Cents in $1", "100 Years in Century"),
            "hundred", "Water boils into hot steam at exactly 100 degrees Celsius!", "Challenge", "Stage 3: Tens to 100",
            "How many tens make one hundred?", Arrays.asList("10 tens", "5 tens", "20 tens"), 0, "10 × 10 = 100!");

        addL("num-skip", "numbers", 25, "Skip Counting Safari (2s & 5s)", "s-k-i-p", "🦘",
            "Hop like a kangaroo! Skip count by 2s: 2, 4, 6, 8, 10! Skip count by 5s: 5, 10, 15, 20, 25!",
            Arrays.asList("By 2s: 2, 4, 6, 8, 10", "By 5s: 5, 10, 15, 20", "Rhythmic math pattern"),
            "skip", "Skip counting helps you learn multiplication tables effortlessly!", "Challenge", "Stage 3: Tens to 100",
            "What number comes next when counting by 5s: 5, 10, 15, ...?", Arrays.asList("20", "18", "25"), 0, "5, 10, 15, 20!");

        addL("num-even-odd", "numbers", 26, "Even vs Odd Numbers", "ee-v-u-n-o-d", "⚖️",
            "Even numbers can be split into equal pairs of buddies (2, 4, 6, 8, 10). Odd numbers always have one left over (1, 3, 5, 7, 9)!",
            Arrays.asList("Evens: 2, 4, 6, 8, 10", "Odds: 1, 3, 5, 7, 9", "Pair sharing rule"),
            "pairs", "Any number ending in 0, 2, 4, 6, or 8 is always an even number!", "Challenge", "Stage 3: Tens to 100",
            "Which of these numbers is an even number that can make pairs?", Arrays.asList("6", "7", "9"), 0, "6 splits into two equal groups of 3!");

        // Stage 4: Number Ordering & Comparisons (3 lessons)
        addL("num-order", "numbers", 27, "Before, After & Between", "b-ee-f-o-r", "↔️",
            "On the number line: 4 comes BEFORE 5, 6 comes AFTER 5, and 5 is BETWEEN 4 and 6!",
            Arrays.asList("Before: predecessor (-1)", "After: successor (+1)", "Between: in the middle"),
            "order", "Number lines help mathematicians visualize distances and addition easily!", "Challenge", "Stage 4: Relations & Compare",
            "What number sits directly between 7 and 9?", Arrays.asList("8", "6", "10"), 0, "7, 8, 9!");

        addL("num-compare", "numbers", 28, "Greater Than, Less Than & Equal (> < =)", "g-r-ay-t-er", "🐊",
            "The hungry alligator mouth always opens wide to chomp the BIGGER number: 8 > 3! Equal sign (=) means both sides match: 5 = 5.",
            Arrays.asList("8 > 3 (Greater)", "2 < 7 (Less)", "5 = 5 (Equal)"),
            "compare", "The alligator mouth symbol '<' and '>' was invented over 400 years ago!", "Challenge", "Stage 4: Relations & Compare",
            "Which statement is true?", Arrays.asList("10 > 4", "4 > 10", "10 < 4"), 0, "10 is greater than 4!");

        addL("num-missing", "numbers", 29, "Missing Number Detective", "m-i-s-i-n-g", "🧩",
            "Be a math detective! Look at the sequence: 10, 20, __, 40. The missing number is 30!",
            Arrays.asList("Pattern recognition", "Fill in blanks", "Sequence puzzles"),
            "puzzle", "Finding patterns is the secret superpower of computer scientists and coders!", "Challenge", "Stage 4: Relations & Compare",
            "What number is missing: 2, 4, __, 8?", Arrays.asList("6", "5", "7"), 0, "2, 4, 6, 8 (counting by 2s)!");

        // Stage 5: Math Operations (4 lessons)
        addL("num-add", "numbers", 30, "Addition (+): Putting Together", "a-d-i-sh-u-n", "➕",
            "Addition means combining two groups together: 3 juicy apples plus 2 green apples equals 5 apples (3 + 2 = 5)!",
            Arrays.asList("3 + 2 = 5", "Sum / Total", "Plus sign (+)"),
            "plus", "Adding zero to any number leaves that number unchanged (7 + 0 = 7)!", "Challenge", "Stage 5: Math Operations",
            "What is 4 + 3?", Arrays.asList("7", "6", "8"), 0, "Put 4 and 3 together: 7!");

        addL("num-sub", "numbers", 31, "Subtraction (-): Taking Away", "s-u-b-t-r-a-k-t", "➖",
            "Subtraction means taking away: 6 birds sit on a fence, 2 fly away, leaving 4 birds (6 - 2 = 4)!",
            Arrays.asList("6 - 2 = 4", "Difference / Leftover", "Minus sign (-)"),
            "minus", "Subtraction is the exact inverse (opposite) of addition!", "Challenge", "Stage 5: Math Operations",
            "If you have 5 stars and spend 2 stars, how many do you have left (5 - 2)?", Arrays.asList("3", "2", "4"), 0, "5 take away 2 is 3!");

        addL("num-mul", "numbers", 32, "Multiplication (×): Fast Repeated Adding", "m-u-l-t-i-p-l-eye", "✖️",
            "Multiplication is speedy repeated adding! 3 nests with 2 eggs each is 3 × 2 = 6 eggs (2 + 2 + 2 = 6)!",
            Arrays.asList("3 × 2 = 6", "4 × 5 = 20", "Times symbol (×)"),
            "times", "Multiplying any number by 1 gives the exact same number (9 × 1 = 9)!", "Challenge", "Stage 5: Math Operations",
            "What is 2 × 4 (two groups of four)?", Arrays.asList("8", "6", "10"), 0, "4 + 4 = 8!");

        addL("num-div", "numbers", 33, "Division (÷): Fair Sharing", "d-i-v-i-zh-u-n", "➗",
            "Division means sharing items equally! If you have 6 cookies and share them equally between 2 friends, each gets 3 cookies (6 ÷ 2 = 3)!",
            Arrays.asList("6 ÷ 2 = 3", "Fair sharing", "Divide symbol (÷)"),
            "divide", "Division tells you how many equal portions can be made from a total!", "Challenge", "Stage 5: Math Operations",
            "If 8 berries are shared equally between 2 bears, how many berries does each bear get (8 ÷ 2)?", Arrays.asList("4", "2", "6"), 0, "8 split into 2 equal piles is 4!");
    }

    private void seedColors() {
        // 15 lessons
        addL("col-red", "colors", 1, "Red Ruby", "r-e-d", "🔴",
            "Red is warm, energetic, and bold like strawberries, apples, and firetrucks.",
            Arrays.asList("Strawberry", "Firetruck", "Roses", "Heart"),
            "red", "Red is the very first color a newborn human baby can perceive!", "Easy", "Primary Colors",
            "Which of these is naturally bright red?", Arrays.asList("Ripe Strawberry", "Ocean Water", "Banana"), 0, "Sweet red strawberry!");

        addL("col-blue", "colors", 2, "Blue Ocean", "b-l-oo", "🔵",
            "Blue is calm and vast like ocean waves, robin eggs, and sunny morning skies.",
            Arrays.asList("Ocean", "Sky", "Blueberry", "Blue Jay"),
            "blue", "Blue is the most universally favored favorite color in the world!", "Easy", "Primary Colors",
            "What color is a clear cloudless morning sky?", Arrays.asList("Blue", "Green", "Yellow"), 0, "A beautiful calm blue!");

        addL("col-yellow", "colors", 3, "Sunshine Yellow", "y-e-l-o", "🟡",
            "Yellow is cheerful and warm like glowing sunshine, sweet bananas, and sunflowers.",
            Arrays.asList("Sun", "Banana", "Sunflower", "School Bus"),
            "yellow", "Sunflowers actually turn their flower heads during the day to follow the sun!", "Easy", "Primary Colors",
            "Which fruit is famous for its bright yellow peel?", Arrays.asList("Banana", "Strawberry", "Blueberry"), 0, "Peelable yellow banana!");

        addL("col-green", "colors", 4, "Green Meadow", "g-r-ee-n", "🟢",
            "Green is a secondary color made by mixing Yellow and Blue! Fresh like leaves, frogs, and grass.",
            Arrays.asList("Grass", "Leaf", "Frog", "Cucumber"),
            "green", "Leaves look green because of a special pigment called chlorophyll that captures sunlight!", "Easy", "Secondary Colors",
            "What color do you get when you mix Yellow and Blue paint?", Arrays.asList("Green", "Purple", "Orange"), 0, "Yellow + Blue = Green!");

        addL("col-orange", "colors", 5, "Vibrant Orange", "o-r-i-n-j", "🟠",
            "Orange is a secondary color made by blending Red and Yellow! Like juicy oranges, pumpkins, and tigers.",
            Arrays.asList("Orange Fruit", "Pumpkin", "Carrot", "Tiger Fur"),
            "orange", "The color orange was named after the sweet citrus fruit!", "Easy", "Secondary Colors",
            "What magic color appears when you mix Red and Yellow?", Arrays.asList("Orange", "Green", "Purple"), 0, "Red + Yellow = Orange!");

        addL("col-purple", "colors", 6, "Royal Purple", "p-er-p-l", "🟣",
            "Purple is a secondary color made by mixing Red and Blue! Like sweet grapes, lavender, and amethyst gems.",
            Arrays.asList("Grape", "Lavender", "Amethyst", "Eggplant"),
            "purple", "In ancient history, purple dye was so rare and expensive that only royal kings and queens could wear it!", "Easy", "Secondary Colors",
            "What two primary colors mix together to create Purple?", Arrays.asList("Red + Blue", "Yellow + Blue", "Red + Yellow"), 0, "Red + Blue = Purple!");

        addL("col-pink", "colors", 7, "Blossom Pink", "p-i-ng-k", "🌸",
            "Pink is a cheerful tint made by blending Red with soft White! Like cherry blossoms and flamingos.",
            Arrays.asList("Cherry Blossom", "Flamingo", "Cotton Candy", "Rosebud"),
            "pink", "Flamingo birds are naturally white-gray, but turn pink from eating tiny pink brine shrimp!", "Medium", "Tints & Shades",
            "Which bird is famously known for its bright pink feathers?", Arrays.asList("Flamingo", "Penguin", "Crow"), 0, "Pink flamingo standing on one leg!");

        addL("col-brown", "colors", 8, "Earthy Brown", "b-r-ow-n", "🪵",
            "Brown is a warm earthy shade found in tree bark, garden soil, cuddly teddy bears, and chocolate.",
            Arrays.asList("Tree Bark", "Chocolate", "Soil", "Teddy Bear"),
            "brown", "Rich dark garden soil gets its brown color from decomposed organic leaves and minerals!", "Medium", "Earthy Tones",
            "Which sweet treat is naturally brown?", Arrays.asList("Chocolate", "Vanilla Ice", "Cotton Candy"), 0, "Delicious cocoa chocolate!");

        addL("col-black", "colors", 9, "Midnight Black", "b-l-a-k", "⚫",
            "Black is the deepest shade, absorbing light like the night sky between stars and sleek obsidian stone.",
            Arrays.asList("Night Sky", "Black Panther", "Shadow", "Coal"),
            "black", "Space looks black because there is no atmosphere to scatter starlight!", "Medium", "Tints & Shades",
            "What color is the nighttime sky when the sun sets?", Arrays.asList("Black / Dark", "Bright Yellow", "White"), 0, "Dark night sky!");

        addL("col-white", "colors", 10, "Pure White", "w-eye-t", "⚪",
            "White reflects all colors of light equally! Like fluffy clouds, winter snow, polar bears, and milk.",
            Arrays.asList("Snowflake", "Cloud", "Milk", "Polar Bear"),
            "white", "Sunlight looks white, but it actually contains all colors of the rainbow combined together!", "Medium", "Tints & Shades",
            "What cold winter precipitation falls from the sky as white flakes?", Arrays.asList("Snow", "Rain", "Sand"), 0, "Snowflakes!");

        addL("col-gray", "colors", 11, "Gentle Gray", "g-r-ay", "🐘",
            "Gray is made by mixing Black and White! Like rain clouds, elephant skin, dolphins, and smooth river rocks.",
            Arrays.asList("Elephant", "Dolphin", "Rain Cloud", "River Stone"),
            "gray", "An elephant's thick wrinkled gray skin helps keep it cool under hot savannah sunshine!", "Medium", "Tints & Shades",
            "Which gigantic savannah mammal has gray skin?", Arrays.asList("Elephant", "Tiger", "Giraffe"), 0, "The gentle gray elephant!");

        addL("col-cyan", "colors", 12, "Cyan / Aqua Lagoon", "s-eye-a-n", "🩵",
            "Cyan is a sparkling blend of Blue and Green! Like tropical ocean lagoons, robin eggs, and turquoise stones.",
            Arrays.asList("Tropical Lagoon", "Robin Egg", "Turquoise Gem", "Sea Glass"),
            "cyan", "In printing and computer screens, Cyan is one of the four essential base inks (CMYK)!", "Challenge", "Modern Shades",
            "Which two colors blend to create Cyan / Aqua?", Arrays.asList("Blue + Green", "Red + Yellow", "Black + White"), 0, "Blue + Green = Cyan!");

        addL("col-gold", "colors", 13, "Gleaming Gold", "g-o-l-d", "🪙",
            "Gold is a shimmering warm metallic yellow, like honeycombs, shiny treasure coins, and glowing amber.",
            Arrays.asList("Gold Coin", "Honeycomb", "Amber Gem", "Autumn Leaves"),
            "gold", "Pure gold is so malleable that a single ounce can be hammered into a 100-square-foot sheet!", "Challenge", "Modern Shades",
            "What golden sweet food do bees produce in honeycombs?", Arrays.asList("Honey", "Milk", "Juice"), 0, "Sweet golden honey!");

        addL("col-mix", "colors", 14, "Color Mixing Lab", "m-i-k-s", "🎨",
            "Primary colors (Red, Blue, Yellow) are the building blocks! Mix any two to make new secondary colors.",
            Arrays.asList("Red + Yellow = Orange", "Blue + Yellow = Green", "Red + Blue = Purple"),
            "mixing", "Artists have used the 3 primary color wheel for hundreds of years to paint masterpieces!", "Challenge", "Color Science",
            "If you mix Red and Blue, what secondary color appears?", Arrays.asList("Purple", "Green", "Yellow"), 0, "Red + Blue = Purple!");

        addL("col-warmcool", "colors", 15, "Warm vs Cool Colors", "w-o-r-m-k-oo-l", "🔥❄️",
            "Warm colors (Red, Orange, Yellow) remind us of sunshine and campfires; Cool colors (Blue, Green, Purple) remind us of water and shade.",
            Arrays.asList("Warm: Red, Orange, Yellow", "Cool: Blue, Green, Purple", "Emotional tone in art"),
            "temperatures", "Cool colors make small rooms feel larger, while warm colors create cozy comforting spaces!", "Challenge", "Color Science",
            "Which color group includes Ocean Blue and Forest Green?", Arrays.asList("Cool Colors", "Warm Colors", "Metallic Colors"), 0, "Blue and Green are cool colors!");
    }

    private void seedShapes() {
        // 17 lessons (12 2D shapes + 5 3D shapes)
        addL("shp-circle", "shapes", 1, "Circle (2D)", "s-er-k-l", "⭕",
            "A circle is completely round all around with 0 straight sides and 0 sharp corners.",
            Arrays.asList("Clock", "Dinner Plate", "Wheel", "Full Moon"),
            "circle", "The wheel was shaped like a circle so carts could roll smoothly without bumping!", "Easy", "2D Shapes",
            "How many corners does a round circle have?", Arrays.asList("0 corners", "4 corners", "3 corners"), 0, "Circles have zero corners!");

        addL("shp-square", "shapes", 2, "Square (2D)", "s-k-w-air", "⬛",
            "A square has 4 straight sides that are all the exact same length, and 4 right-angle corners.",
            Arrays.asList("Building Block", "Window Pane", "Chessboard", "Gift Box"),
            "square", "All 4 internal angles of a square are 90-degree right angles!", "Easy", "2D Shapes",
            "How many equal sides does a square have?", Arrays.asList("4 sides", "3 sides", "5 sides"), 0, "A square has 4 equal sides!");

        addL("shp-triangle", "shapes", 3, "Triangle (2D)", "t-r-eye-ang-l", "🔺",
            "A triangle has 3 straight sides and 3 pointy vertices (corners). It is the strongest shape in architecture!",
            Arrays.asList("Pizza Slice", "Sailboat Sail", "Mountain Peak", "Roof Truss"),
            "triangle", "Triangles are used to build bridges because they distribute weight without bending!", "Easy", "2D Shapes",
            "How many pointy corners does a triangle have?", Arrays.asList("3 corners", "4 corners", "2 corners"), 0, "Tri means 3: 3 corners!");

        addL("shp-rectangle", "shapes", 4, "Rectangle (2D)", "r-e-k-t-ang-l", "🚪",
            "A rectangle has 4 sides and 4 corners. Its opposite sides are parallel and equal in length.",
            Arrays.asList("Doorway", "Smartphone Screen", "Book Cover", "Dollar Bill"),
            "rectangle", "Most books and doors are rectangles because it makes them easy to hold and walk through!", "Easy", "2D Shapes",
            "Which household object is shaped like a rectangle?", Arrays.asList("Door", "Clock", "Ball"), 0, "A doorway is a tall rectangle!");

        addL("shp-oval", "shapes", 5, "Oval (2D)", "o-v-u-l", "🥚",
            "An oval looks like a stretched circle with curved boundaries and 0 sharp corners.",
            Arrays.asList("Chicken Egg", "Running Track", "Watermelon Outline", "Wall Mirror"),
            "oval", "The word oval comes from the Latin word 'ovum', which means egg!", "Easy", "2D Shapes",
            "Which breakfast item has an oval shape?", Arrays.asList("Egg", "Toast Slice", "Waffle"), 0, "An egg is an oval!");

        addL("shp-diamond", "shapes", 6, "Diamond / Rhombus (2D)", "d-eye-u-m-u-n-d", "🪁",
            "A rhombus has 4 equal straight sides slanted like a flying diamond kite in the wind.",
            Arrays.asList("Kite", "Road Warning Sign", "Playing Card Diamond", "Baseball Infield"),
            "diamond", "The infield in baseball is called a diamond because the 4 bases form a rhombus!", "Medium", "2D Shapes",
            "Which flying windy day toy is shaped like a diamond?", Arrays.asList("Kite", "Ball", "Frisbee"), 0, "A colorful diamond kite!");

        addL("shp-pentagon", "shapes", 7, "Pentagon (2D)", "p-e-n-t-u-g-o-n", "⬟",
            "A pentagon has 5 straight sides and 5 vertices. Penta means five in ancient Greek!",
            Arrays.asList("Soccer Ball Black Patches", "Doghouse Front", "School Crossing Sign"),
            "pentagon", "Traditional soccer balls use 12 black pentagons stitched with 20 white hexagons!", "Medium", "2D Shapes",
            "How many sides does a pentagon have?", Arrays.asList("5 sides", "6 sides", "8 sides"), 0, "Penta means 5!");

        addL("shp-hexagon", "shapes", 8, "Hexagon (2D)", "h-e-k-s-u-g-o-n", "⬡",
            "A hexagon has 6 straight sides and 6 vertices. Hexa means six!",
            Arrays.asList("Bee Honeycomb Cell", "Snowflake Crystal", "Metal Nut Bolt"),
            "hexagon", "Honeybees build hexagons because it is the most efficient shape to store honey with least wax!", "Medium", "2D Shapes",
            "Which buzzing insects build hexagonal cells in hives?", Arrays.asList("Honeybees", "Ants", "Butterflies"), 0, "Clever honeybees!");

        addL("shp-octagon", "shapes", 9, "Octagon (2D)", "o-k-t-u-g-o-n", "🛑",
            "An octagon has 8 straight sides and 8 vertices. Octa means eight, just like an octopus has 8 arms!",
            Arrays.asList("Red STOP Sign", "Umbrella Canopy", "Gazebo Roof"),
            "octagon", "Red STOP signs on roads are octagons so drivers can recognize them from any angle!", "Medium", "2D Shapes",
            "Which street sign that tells cars to stop is an octagon?", Arrays.asList("STOP sign", "Speed limit", "One way"), 0, "The red STOP sign!");

        addL("shp-star", "shapes", 10, "Star (2D)", "s-t-ar", "⭐",
            "A classic 5-pointed star has 10 straight edge lines and 5 sharp points reaching outwards.",
            Arrays.asList("Night Sky Star", "Sea Star", "Gold Award Badge", "Holiday Tree Topper"),
            "star", "Starfish can regrow lost arms if they are injured by ocean waves!", "Medium", "2D Shapes",
            "How many outer points does a classic star badge have?", Arrays.asList("5 points", "3 points", "8 points"), 0, "5 sparkling points!");

        addL("shp-heart", "shapes", 11, "Heart (2D)", "h-ar-t", "❤️",
            "A heart shape has two smooth curved top lobes that taper down to a single bottom point.",
            Arrays.asList("Valentine Card", "Strawberry Top", "Kindness Symbol"),
            "heart", "The heart shape has symbolized love, friendship, and affection for over 700 years!", "Medium", "2D Shapes",
            "What wonderful emotion does the heart shape symbolize?", Arrays.asList("Love & Friendship", "Angry storm", "Sleepiness"), 0, "Love and caring!");

        addL("shp-crescent", "shapes", 12, "Crescent (2D)", "k-r-e-s-e-n-t", "🌙",
            "A crescent has two smooth curved arcs tapering to sharp tips, like the moon in early phase.",
            Arrays.asList("Crescent Moon", "Banana Curve", "Croissant Pastry"),
            "crescent", "The crescent moon occurs when only a thin sliver of the moon's sunlit side faces Earth!", "Medium", "2D Shapes",
            "Which night sky object sometimes looks like a glowing crescent?", Arrays.asList("The Moon", "The Sun", "A Cloud"), 0, "The crescent moon!");

        // 3D Solids
        addL("shp-sphere", "shapes", 13, "Sphere (3D Solid)", "s-f-eer", "⚽",
            "A sphere is a perfectly round 3D ball in all directions. It has 1 continuous curved surface and 0 edges.",
            Arrays.asList("Soccer Ball", "Planet Earth", "Glass Marble", "Orange Fruit"),
            "sphere", "Planet Earth is a giant sphere spinning gently in outer space!", "Challenge", "3D Shapes",
            "Which of these objects is a 3D sphere?", Arrays.asList("Soccer Ball", "Shoebox", "Ice Cream Cone"), 0, "A round soccer ball!");

        addL("shp-cube", "shapes", 14, "Cube (3D Solid)", "k-y-oo-b", "🎲",
            "A cube has 6 square faces of equal size, 12 straight edges, and 8 corner vertices.",
            Arrays.asList("Playing Die", "Ice Cube", "Rubik's Cube", "Cardboard Box"),
            "cube", "Every side face of a cube is a perfect 2D square!", "Challenge", "3D Shapes",
            "How many flat square faces does a playing die cube have?", Arrays.asList("6 faces", "4 faces", "8 faces"), 0, "A cube has 6 faces!");

        addL("shp-cylinder", "shapes", 15, "Cylinder (3D Solid)", "s-i-l-i-n-d-er", "🥫",
            "A cylinder has 2 flat circular faces on top and bottom, connected by 1 smooth curved side.",
            Arrays.asList("Soup Can", "AA Battery", "Tree Log", "Drinking Glass"),
            "cylinder", "Cylinders are used for food cans because the round curved sides resist denting under pressure!", "Challenge", "3D Shapes",
            "Which kitchen food container is shaped like a cylinder?", Arrays.asList("Soup Can", "Pizza Box", "Banana"), 0, "A round soup can!");

        addL("shp-cone", "shapes", 16, "Cone (3D Solid)", "k-o-n", "🍦",
            "A cone has 1 flat circular base on the bottom, with curved sides tapering up to a sharp tip (apex).",
            Arrays.asList("Ice Cream Waffle Cone", "Party Birthday Hat", "Traffic Cone", "Volcano"),
            "cone", "Traffic cones are bright orange so drivers can see road work from far away!", "Challenge", "3D Shapes",
            "Which birthday party headwear is shaped like a cone?", Arrays.asList("Party Hat", "Baseball Cap", "Scarf"), 0, "A pointy party hat!");

        addL("shp-pyramid", "shapes", 17, "Pyramid (3D Solid)", "p-i-r-u-m-i-d", "⛺",
            "A pyramid has a flat polygon base with triangular side faces meeting together at a top peak point.",
            Arrays.asList("Camping Tent", "Great Pyramid of Giza", "Roof Peak"),
            "pyramid", "The ancient Egyptian Pyramids of Giza have stood tall for over 4,500 years!", "Challenge", "3D Shapes",
            "Which famous ancient stone structures in Egypt are shaped like pyramids?", Arrays.asList("Pyramids of Giza", "Eiffel Tower", "Colosseum"), 0, "The Pyramids of Giza!");
    }

    private void seedAnimals() {
        // 30 lessons (Mammals, Ocean, Birds, Farm)
        addL("ani-lion", "animals", 1, "African Lion", "l-eye-u-n", "🦁",
            "The lion is the King of the Jungle! Living in savannah family groups called prides.",
            Arrays.asList("Savannah", "Carnivore", "Pride", "Roar"),
            "lion", "A lion's mighty roar can be heard across 5 whole miles (8 km)!", "Easy", "Savannah Mammals",
            "What is a family group of lions called?", Arrays.asList("A Pride", "A Herd", "A School"), 0, "Lions live in a pride!");

        addL("ani-elephant", "animals", 2, "African Elephant", "e-l-e-f-u-n-t", "🐘",
            "Elephants are the largest land mammals. They have gentle spirits, huge ears, and long dexterous trunks.",
            Arrays.asList("Grassland", "Herbivore", "Trunk", "Tusks"),
            "elephant", "Elephants comfort each other by gently stroking trunks and rumbling softly!", "Easy", "Savannah Mammals",
            "How many muscles are in an elephant's trunk?", Arrays.asList("Over 40,000", "About 100", "None"), 0, "Over 40,000 muscles!");

        addL("ani-tiger", "animals", 3, "Bengal Tiger", "t-eye-g-er", "🐯",
            "Tigers are the largest wild cats with striking orange coats and black camouflage stripes.",
            Arrays.asList("Dense Jungle", "Carnivore", "Swimmer", "Stripes"),
            "tiger", "Unlike most house cats, wild tigers love water and are fantastic river swimmers!", "Easy", "Wild Cats",
            "Do tigers like swimming in rivers?", Arrays.asList("Yes, they love swimming!", "No, they hate water", "Only in winter"), 0, "Tigers are great swimmers!");

        addL("ani-giraffe", "animals", 4, "Savannah Giraffe", "j-i-r-a-f", "🦒",
            "Giraffes are the tallest mammals on Earth, using long purplish tongues to eat acacia leaves.",
            Arrays.asList("Acacia Woods", "Herbivore", "Tall Neck", "Spotted"),
            "giraffe", "A giraffe sleeps only about 30 minutes to 2 hours a day in short naps!", "Easy", "Savannah Mammals",
            "Why do giraffes have long necks?", Arrays.asList("To reach high treetops", "To swim deep", "To dig tunnels"), 0, "To browse high acacia leaves!");

        addL("ani-zebra", "animals", 5, "Plains Zebra", "z-ee-b-r-u", "🦓",
            "Zebras are wild horses roaming African grasslands in herds with dazzling striped coats.",
            Arrays.asList("Grassland", "Herbivore", "Stripes", "Herd"),
            "zebra", "Every zebra has a unique pattern of stripes like a barcode or fingerprint!", "Easy", "Savannah Mammals",
            "What colors are a zebra's stripes?", Arrays.asList("Black and White", "Red and Blue", "Green and Yellow"), 0, "Classic black and white stripes!");

        addL("ani-monkey", "animals", 6, "Rainforest Monkey", "m-u-ng-k-ee", "🐒",
            "Monkeys swing through forest canopies using agile arms and grasping prehensile tails.",
            Arrays.asList("Rainforest", "Omnivore", "Swing", "Troop"),
            "monkey", "Some monkeys can use tools like stones to crack open tough jungle nuts!", "Easy", "Jungle Mammals",
            "What do monkeys use to balance while swinging?", Arrays.asList("Tail", "Ears", "Whiskers"), 0, "Their flexible tail!");

        addL("ani-kangaroo", "animals", 7, "Red Kangaroo", "k-a-ng-g-u-r-oo", "🦘",
            "Kangaroos hop across the Australian outback on powerful legs, carrying joeys in mom's pouch.",
            Arrays.asList("Australian Outback", "Herbivore", "Pouch", "Hopper"),
            "kangaroo", "Kangaroos cannot walk backwards because of their large muscular tail and feet!", "Easy", "Marsupials",
            "Where does a mother kangaroo carry her baby joey?", Arrays.asList("In her pouch", "On her head", "In a backpack"), 0, "In her cozy pouch!");

        addL("ani-koala", "animals", 8, "Fluffy Koala", "k-o-ah-l-u", "🐨",
            "Koalas are sleepy tree-dwellers who eat fresh eucalyptus leaves and snooze 18 hours a day.",
            Arrays.asList("Eucalyptus Forest", "Herbivore", "Climber", "Pouch"),
            "koala", "Koalas rarely drink water because juicy eucalyptus leaves provide all their hydration!", "Easy", "Marsupials",
            "What leaves do koalas love to eat?", Arrays.asList("Eucalyptus leaves", "Pine needles", "Grass"), 0, "Fresh eucalyptus leaves!");

        addL("ani-panda", "animals", 9, "Giant Panda", "p-a-n-d-u", "🐼",
            "Giant Pandas are gentle black-and-white bears living in misty bamboo mountain forests.",
            Arrays.asList("Bamboo Mountains", "Herbivore", "Black & White", "Climber"),
            "panda", "A panda can spend up to 12 hours a day munching up to 30 pounds of bamboo!", "Medium", "Bears & Forest",
            "What is a panda's favorite food?", Arrays.asList("Bamboo", "Fish", "Pizza"), 0, "Crunchy green bamboo!");

        addL("ani-bear", "animals", 10, "Grizzly Brown Bear", "b-air", "🐻",
            "Bears are strong forest dwellers that catch salmon in rivers and hibernate during cold winters.",
            Arrays.asList("North Woods", "Omnivore", "Hibernation", "Claws"),
            "bear", "During winter hibernation, a bear's heart slows from 40 beats a minute down to just 8!", "Medium", "Bears & Forest",
            "What do bears do during cold snowy winter months?", Arrays.asList("Hibernate and sleep", "Fly south", "Swim to beach"), 0, "They hibernate!");

        addL("ani-wolf", "animals", 11, "Gray Wolf", "w-oo-l-f", "🐺",
            "Wolves live and hunt together in loyal family packs, communicating with haunting howls.",
            Arrays.asList("Tundra & Forest", "Carnivore", "Pack", "Howl"),
            "wolf", "A wolf howl can be heard by other pack members across 10 miles of open tundra!", "Medium", "Canines",
            "Why do wolves howl together at night?", Arrays.asList("To communicate with their pack", "Because they are singing", "To scare birds"), 0, "To talk with their pack!");

        addL("ani-fox", "animals", 12, "Red Fox (Lumi's Cousin!)", "f-o-k-s", "🦊",
            "Foxes are clever, agile woodland animals with bushy tails and sharp hearing.",
            Arrays.asList("Woodland", "Omnivore", "Bushy Tail", "Clever"),
            "fox", "A fox's bushy tail is called a 'brush' and helps it balance when leaping into snowdrifts!", "Medium", "Canines",
            "What is a fox's fluffy tail called?", Arrays.asList("A brush", "A broom", "A fan"), 0, "A brush!");

        addL("ani-dolphin", "animals", 13, "Bottlenose Dolphin", "d-o-l-f-i-n", "🐬",
            "Dolphins are playful, super smart marine mammals that leap through waves and click to communicate.",
            Arrays.asList("Ocean Waters", "Fish Eater", "Pod", "Echolocation"),
            "dolphin", "Dolphins have individual signature whistles that act just like human names!", "Medium", "Ocean Creatures",
            "How do dolphins recognize each other?", Arrays.asList("Unique signature whistles", "By counting fins", "By reading tags"), 0, "Each dolphin has a unique whistle!");

        addL("ani-whale", "animals", 14, "Blue Whale", "w-ay-l", "🐋",
            "The Blue Whale is the largest animal ever known to have lived on Earth—even bigger than dinosaurs!",
            Arrays.asList("Deep Ocean", "Filter Feeder (Krill)", "Baleen", "Giant"),
            "whale", "A blue whale's tongue alone weighs as much as an entire adult elephant!", "Medium", "Ocean Creatures",
            "What is the largest animal in the entire world?", Arrays.asList("Blue Whale", "Elephant", "T-Rex"), 0, "The mighty Blue Whale!");

        addL("ani-octopus", "animals", 15, "Clever Octopus", "o-k-t-u-p-u-s", "🐙",
            "The octopus has 8 flexible suction-cup arms, 3 hearts, blue blood, and can change colors in a flash.",
            Arrays.asList("Coral Reef", "Crab Hunter", "Camouflage", "3 Hearts"),
            "octopus", "An octopus has no bones, so it can squeeze through any hole larger than its small beak!", "Medium", "Ocean Creatures",
            "How many hearts does an octopus have?", Arrays.asList("3 hearts", "1 heart", "5 hearts"), 0, "An octopus has 3 hearts!");

        addL("ani-turtle", "animals", 16, "Sea Turtle", "t-er-t-l", "🐢",
            "Sea turtles have flippers for ocean gliding and hard shells to protect them from ocean waves.",
            Arrays.asList("Tropical Oceans", "Herbivore / Jellyfish", "Flipper", "Ancient"),
            "turtle", "Sea turtles navigate thousands of miles across open ocean using Earth's magnetic field!", "Medium", "Ocean Creatures",
            "What do sea turtles use to paddle through waves?", Arrays.asList("Flippers", "Wings", "Paws"), 0, "Strong ocean flippers!");

        addL("ani-clownfish", "animals", 17, "Clownfish", "k-l-ow-n-f-i-sh", "🐠",
            "Bright orange with white stripes, clownfish live safely among the stinging tentacles of sea anemones.",
            Arrays.asList("Coral Reef", "Plankton Eater", "Symbiosis", "Stripes"),
            "clownfish", "A special mucus layer protects clownfish from getting stung by their host anemone!", "Medium", "Ocean Creatures",
            "Where does a clownfish make its safe home?", Arrays.asList("Inside sea anemones", "In tree branches", "Under river rocks"), 0, "Inside sea anemones!");

        addL("ani-penguin", "animals", 18, "Emperor Penguin", "p-e-ng-g-w-i-n", "🐧",
            "Penguins are flightless birds who glide underwater like torpedoes and huddle together against Antarctic blizzards.",
            Arrays.asList("Antarctic Ice", "Fish & Krill", "Huddle", "Swimmer"),
            "penguin", "Father emperor penguins balance a single precious egg on their warm feet for two whole months!", "Medium", "Birds of Nature",
            "Can penguins fly in the air?", Arrays.asList("No, but they swim underwater!", "Yes, very high", "Only on sunny days"), 0, "They fly through water!");

        addL("ani-eagle", "animals", 19, "Bald Eagle", "ee-g-l", "🦅",
            "The eagle is a magnificent bird of prey with razor-sharp eyesight that can spot a fish from a mile away.",
            Arrays.asList("Lakes & Mountains", "Carnivore (Fish)", "Soar", "Sharp Talons"),
            "eagle", "An eagle's eyesight is roughly 4 to 8 times sharper than that of a human!", "Challenge", "Birds of Nature",
            "How sharp is an eagle's vision compared to humans?", Arrays.asList("4 to 8 times sharper", "The same", "Blurry"), 0, "Up to 8 times sharper!");

        addL("ani-owl", "animals", 20, "Barn Owl", "ow-l", "🦉",
            "Owls fly completely silently through the night with special fringed feathers and huge light-gathering eyes.",
            Arrays.asList("Woodlands & Barns", "Nocturnal Hunter", "Silent Wings", "Rotate Head"),
            "owl", "An owl's silent flight allows it to sneak up quietly on field mice in total darkness!", "Challenge", "Birds of Nature",
            "Why are owls able to fly silently in the dark?", Arrays.asList("Special fringed soft feathers", "They have tiny engines", "They fly very fast"), 0, "Soft fringed feathers quiet the air!");

        addL("ani-parrot", "animals", 21, "Scarlet Macaw Parrot", "p-a-r-u-t", "🦜",
            "Parrots have rainbow feathers, curved nut-cracking beaks, and can mimic human words and songs.",
            Arrays.asList("Tropical Rainforest", "Seeds & Fruit", "Curved Beak", "Mimic Words"),
            "parrot", "Some smart pet parrots have vocabularies of several hundred human words!", "Challenge", "Birds of Nature",
            "What can smart parrots learn to do with their voices?", Arrays.asList("Mimic words and sounds", "Bark like a dog", "Breathe underwater"), 0, "Mimic words!");

        addL("ani-flamingo", "animals", 22, "Pink Flamingo", "f-l-u-m-i-ng-g-o", "🦩",
            "Flamingos are tall pink wading birds that stand balanced on one skinny leg in shallow saltwater lakes.",
            Arrays.asList("Salt Lakes & Lagoons", "Brine Shrimp", "One-Leg Stand", "Curved Bill"),
            "flamingo", "Standing on one leg saves body heat and uses almost zero muscular effort for flamingos!", "Challenge", "Birds of Nature",
            "How do flamingos usually stand while resting in water?", Arrays.asList("On one leg", "Lying down", "Upside down"), 0, "Balanced on one leg!");

        addL("ani-peacock", "animals", 23, "Indian Peacock", "p-ee-k-o-k", "🦚",
            "Male peacocks show off magnificent train feathers shimmering with iridescent green and turquoise eyespots.",
            Arrays.asList("Forest & Gardens", "Omnivore", "Feather Fan", "Eyespots"),
            "peacock", "A peacock's fan of tail feathers can span over 5 feet wide across!", "Challenge", "Birds of Nature",
            "What pattern shimmers on a peacock's fan feathers?", Arrays.asList("Rainbow eyespots", "Chevrons", "Polka dots"), 0, "Iridescent eyespots!");

        addL("ani-hummingbird", "animals", 24, "Ruby Hummingbird", "h-u-m-i-ng-b-er-d", "🐦",
            "Hummingbirds are tiny jewel-like fliers that beat wings 80 times per second and can fly backwards!",
            Arrays.asList("Gardens & Flowers", "Nectar Drinker", "Hover", "Fast Wings"),
            "hummingbird", "Hummingbirds are the only birds capable of flying backwards and hovering upside down!", "Challenge", "Birds of Nature",
            "What unique flying trick can hummingbirds perform?", Arrays.asList("Fly backwards and hover", "Swim under ice", "Walk on water"), 0, "Fly backwards!");

        addL("ani-swan", "animals", 25, "Mute Swan", "s-w-o-n", "🦢",
            "Swans glide gracefully across peaceful freshwater lakes with long curved necks and pure white plumage.",
            Arrays.asList("Lakes & Ponds", "Water Plants", "Graceful Neck", "Mate for Life"),
            "swan", "A pair of swans often mate for life and form a heart shape with their curved necks!", "Challenge", "Birds of Nature",
            "What shape do two swans' curved necks often form?", Arrays.asList("A heart shape", "A square", "A circle"), 0, "A lovely heart shape!");

        addL("ani-dog", "animals", 26, "Playful Puppy Dog", "d-o-g", "🐶",
            "Dogs are loyal companions with wagging tails, keen hearing, and a sense of smell 10,000 times sharper than ours.",
            Arrays.asList("Family Homes", "Omnivore", "Wagging Tail", "Loyal Buddy"),
            "dog", "Dogs communicate happiness by wagging their tail and tilting their ears curiously!", "Challenge", "Farm & Friendly Friends",
            "How do dogs show they are happy and excited to see you?", Arrays.asList("Wagging their tail", "Hissing", "Sleeping"), 0, "Wagging their tail!");

        addL("ani-cat", "animals", 27, "Curious House Cat", "k-a-t", "🐱",
            "Cats have flexible spines, night-vision eyes, sensitive whiskers, and purr warmly when cozy.",
            Arrays.asList("Family Homes", "Carnivore", "Purring", "Agile Climber"),
            "cat", "A cat's whiskers are tuned to detect tiny air currents and gauge narrow openings!", "Challenge", "Farm & Friendly Friends",
            "What sound does a content cat make when snuggling?", Arrays.asList("Purr-purr", "Roar", "Quack"), 0, "A warm soothing purr!");

        addL("ani-horse", "animals", 28, "Pasture Horse", "h-o-r-s", "🐴",
            "Horses run gracefully on hooves up to 40 mph, eating meadow hay and communicating with gentle neighs.",
            Arrays.asList("Farm Pasture", "Herbivore", "Gallop", "Hooves"),
            "horse", "Horses have the largest eyes of any land mammal, giving them almost 360-degree vision!", "Challenge", "Farm & Friendly Friends",
            "What do horses eat in farm fields?", Arrays.asList("Hay and Grass", "Fish", "Meat"), 0, "Fresh grass and hay!");

        addL("ani-sheep", "animals", 29, "Fluffy Sheep", "sh-ee-p", "🐑",
            "Sheep graze peacefully on green hillsides, growing warm wool coats that are sheared in spring.",
            Arrays.asList("Meadow Farm", "Herbivore", "Wool Coat", "Flock"),
            "sheep", "Wool sheared from sheep naturally repels water and keeps people warm even when damp!", "Challenge", "Farm & Friendly Friends",
            "What soft material is spun from sheep wool to make winter sweaters?", Arrays.asList("Warm wool yarn", "Silk", "Paper"), 0, "Wool yarn!");

        addL("ani-rabbit", "animals", 30, "Hop-Hop Rabbit", "r-a-b-i-t", "🐰",
            "Rabbits have twitching noses, long perked ears that detect sounds, and powerful hind legs for hopping.",
            Arrays.asList("Burrows & Fields", "Herbivore", "Long Ears", "Hopper"),
            "rabbit", "A happy rabbit does an acrobatic leap and twist in the air called a 'binky'!", "Challenge", "Farm & Friendly Friends",
            "What is a rabbit's joyous acrobatic hop called?", Arrays.asList("A binky", "A somersault", "A high five"), 0, "A binky!");
    }

    private void seedFruitsVeggies() {
        // 22 lessons (12 fruits + 10 vegetables)
        addL("frt-apple", "fruits-veggies", 1, "Crisp Apple", "a-p-l", "🍎",
            "Apples grow in orchard trees in red, green, and golden varieties. Rich in crisp dietary fiber and Vitamin C.",
            Arrays.asList("Orchard Tree", "Fruit", "Fiber & Vitamin C", "Crisp & Sweet"),
            "apple", "There are more than 7,500 varieties of apples grown throughout the world!", "Easy", "Juicy Fruits",
            "Where do sweet apples grow?", Arrays.asList("On orchard trees", "Underground", "In rivers"), 0, "On apple trees!");

        addL("frt-banana", "fruits-veggies", 2, "Sweet Banana", "b-u-n-a-n-u", "🍌",
            "Bananas grow in sunny tropical hanging bunches. Packed with healthy potassium for playtime energy.",
            Arrays.asList("Tropical Plant", "Fruit", "Potassium Booster", "Easy to Peel"),
            "banana", "Bananas naturally curve upwards toward the sun as they grow—a process called negative geotropism!", "Easy", "Juicy Fruits",
            "Why do bananas curve upwards as they grow?", Arrays.asList("They reach toward the sun", "From wind", "Heavy rain"), 0, "Reaching toward sunlight!");

        addL("frt-strawberry", "fruits-veggies", 3, "Ruby Strawberry", "s-t-r-aw-b-e-r-ee", "🍓",
            "Strawberries are delicious red heart-shaped berries packed with immune-boosting Vitamin C.",
            Arrays.asList("Garden Berry Patch", "Fruit", "Vitamin C", "Outside Seeds"),
            "strawberry", "Strawberries are the only fruit that wear their seeds on the outside—about 200 tiny seeds per berry!", "Easy", "Juicy Fruits",
            "Where do strawberries wear their tiny seeds?", Arrays.asList("On the outside skin", "In the center core", "They have none"), 0, "Right on the outside!");

        addL("frt-orange", "fruits-veggies", 4, "Citrus Orange", "o-r-i-n-j", "🍊",
            "Oranges are juicy citrus fruits bursting with refreshing juice and Vitamin C to fight winter colds.",
            Arrays.asList("Citrus Grove", "Fruit", "Immunity Hero", "Juicy Slices"),
            "orange", "Around 85% of all oranges harvested worldwide are squeezed into delicious breakfast orange juice!", "Easy", "Juicy Fruits",
            "What vitamin is famous for being in fresh oranges?", Arrays.asList("Vitamin C", "Vitamin D", "Iron"), 0, "Vitamin C!");

        addL("frt-watermelon", "fruits-veggies", 5, "Picnic Watermelon", "w-aw-t-er-m-e-l-u-n", "🍉",
            "Watermelons have green striped rinds and sweet pink-red flesh that is 92% pure hydrating water.",
            Arrays.asList("Garden Vine", "Fruit", "Hydrating Snack", "Summer Picnic"),
            "watermelon", "Watermelon is both a fruit and a vegetable—it is related to cucumbers, pumpkins, and squash!", "Easy", "Juicy Fruits",
            "What percentage of a watermelon is pure water?", Arrays.asList("92% water", "50% water", "10% water"), 0, "92% hydrating water!");

        addL("frt-mango", "fruits-veggies", 6, "Tropical Mango", "m-a-ng-g-o", "🥭",
            "Called the 'King of Fruits', mangoes have golden juicy flesh packed with sweet tropical flavor and Vitamin A.",
            Arrays.asList("Tropical Tree", "Fruit", "King of Fruits", "Vitamin A"),
            "mango", "Mango trees can grow over 100 feet tall and live for more than 300 years while still bearing fruit!", "Easy", "Juicy Fruits",
            "What regal nickname is given to the sweet mango?", Arrays.asList("King of Fruits", "Queen of Berries", "Prince Melon"), 0, "King of Fruits!");

        addL("frt-grapes", "fruits-veggies", 7, "Vine Grapes", "g-r-ay-p-s", "🍇",
            "Grapes grow in clustered bunches on twisting vines. They come in purple, red, and green colors.",
            Arrays.asList("Vineyard", "Fruit", "Snack Bunches", "Dried into Raisins"),
            "grapes", "When grapes are dried in the warm sun, they turn into sweet chewy raisins!", "Medium", "Juicy Fruits",
            "What do grapes turn into when gently dried in the sun?", Arrays.asList("Raisins", "Pickles", "Chips"), 0, "Sweet raisins!");

        addL("frt-pineapple", "fruits-veggies", 8, "Spiky Pineapple", "p-eye-n-a-p-l", "🍍",
            "Pineapples wear spiky green crowns and have golden sweet-tart flesh rich in digestive enzymes.",
            Arrays.asList("Tropical Plant", "Fruit", "Bromelain Enzyme", "Spiky Crown"),
            "pineapple", "It takes nearly two whole years for a single pineapple plant to grow and produce one pineapple fruit!", "Medium", "Juicy Fruits",
            "What sits proudly on top of a pineapple like a hat?", Arrays.asList("A spiky green crown", "A red feather", "A ribbon"), 0, "A spiky green crown!");

        addL("frt-blueberry", "fruits-veggies", 9, "Super Blueberry", "b-l-oo-b-e-r-ee", "🫐",
            "Blueberries are small deep-blue power berries rich in antioxidants that help your brain remember things.",
            Arrays.asList("Bush Shrub", "Fruit", "Brain Health", "Pancake Topping"),
            "blueberry", "Blueberries are one of the very few naturally blue foods found on planet Earth!", "Medium", "Juicy Fruits",
            "Which body part benefits from blueberry antioxidants?", Arrays.asList("Brain & Memory", "Knees", "Elbows"), 0, "Brain and memory!");

        addL("frt-peach", "fruits-veggies", 10, "Fuzzy Peach", "p-ee-ch", "🍑",
            "Peaches have velvety fuzzy skins, sweet fragrant nectar, and a protective stone pit inside.",
            Arrays.asList("Orchard Tree", "Fruit", "Velvet Fuzz", "Stone Pit"),
            "peach", "The fuzzy skin on a peach helps protect the delicate fruit from raindrops and insects!", "Medium", "Juicy Fruits",
            "What covers the outside of a peach to protect it?", Arrays.asList("Soft velvety fuzz", "Hard shell", "Spikes"), 0, "Soft velvety fuzz!");

        addL("frt-kiwi", "fruits-veggies", 11, "Emerald Kiwi", "k-ee-w-ee", "🥝",
            "Kiwis have fuzzy brown skin on the outside and bright green jewel flesh with tiny black seeds inside.",
            Arrays.asList("Climbing Vine", "Fruit", "Tiny Black Seeds", "Vitamin C Star"),
            "kiwi", "A single small kiwi fruit contains more Vitamin C than an entire medium orange!", "Medium", "Juicy Fruits",
            "What color is the inside flesh of a ripe kiwi?", Arrays.asList("Bright emerald green", "Purple", "Blue"), 0, "Bright emerald green!");

        addL("frt-papaya", "fruits-veggies", 12, "Sunrise Papaya", "p-u-p-eye-u", "🍈",
            "Papayas have sunny orange flesh surrounding peppery black seeds. They contain papain enzymes.",
            Arrays.asList("Tropical Tree", "Fruit", "Digestive Health", "Sunrise Orange"),
            "papaya", "Papaya seeds are completely edible and taste slightly peppery like mustard seeds!", "Medium", "Juicy Fruits",
            "What enzyme in papaya helps our tummy digest food easily?", Arrays.asList("Papain enzyme", "Sugar", "Salt"), 0, "Papain enzyme!");

        // Vegetables (10 lessons)
        addL("veg-carrot", "fruits-veggies", 13, "Crunchy Carrot", "k-a-r-u-t", "🥕",
            "Carrots grow underground as sweet crunchy taproots rich in Vitamin A (beta-carotene) for sharp eyesight.",
            Arrays.asList("Underground Root", "Vegetable", "Beta-Carotene", "Sharp Vision"),
            "carrot", "Originally, almost all carrots were purple and yellow before orange carrots became popular in Holland!", "Medium", "Garden Vegetables",
            "What vitamin in carrots helps us have sharp clear vision?", Arrays.asList("Vitamin A", "Vitamin B", "Vitamin D"), 0, "Vitamin A!");

        addL("veg-broccoli", "fruits-veggies", 14, "Mighty Broccoli", "b-r-o-k-u-l-ee", "🥦",
            "Broccoli looks like miniature edible green trees! Packed with calcium for strong bones and fiber for digestion.",
            Arrays.asList("Garden Plant", "Vegetable", "Calcium for Bones", "Mini Green Trees"),
            "broccoli", "The word broccoli comes from the Italian word 'broccolo', which means cabbage sprout!", "Medium", "Garden Vegetables",
            "What does a broccoli stalk look like?", Arrays.asList("A mini green tree", "A giant flower", "A round coin"), 0, "A miniature green tree!");

        addL("veg-tomato", "fruits-veggies", 15, "Garden Tomato", "t-u-m-ay-t-o", "🍅",
            "Botanically a fruit because it grows from yellow flowers and holds seeds, tomatoes are used as savory veggies.",
            Arrays.asList("Garden Vine", "Botanical Fruit", "Lycopene", "Pizza Sauce"),
            "tomato", "Tomatoes are packed with lycopene, a powerful antioxidant that protects our heart cells!", "Challenge", "Garden Vegetables",
            "Why is a tomato scientifically classified as a fruit?", Arrays.asList("It develops from a flower and holds seeds", "It is red", "It is round"), 0, "It develops from a flower and holds seeds!");

        addL("veg-corn", "fruits-veggies", 16, "Golden Corn", "k-o-r-n", "🌽",
            "Corn grows on tall garden stalks wrapped in green husks, lined with sweet yellow kernels on a cob.",
            Arrays.asList("Stalk Farm", "Grain / Veggie", "Energy Carbohydrates", "Silk Threads"),
            "corn", "Each individual silk strand on an ear of corn connects to exactly one yellow kernel!", "Challenge", "Garden Vegetables",
            "What connects to every kernel on an ear of corn?", Arrays.asList("A strand of corn silk", "A root", "A leaf"), 0, "A strand of corn silk!");

        addL("veg-potato", "fruits-veggies", 17, "Earthy Potato", "p-u-t-ay-t-o", "🥔",
            "Potatoes are tubers that grow under cool soil, storing healthy complex carbohydrates for play energy.",
            Arrays.asList("Underground Tuber", "Vegetable", "Mashed or Baked", "Vitamin B6"),
            "potato", "Potatoes were the very first vegetable to be successfully grown in outer space on the space shuttle!", "Challenge", "Garden Vegetables",
            "Was the potato grown in outer space by astronauts?", Arrays.asList("Yes, in 1995!", "No, never", "Only on Mars"), 0, "Yes, in 1995!");

        addL("veg-spinach", "fruits-veggies", 18, "Super Spinach", "s-p-i-n-i-ch", "🥬",
            "Spinach is a dark leafy green loaded with iron and folate that helps red blood cells carry oxygen.",
            Arrays.asList("Garden Bed", "Vegetable", "Iron for Blood", "Leafy Green"),
            "spinach", "Fresh spinach leaves lose almost 90% of their volume when cooked down because they are so tender!", "Challenge", "Garden Vegetables",
            "What mineral in spinach helps blood carry oxygen to muscles?", Arrays.asList("Iron", "Sugar", "Gold"), 0, "Healthy iron!");

        addL("veg-pepper", "fruits-veggies", 19, "Bell Pepper Rainbow", "b-e-l-p-e-p-er", "🫑",
            "Bell peppers start green, then ripen into sweet yellow, orange, and red peppers with zero spicy heat.",
            Arrays.asList("Garden Bush", "Vegetable", "Vitamin C Powerhouse", "Crunchy Salad"),
            "pepper", "A single sweet red bell pepper contains twice as much Vitamin C as a medium orange!", "Challenge", "Garden Vegetables",
            "Are sweet bell peppers spicy hot?", Arrays.asList("No, sweet and crunchy!", "Yes, super fiery", "Sour like lemon"), 0, "Sweet and crunchy!");

        addL("veg-cucumber", "fruits-veggies", 20, "Cool Cucumber", "k-y-oo-k-u-m-b-er", "🥒",
            "Cucumbers are 96% water with crisp refreshing green skin. Perfect for cooling down after running in the sun.",
            Arrays.asList("Garden Vine", "Vegetable", "Hydration Hero", "Cool as Cucumber"),
            "cucumber", "The inside of a cucumber can be up to 20 degrees cooler than the outside air on hot days!", "Challenge", "Garden Vegetables",
            "What percentage of a cool cucumber is refreshing water?", Arrays.asList("96% water", "50% water", "20% water"), 0, "96% water!");

        addL("veg-peas", "fruits-veggies", 21, "Sweet Green Peas", "p-ee-z", "🫛",
            "Green peas grow in cozy green pods on climbing vines. Each pod pops open to reveal round sweet pearls.",
            Arrays.asList("Climbing Vine", "Vegetable / Legume", "Plant Protein", "Poppable Pods"),
            "peas", "Gregor Mendel discovered the laws of modern genetics by studying pea plant flowers in his garden!", "Challenge", "Garden Vegetables",
            "What cozy home do sweet green peas grow inside?", Arrays.asList("A green pea pod", "A nutshell", "An acorn"), 0, "A green pea pod!");

        addL("veg-pumpkin", "fruits-veggies", 22, "Autumn Pumpkin", "p-u-m-p-k-i-n", "🎃",
            "Pumpkins are giant ribbed orange squashes with thick rinds and tasty seeds that roast into crunchy snacks.",
            Arrays.asList("Vine Patch", "Squash / Veggie", "Beta-Carotene", "Autumn Harvest"),
            "pumpkin", "The world's heaviest pumpkin ever grown weighed over 2,700 pounds—as much as a small car!", "Challenge", "Garden Vegetables",
            "What color are classic autumn pumpkins?", Arrays.asList("Bright orange", "Blue", "Purple"), 0, "Bright autumn orange!");
    }

    private void seedVehicles() {
        // 16 lessons (Land, Water, Air, Space)
        addL("veh-bicycle", "vehicles", 1, "Two-Wheel Bicycle", "b-eye-s-i-k-l", "🚲",
            "Bicycles have 2 wheels powered by your own pedaling feet! Eco-friendly, fun, and always wear a helmet.",
            Arrays.asList("Land Transport", "Zero Emissions", "Pedal Power", "Safety Helmet"),
            "bicycle", "Riding a bicycle strengthens your leg muscles, heart, and improves your balance!", "Easy", "Land Vehicles",
            "What should you always wear on your head when riding a bicycle?", Arrays.asList("A safety helmet", "A sun hat", "Nothing"), 0, "A protective safety helmet!");

        addL("veh-car", "vehicles", 2, "Family Automobile", "k-ar", "🚗",
            "Cars have 4 rubber wheels, headlights for dark roads, and seatbelts to keep everyone safe.",
            Arrays.asList("Land Transport", "Seatbelt Safety", "Engine Power", "4 Wheels"),
            "car", "Modern electric cars use battery packs instead of gasoline and produce zero exhaust fumes!", "Easy", "Land Vehicles",
            "What should every passenger click on before the car drives?", Arrays.asList("Seatbelt", "Sunglasses", "Gloves"), 0, "Click the seatbelt!");

        addL("veh-bus", "vehicles", 3, "Electric City Bus", "b-u-s", "🚌",
            "Buses are long community vehicles carrying up to 50 passengers together to school, parks, and work.",
            Arrays.asList("Land Transport", "Mass Transit", "Carries Neighbors", "Clean Electric"),
            "bus", "Riding a public bus takes dozens of cars off the street, reducing traffic and air pollution!", "Easy", "Land Vehicles",
            "How many neighbors can ride together on a large city bus?", Arrays.asList("Up to 50 people", "Only 2 people", "None"), 0, "Dozens of neighbors!");

        addL("veh-train", "vehicles", 4, "Bullet Train / Maglev", "t-r-ay-n", "🚆",
            "High-speed passenger trains glide across dedicated tracks at speeds over 200 mph (320 km/h).",
            Arrays.asList("Land Transport", "Rail Tracks", "High Speed", "Maglev Floating"),
            "train", "Magnetic levitation (Maglev) trains float above their guide tracks using electromagnets!", "Easy", "Land Vehicles",
            "What do trains run along smoothly?", Arrays.asList("Iron railway tracks", "Sandy beaches", "Cloud tops"), 0, "Railway tracks!");

        addL("veh-fire", "vehicles", 5, "Fire Truck Hero", "f-eye-er-t-r-u-k", "🚒",
            "Fire trucks have loud sirens, bright flashing lights, long extendable ladders, and water hoses.",
            Arrays.asList("Emergency Vehicle", "Water Pumper", "Rescue Ladder", "Hero Firefighters"),
            "firetruck", "Fire truck ladders can extend as high as 10 stories into the air to rescue people!", "Easy", "Emergency Vehicles",
            "What equipment do fire trucks carry to reach tall building windows?", Arrays.asList("Extendable ladders", "Trampolines", "Ropes only"), 0, "Long extendable ladders!");

        addL("veh-police", "vehicles", 6, "Police Cruiser", "p-u-l-ee-s", "🚓",
            "Police cars help officers patrol neighborhoods, keep roads orderly, and help drivers in trouble.",
            Arrays.asList("Emergency Vehicle", "Flashing Lights", "Radio Dispatch", "Community Helpers"),
            "police", "Police cruisers use two-way radio dispatch computers to communicate quickly with headquarters!", "Medium", "Emergency Vehicles",
            "What colors do emergency vehicle lights flash?", Arrays.asList("Blue and Red", "Black and Gray", "Brown"), 0, "Blue and Red!");

        addL("veh-tractor", "vehicles", 7, "Farm Tractor", "t-r-a-k-t-er", "🚜",
            "Tractors have gigantic treaded rear wheels to grip soft soil while pulling plows and seeders.",
            Arrays.asList("Farm Work", "Deep Tread Tires", "Plows & Harvesters", "Grow Crops"),
            "tractor", "Tractor tires can be as tall as an adult person to prevent sinking in muddy farm fields!", "Medium", "Work Vehicles",
            "Where do tractors do most of their work?", Arrays.asList("On farm fields", "In airports", "Under ocean"), 0, "On farm fields!");

        addL("veh-motorcycle", "vehicles", 8, "Swift Motorcycle", "m-o-t-er-s-eye-k-l", "🏍️",
            "Motorcycles have 2 wheels with a motorized engine. Riders always wear full helmets and leather jackets.",
            Arrays.asList("Land Transport", "2 Wheels", "Protective Gear", "Agile Turning"),
            "motorcycle", "The world's first gasoline motorcycle was built in Germany way back in 1885!", "Medium", "Land Vehicles",
            "How many wheels does a motorcycle have?", Arrays.asList("2 wheels", "4 wheels", "3 wheels"), 0, "2 wheels!");

        addL("veh-sailboat", "vehicles", 9, "Breeze Sailboat", "s-ay-l-b-o-t", "⛵",
            "Sailboats catch the natural power of ocean wind in large cloth sails to glide peacefully over water.",
            Arrays.asList("Water Transport", "Wind Powered", "Ocean Sails", "Zero Motor Noise"),
            "sailboat", "Ancient sailors circumnavigated the globe using sailboats guided only by stars in the night sky!", "Medium", "Water Vehicles",
            "What natural force pushes a sailboat across the water?", Arrays.asList("Wind in sails", "Gasoline only", "Paddles only"), 0, "Wind blowing on the sails!");

        addL("veh-ship", "vehicles", 10, "Cargo Container Ship", "sh-i-p", "🚢",
            "Cargo ships are gigantic ocean giants that transport thousands of colorful steel containers across seas.",
            Arrays.asList("Water Transport", "Ocean Cargo", "Deep Hull", "Global Trade"),
            "ship", "The largest container ships are over 1,300 feet long—longer than four soccer fields end to end!", "Medium", "Water Vehicles",
            "What do container ships carry across oceans?", Arrays.asList("Goods in containers", "Clouds", "Mountains"), 0, "Goods in cargo containers!");

        addL("veh-submarine", "vehicles", 11, "Deep-Sea Submarine", "s-u-b-m-u-r-ee-n", "🤿",
            "Submarines have sealed hulls that can dive thousands of feet underwater, using sonar to navigate in darkness.",
            Arrays.asList("Underwater", "Deep Dive", "Sonar Navigation", "Ocean Research"),
            "submarine", "Submarines fill ballast tanks with water to sink down, and pump them with air to surface!", "Medium", "Water Vehicles",
            "Where do submarines travel?", Arrays.asList("Deep under ocean waters", "Above the clouds", "On train tracks"), 0, "Deep under the sea!");

        addL("veh-speedboat", "vehicles", 12, "Roaring Speedboat", "s-p-ee-d-b-o-t", "🚤",
            "Speedboats have sleek V-shaped hulls and powerful outboard engines that skim swiftly across lake waves.",
            Arrays.asList("Water Transport", "Outboard Motor", "Lake Patrol", "Fast Glide"),
            "speedboat", "Speedboat hulls are shaped like a sharp wedge to slice through surface water resistance!", "Challenge", "Water Vehicles",
            "Why do speedboats have wedge-shaped hulls?", Arrays.asList("To slice smoothly through waves", "To catch fish", "To sink"), 0, "To slice through waves!");

        addL("veh-airplane", "vehicles", 13, "Jet Passenger Airplane", "air-p-l-ay-n", "✈️",
            "Airplanes use curved wings and jet engines to create aerodynamic lift, cruising 30,000 feet above weather.",
            Arrays.asList("Air Transport", "Jet Engines", "Wing Lift", "Above Clouds"),
            "airplane", "The cabin air inside modern passenger planes is fully refreshed and HEPA-filtered every 3 minutes!", "Challenge", "Air & Space Vehicles",
            "What part of an airplane generates lift so it can soar in the sky?", Arrays.asList("Wings", "Tires", "Tail light"), 0, "Its aerodynamic wings!");

        addL("veh-helicopter", "vehicles", 14, "Rescue Helicopter", "h-e-l-i-k-o-p-t-er", "🚁",
            "Helicopters have spinning top rotor blades that allow them to fly forward, backward, sideways, and hover.",
            Arrays.asList("Air Transport", "Rotor Blades", "Hover in Place", "Hospital Rooftops"),
            "helicopter", "Helicopters can land in tight clearings, mountain peaks, and hospital rooftops where planes cannot!", "Challenge", "Air & Space Vehicles",
            "Can a helicopter stop and hover in one place in mid-air?", Arrays.asList("Yes, perfectly in place!", "No, it must always zoom forward", "Only on water"), 0, "Yes, it can hover in place!");

        addL("veh-balloon", "vehicles", 15, "Hot Air Balloon", "b-u-l-oo-n", "🎈",
            "Hot air balloons have giant colorful fabric envelopes. A burner heats the air inside because warm air rises!",
            Arrays.asList("Air Transport", "Gentle Drift", "Burner Heating", "Wicker Basket"),
            "balloon", "The first passengers in a hot air balloon in 1783 were a sheep, a duck, and a rooster!", "Challenge", "Air & Space Vehicles",
            "Why does a hot air balloon float up into the sky?", Arrays.asList("Hot air is lighter and rises", "It has jet engines", "Wings flap"), 0, "Hot air rises!");

        addL("veh-rocket", "vehicles", 16, "Space Rocket", "r-o-k-e-t", "🚀",
            "Rockets burn powerful fuels to escape Earth's gravity, traveling over 28,000 km/h (17,500 mph) to reach orbit.",
            Arrays.asList("Spacecraft", "Escape Velocity", "Astronauts", "Orbital Thrusters"),
            "rocket", "To reach outer space, a rocket must accelerate to escape Earth's gravitational pull in just 8 minutes!", "Challenge", "Air & Space Vehicles",
            "Where do powerful space rockets travel to?", Arrays.asList("Outer space & the stars", "Underground caves", "Across lakes"), 0, "Outer space and orbit!");
    }

    private void seedBodyParts() {
        // 16 lessons (Senses, Organs, Limbs, Health)
        addL("bod-eyes", "body-parts", 1, "Curious Eyes & Vision", "eye-z", "👀",
            "Your eyes capture light rays so your brain can see vibrant colors, shapes, distances, and read books.",
            Arrays.asList("Sense of Sight", "Pupil & Iris", "Blink to Clean", "Eyelashes Protect"),
            "eyes", "You blink about 15 to 20 times every minute to keep your eyes clean and moist!", "Easy", "Five Senses",
            "What sense do your eyes give you?", Arrays.asList("Sense of Sight (seeing)", "Sense of Smell", "Sense of Hearing"), 0, "Sense of Sight!");

        addL("bod-ears", "body-parts", 2, "Listening Ears & Balance", "eer-z", "👂",
            "Ears capture sound vibrations from voices and music. Tiny fluid canals inside your inner ear keep you balanced!",
            Arrays.asList("Sense of Hearing", "Sound Waves", "Inner Ear Balance", "Eardrum"),
            "ears", "Your ears never stop working, even when you are sound asleep at night!", "Easy", "Five Senses",
            "What important job does your inner ear do besides hearing?", Arrays.asList("Keeps you balanced", "Smells food", "Blinks"), 0, "Keeps your balance!");

        addL("bod-nose", "body-parts", 3, "Sniffing Nose & Smell", "n-o-z", "👃",
            "Your nose breathes in fresh air, warms it, and smells delicious bakery cookies or fragrant flowers.",
            Arrays.asList("Sense of Smell", "Breathes Air", "Filters Dust", "Scent Nerves"),
            "nose", "Your sense of smell is closely linked to memories and helps you taste all the flavors in food!", "Easy", "Five Senses",
            "How does your nose help when eating tasty meals?", Arrays.asList("Helps you taste flavors", "Chews food", "Digests bread"), 0, "Smell helps taste flavors!");

        addL("bod-tongue", "body-parts", 4, "Tasting Tongue & Speech", "t-u-ng", "👅",
            "Your tongue has thousands of tiny taste buds to perceive sweet, sour, salty, bitter, and savory flavors.",
            Arrays.asList("Sense of Taste", "Taste Buds", "Helps Speak Words", "Swallowing"),
            "tongue", "Just like human fingerprints, every person's tongue print is completely unique!", "Easy", "Five Senses",
            "What tiny structures on your tongue allow you to taste sweet fruits?", Arrays.asList("Taste buds", "Teeth", "Bones"), 0, "Taste buds!");

        addL("bod-skin", "body-parts", 5, "Sensitive Skin & Touch", "s-k-i-n", "🖐️",
            "Skin is the largest organ in your whole body! Millions of nerve sensors feel soft hugs, warmth, and cool breezes.",
            Arrays.asList("Sense of Touch", "Largest Organ", "Temperature Sensor", "Protective Shield"),
            "skin", "Your skin constantly renews itself, replacing old cells with fresh healthy skin every month!", "Easy", "Five Senses",
            "What is the largest organ of the human body?", Arrays.asList("Skin", "Heart", "Stomach"), 0, "Your skin!");

        addL("bod-hands", "body-parts", 6, "Clever Hands & Fingers", "h-a-n-d-z", "✋",
            "Each hand contains 27 small flexible bones! Opposable thumbs allow humans to write, draw, grip tools, and hold hands.",
            Arrays.asList("27 Hand Bones", "Opposable Thumb", "Grip & Paint", "Fingernails"),
            "hands", "No other animals have the exact dexterity and fine motor control of human hands and fingers!", "Medium", "Limbs & Movement",
            "How many small flexible bones are inside each human hand?", Arrays.asList("27 bones", "5 bones", "50 bones"), 0, "27 flexible bones!");

        addL("bod-feet", "body-parts", 7, "Happy Feet & Legs", "f-ee-t", "🦶",
            "Your feet have springy arches and strong leg muscles that carry you walking, running, skipping, and dancing.",
            Arrays.asList("Walking & Running", "26 Foot Bones", "Springy Arch", "Balance & Jump"),
            "feet", "One quarter of all the bones in your entire skeleton are located in your feet!", "Medium", "Limbs & Movement",
            "What activity do your feet and legs help you do best?", Arrays.asList("Running and jumping", "Listening to songs", "Sleeping only"), 0, "Running and jumping!");

        addL("bod-bones", "body-parts", 8, "Sturdy Skeleton Bones", "b-o-n-z", "🦴",
            "An adult skeleton has 206 strong bones that create an internal framework and shield organs like your brain and heart.",
            Arrays.asList("206 Bones", "Protective Ribcage", "Calcium Strength", "Bone Marrow"),
            "bones", "Human bone is exceptionally strong—ounce for ounce, it is stronger than structural steel!", "Medium", "Body Systems",
            "What cage of bones protects your lungs and beating heart inside your chest?", Arrays.asList("The Ribcage", "The Skull", "The Kneecap"), 0, "The protective ribcage!");

        addL("bod-muscles", "body-parts", 9, "Mighty Muscles", "m-u-s-u-l-z", "💪",
            "Your body has over 600 muscles that contract and relax to pull bones, pump blood, smile, and blink.",
            Arrays.asList("600+ Muscles", "Contract & Relax", "Smiling & Running", "Healthy Exercise"),
            "muscles", "It takes about 17 muscles to smile, and 43 muscles to frown—so smiling is much easier!", "Medium", "Body Systems",
            "What do muscles do to move your bones?", Arrays.asList("Contract and pull", "Melt away", "Turn into bone"), 0, "Contract and pull!");

        addL("bod-brain", "body-parts", 10, "Wonderful Brain", "b-r-ay-n", "🧠",
            "Your brain is the body's command center with 86 billion neurons controlling thinking, learning, memories, and dreams.",
            Arrays.asList("Command Center", "86 Billion Neurons", "Thinking & Dreaming", "Curiosity"),
            "brain", "Your brain generates enough electrical energy to power a small low-wattage LED light bulb!", "Medium", "Vital Organs",
            "What is the control center for all your thoughts and feelings?", Arrays.asList("The Brain", "The Stomach", "The Elbow"), 0, "Your wonderful brain!");

        addL("bod-heart", "body-parts", 11, "Tireless Heart", "h-ar-t", "❤️",
            "Your heart is a strong muscular pump that beats 100,000 times a day, sending oxygen-rich blood to every cell.",
            Arrays.asList("Blood Pump", "100,000 Beats a Day", "Circulation", "Chest Center"),
            "heart", "If you press your hand gently over your chest, that steady rhythm you feel is your heart pumping!", "Medium", "Vital Organs",
            "How many times does your heart pump blood every single day?", Arrays.asList("About 100,000 times", "10 times", "500 times"), 0, "Around 100,000 times!");

        addL("bod-lungs", "body-parts", 12, "Breathing Lungs", "l-u-ng-z", "🫁",
            "Two spongy pink lungs expand when you breathe in fresh air, delivering oxygen to blood and exhaling carbon dioxide.",
            Arrays.asList("Oxygen Inhale", "Carbon Dioxide Exhale", "Two Spongy Organs", "Chest Cavity"),
            "lungs", "If you could unfold all the tiny air sacs in your lungs, they would cover an entire tennis court!", "Medium", "Vital Organs",
            "What essential gas do your lungs take in from fresh air?", Arrays.asList("Oxygen", "Helium", "Steam"), 0, "Fresh oxygen!");

        addL("bod-stomach", "body-parts", 13, "Digestion Stomach", "s-t-u-m-u-k", "🥣",
            "Your stomach breaks down the meals you eat into nutrients, vitamins, and energy for running and thinking.",
            Arrays.asList("Breaks Down Meals", "Energy Fuel", "Nutrient Absorption", "Digestive Health"),
            "stomach", "The stomach produces a special protective mucus lining so digestive juices only break down food!", "Challenge", "Vital Organs",
            "What does your stomach turn wholesome food into?", Arrays.asList("Energy and nutrients", "Bones", "Smoke"), 0, "Energy and nutrients!");

        addL("bod-teeth", "body-parts", 14, "Sparkling Teeth & Smile", "t-ee-th", "🦷",
            "Teeth chew food into bite-sized pieces and help you speak clearly. Brush twice a day to keep enamel bright!",
            Arrays.asList("Chewing Food", "Tooth Enamel", "Brush Twice Daily", "Bright Smile"),
            "teeth", "Tooth enamel is the hardest, most mineralized substance in the entire human body!", "Challenge", "Healthy Habits",
            "What is the hardest substance in the human body?", Arrays.asList("Tooth enamel", "Bone", "Fingernail"), 0, "Tooth enamel!");

        addL("bod-hygiene", "body-parts", 15, "Hand Washing & Hygiene", "w-o-sh", "🧼",
            "Washing your hands with warm water and soap for 20 seconds washes away microscopic germs and keeps you healthy.",
            Arrays.asList("Wash 20 Seconds", "Soap & Water", "Germ Defense", "Healthy Habit"),
            "hygiene", "Singing the 'Happy Birthday' song twice takes about 20 seconds—the perfect hand-washing timer!", "Challenge", "Healthy Habits",
            "How long should you scrub hands with soap and water to wash away germs?", Arrays.asList("20 seconds", "2 seconds", "5 minutes"), 0, "20 seconds!");

        addL("bod-sleep", "body-parts", 16, "Restful Sleep & Growth", "s-l-ee-p", "😴",
            "Sleeping 9 to 11 hours every night gives your brain time to file away memories and your body time to release growth hormones.",
            Arrays.asList("9-11 Hours Rest", "Brain Files Memories", "Growth Hormones", "Wake Energized"),
            "sleep", "While you sleep deeply, your brain cleans away cellular waste and strengthens new learning pathways!", "Challenge", "Healthy Habits",
            "What does your brain do while you enjoy restful deep sleep?", Arrays.asList("Stores memories and rests", "Plays soccer", "Runs a car"), 0, "Stores memories and recharges!");
    }

    private void addL(String id, String categoryId, int orderIndex, String title, String phonics,
                      String illustration, String explanation, List<String> examples,
                      String soundKey, String funFact, String difficulty, String stage,
                      String activityQuestion, List<String> activityOptions, int activityAnswerIndex,
                      String activityHint) {
        Lesson lesson = new Lesson(
            id, categoryId, orderIndex, title, phonics,
            illustration, explanation, examples,
            soundKey, funFact, difficulty, stage,
            activityQuestion, activityOptions, activityAnswerIndex,
            activityHint, false
        );
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
