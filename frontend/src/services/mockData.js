// Rich Educational Datasets for Little Learners

export const INITIAL_CATEGORIES = [
  { id: 'alphabets', name: 'Alphabets', title: 'Alphabet Safari', desc: 'Explore letters A-Z with phonics and lovely words', icon: '🔤', color: '#38BDF8', bgPastel: 'bg-pastel-sky', count: 26, completed: 5 },
  { id: 'numbers', name: 'Numbers', title: 'Number Kingdom', desc: 'Counting, patterns and numbers 1-100 with abacus', icon: '🔢', color: '#34D399', bgPastel: 'bg-pastel-mint', count: 20, completed: 4 },
  { id: 'colors', name: 'Colors', title: 'Rainbow Studio', desc: 'Discover vibrant colors and magic color mixing', icon: '🎨', color: '#FB7185', bgPastel: 'bg-pastel-coral', count: 12, completed: 3 },
  { id: 'shapes', name: 'Shapes', title: 'Shape Explorer', desc: '2D & 3D geometric shapes found in our real world', icon: '🔷', color: '#A78BFA', bgPastel: 'bg-pastel-lavender', count: 10, completed: 2 },
  { id: 'animals', name: 'Animals & Birds', title: 'Wild Safari', desc: 'Roar with lions and fly with eagles in nature', icon: '🦁', color: '#FBBF24', bgPastel: 'bg-pastel-yellow', count: 16, completed: 3 },
  { id: 'fruits-veggies', name: 'Fruits & Veggies', title: 'Garden Market', desc: 'Healthy delicious fruits and fresh crunchy vegetables', icon: '🍎', color: '#FB923C', bgPastel: 'bg-pastel-peach', count: 14, completed: 2 },
  { id: 'vehicles', name: 'Vehicles', title: 'Motion World', desc: 'Zoom with rockets, fast trains, cars, and ships', icon: '🚀', color: '#38BDF8', bgPastel: 'bg-pastel-blue', count: 12, completed: 1 },
  { id: 'body-parts', name: 'Human Body', title: 'My Amazing Body', desc: 'Discover eyes, ears, heart and how muscles move', icon: '🖐️', color: '#F472B6', bgPastel: 'bg-pastel-pink', count: 10, completed: 1 }
];

export const ALPHABETS_DATA = [
  { id: 'alpha-a', letter: 'A', name: 'Apple', phonics: 'a-a-apple', icon: '🍎', color: '#EF4444', desc: 'A is for Apple! Crisp, red, sweet and full of vitamins.', examples: ['Apple', 'Ant', 'Airplane', 'Alligator'], fact: 'Apples float in water because 25% of their volume is air!' },
  { id: 'alpha-b', letter: 'B', name: 'Ball', phonics: 'b-b-ball', icon: '⚽', color: '#3B82F6', desc: 'B is for Ball! Bouncing high and rolling all around.', examples: ['Ball', 'Bear', 'Banana', 'Butterfly'], fact: 'Butterflies taste sweet nectar with their tiny feet!' },
  { id: 'alpha-c', letter: 'C', name: 'Cat', phonics: 'k-k-cat', icon: '🐱', color: '#F59E0B', desc: 'C is for Cat! Purring softly and leaping with agile paws.', examples: ['Cat', 'Car', 'Cake', 'Camel'], fact: 'Cats can jump up to 6 times their body height!' },
  { id: 'alpha-d', letter: 'D', name: 'Dog', phonics: 'd-d-dog', icon: '🐶', color: '#10B981', desc: 'D is for Dog! A loyal buddy who wags its happy tail.', examples: ['Dog', 'Duck', 'Dolphin', 'Drum'], fact: 'A puppy’s sense of smell is up to 100,000 times sharper than ours!' },
  { id: 'alpha-e', letter: 'E', name: 'Elephant', phonics: 'e-e-elephant', icon: '🐘', color: '#6366F1', desc: 'E is for Elephant! Gentle giant with a magnificent trunk.', examples: ['Elephant', 'Egg', 'Eagle', 'Earth'], fact: 'An elephant trunk has over 40,000 muscles!' },
  { id: 'alpha-f', letter: 'F', name: 'Fish', phonics: 'f-f-fish', icon: '🐟', color: '#06B6D4', desc: 'F is for Fish! Swimming smoothly through ocean reefs.', examples: ['Fish', 'Frog', 'Fox', 'Flower'], fact: 'Goldfish have a great memory and can recognize faces!' },
  { id: 'alpha-g', letter: 'G', name: 'Giraffe', phonics: 'j-j-giraffe', icon: '🦒', color: '#D97706', desc: 'G is for Giraffe! Tallest mammal browsing treetops.', examples: ['Giraffe', 'Grape', 'Guitar', 'Goat'], fact: 'A giraffe neck is about 6 feet long, just like its legs!' },
  { id: 'alpha-h', letter: 'H', name: 'House', phonics: 'h-h-house', icon: '🏡', color: '#EC4899', desc: 'H is for House! A cozy place where love and joy live.', examples: ['House', 'Horse', 'Heart', 'Hat'], fact: 'Honeybees build hexagonal honeycombs inside their hives!' },
  { id: 'alpha-i', letter: 'I', name: 'Igloo', phonics: 'i-i-igloo', icon: '🧊', color: '#0284C7', desc: 'I is for Igloo! A domed home built from packed snow blocks.', examples: ['Igloo', 'Island', 'Insect', 'Ice Cream'], fact: 'Even during freezing blizzards, an igloo keeps its inside cozy and warm!' },
  { id: 'alpha-j', letter: 'J', name: 'Jellyfish', phonics: 'j-j-jellyfish', icon: '🪼', color: '#8B5CF6', desc: 'J is for Jellyfish! Glowing gently under moonlit oceans.', examples: ['Jellyfish', 'Jaguar', 'Juice', 'Jungle'], fact: 'Jellyfish have drifted in the oceans for over 500 million years!' },
  { id: 'alpha-k', letter: 'K', name: 'Kangaroo', phonics: 'k-k-kangaroo', icon: '🦘', color: '#B45309', desc: 'K is for Kangaroo! Hopping across sunny Australian plains.', examples: ['Kangaroo', 'Kite', 'Koala', 'King'], fact: 'Baby kangaroos are called joeys and stay cozy in mom’s pouch!' },
  { id: 'alpha-l', letter: 'L', name: 'Lion', phonics: 'l-l-lion', icon: '🦁', color: '#F59E0B', desc: 'L is for Lion! Brave King with a golden furry mane.', examples: ['Lion', 'Lemon', 'Leaf', 'Lamb'], fact: 'A lion’s mighty roar can be heard across 5 whole miles!' }
];

export const NUMBERS_DATA = [
  { num: 1, word: 'One', icon: '☝️', items: ['☀️'], desc: '1 is the single bright Sun shining warmly in our sky.', fact: 'Earth has exactly 1 natural moon.' },
  { num: 2, word: 'Two', icon: '✌️', items: ['👀', '👟'], desc: '2 eyes to see the world, and 2 shoes for running.', fact: 'Birds have 2 wings to glide through wind.' },
  { num: 3, word: 'Three', icon: '🔺', items: ['🔴', '🟡', '🔵'], desc: '3 primary colors and 3 sides on a sturdy triangle.', fact: 'Traffic lights have 3 colored lights: Red, Yellow, Green.' },
  { num: 4, word: 'Four', icon: '🍀', items: ['🌱', '🌱', '🌱', '🌱'], desc: '4 seasons of the year: Spring, Summer, Autumn, Winter.', fact: 'A lucky four-leaf clover has 4 heart-shaped leaflets.' },
  { num: 5, word: 'Five', icon: '🖐️', items: ['⭐', '⭐', '⭐', '⭐', '⭐'], desc: '5 fingers on your hand waving a cheerful hello!', fact: 'Most sea stars have 5 arms radiating outwards.' },
  { num: 6, word: 'Six', icon: '🎲', items: ['🐞', '🐞', '🐞', '🐞', '🐞', '🐞'], desc: '6 spots on a playing die and 6 legs on ladybugs.', fact: 'All insects have exactly 6 jointed legs.' },
  { num: 7, word: 'Seven', icon: '🌈', items: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤'], desc: '7 glowing colors in a magical sky rainbow.', fact: 'There are 7 continents on planet Earth!' },
  { num: 8, word: 'Eight', icon: '🐙', items: ['🌊', '🌊', '🌊', '🌊', '🌊', '🌊', '🌊', '🌊'], desc: '8 flexible tentacles on a clever ocean octopus.', fact: 'Spiders have 8 walking legs and multiple eyes.' },
  { num: 9, word: 'Nine', icon: '🪐', items: ['⭐', '⭐', '⭐', '⭐', '⭐', '⭐', '⭐', '⭐', '⭐'], desc: '9 is the highest single digit before reaching ten!', fact: 'A baseball game consists of 9 exciting innings.' },
  { num: 10, word: 'Ten', icon: '🔟', items: ['🖐️', '🖐️'], desc: '10 toes wiggling on your happy feet!', fact: 'Our decimal counting system is based on the number 10!' }
];

export const COLORS_DATA = [
  { name: 'Red', hex: '#EF4444', icon: '🔴', role: 'Primary Color', items: ['Strawberry', 'Firetruck', 'Ruby Heart', 'Rose'], fact: 'Red is the first color babies can perceive!' },
  { name: 'Blue', hex: '#3B82F6', icon: '🔵', role: 'Primary Color', items: ['Ocean Waves', 'Sky', 'Blueberry', 'Bluebird'], fact: 'Blue is the most common favorite color in the world!' },
  { name: 'Yellow', hex: '#FACC15', icon: '🟡', role: 'Primary Color', items: ['Sun', 'Banana', 'Sunflower', 'School Bus'], fact: 'Sunflowers follow the sun as it travels in the sky!' },
  { name: 'Green', hex: '#10B981', icon: '🟢', role: 'Secondary (Yellow + Blue)', items: ['Leaf', 'Frog', 'Cucumber', 'Grasshopper'], fact: 'Chlorophyll is what makes leaves and plants green!' },
  { name: 'Orange', hex: '#FB923C', icon: '🟠', role: 'Secondary (Red + Yellow)', items: ['Orange Fruit', 'Tiger Fur', 'Carrot', 'Pumpkin'], fact: 'The color orange was named after the orange fruit!' },
  { name: 'Purple', hex: '#A855F7', icon: '🟣', role: 'Secondary (Red + Blue)', items: ['Grape', 'Lavender Flower', 'Amethyst', 'Eggplant'], fact: 'In ancient history, purple dye was reserved for royalty!' }
];

export const SHAPES_DATA = [
  { name: 'Circle', icon: '⭕', sides: 0, corners: 0, realWorld: ['Clock', 'Pizza', 'Coin', 'Full Moon'], desc: 'Completely round all around with zero straight lines.' },
  { name: 'Square', icon: '⬛', sides: 4, corners: 4, realWorld: ['Building Block', 'Window Tile', 'Chessboard'], desc: '4 straight sides that are all completely equal.' },
  { name: 'Triangle', icon: '🔺', sides: 3, corners: 3, realWorld: ['Pizza Slice', 'Pyramid', 'Mountain Peak'], desc: '3 sides and 3 sharp corners. The strongest shape!' },
  { name: 'Rectangle', icon: '🚪', sides: 4, corners: 4, realWorld: ['Doorway', 'Smartphone', 'Book Cover'], desc: '4 sides where opposite sides are parallel and equal.' },
  { name: 'Star', icon: '⭐', sides: 10, corners: 5, realWorld: ['Night Sky Star', 'Sea Star', 'Award Badge'], desc: '5 pointy arms reaching out into the sparkling night.' },
  { name: 'Heart', icon: '❤️', sides: 0, corners: 1, realWorld: ['Valentine Card', 'Strawberry Top'], desc: 'Symbol of friendship, warmth, and loving kindness.' }
];

export const ANIMALS_DATA = [
  { name: 'Lion', icon: '🦁', sound: 'Roaaar!', habitat: 'Savannah', food: 'Carnivore', fact: 'Lions sleep up to 20 hours a day to save energy!' },
  { name: 'Dolphin', icon: '🐬', sound: 'Click-Whistle!', habitat: 'Ocean', food: 'Fish', fact: 'Dolphins have names for each other using unique whistle sounds!' },
  { name: 'Elephant', icon: '🐘', sound: 'Pawoo-Trumpet!', habitat: 'Grassland & Forest', food: 'Herbivore', fact: 'Elephants comfort each other by stroking trunks!' },
  { name: 'Penguin', icon: '🐧', sound: 'Honk-Honk!', habitat: 'Antarctic Ice', food: 'Krill & Fish', fact: 'Penguins slide on their bellies across snow; it’s called tobogganing!' },
  { name: 'Monkey', icon: '🐒', sound: 'Ooh-Ooh Aah-Aah!', habitat: 'Rainforest Canopy', food: 'Fruits & Nuts', fact: 'Monkeys use their tail like an extra hand to swing!' },
  { name: 'Owl', icon: '🦉', sound: 'Hoo-Hoo!', habitat: 'Woodland', food: 'Nocturnal Hunter', fact: 'Owls can rotate their heads up to 270 degrees!' }
];

export const FRUITS_VEGGIES_DATA = [
  { name: 'Apple', icon: '🍎', type: 'Fruit', color: 'Red', benefit: 'Keeps doctor away with fiber', fact: 'There are over 7,500 varieties of apples in the world!' },
  { name: 'Banana', icon: '🍌', type: 'Fruit', color: 'Yellow', benefit: 'Boosts energy with potassium', fact: 'Bananas grow curved because they reach up for the sun!' },
  { name: 'Carrot', icon: '🥕', type: 'Vegetable', color: 'Orange', benefit: 'Vitamin A for bright eyes', fact: 'Carrots were once purple before orange carrots became popular!' },
  { name: 'Broccoli', icon: '🥦', type: 'Vegetable', color: 'Green', benefit: 'Calcium for strong bones', fact: 'Broccoli looks like little edible trees!' },
  { name: 'Strawberry', icon: '🍓', type: 'Fruit', color: 'Red', benefit: 'Vitamin C for immunity', fact: 'Strawberries wear their seeds on the outside—about 200 of them!' },
  { name: 'Corn', icon: '🌽', type: 'Vegetable', color: 'Yellow', benefit: 'Whole-grain energy', fact: 'Each silk strand on an ear of corn connects to one kernel!' }
];

export const VEHICLES_DATA = [
  { name: 'Rocket', icon: '🚀', realm: 'Space', speed: 'Super Fast', fact: 'Rockets travel at 28,000 km/h to orbit our planet!' },
  { name: 'Airplane', icon: '✈️', realm: 'Air', speed: 'Fast', fact: 'Planes cruise high above storm clouds where air is calm!' },
  { name: 'Train', icon: '🚆', realm: 'Land', speed: 'Fast', fact: 'Bullet trains in Japan float on magnetic tracks!' },
  { name: 'Sailboat', icon: '⛵', realm: 'Water', speed: 'Moderate', fact: 'Sailboats use the wind to glide smoothly over water!' },
  { name: 'Bicycle', icon: '🚲', realm: 'Land', speed: 'Eco-Friendly', fact: 'Riding a bike strengthens heart muscles and balances coordination!' },
  { name: 'Submarine', icon: '🤿', realm: 'Underwater', speed: 'Deep Water', fact: 'Submarines use sonar sound waves to navigate in deep darkness!' }
];

export const BODY_PARTS_DATA = [
  { name: 'Eyes', icon: '👀', function: 'Vision', fact: 'Your eyes blink about 20 times every minute to stay clean!' },
  { name: 'Ears', icon: '👂', function: 'Hearing & Balance', fact: 'Tiny fluid canals inside your ears keep you balanced when you spin!' },
  { name: 'Heart', icon: '❤️', function: 'Blood Circulation', fact: 'Your heart beats around 100,000 times every day without stopping!' },
  { name: 'Lungs', icon: '🫁', function: 'Breathing Air', fact: 'Lungs take in fresh oxygen from the air and send it to your body!' },
  { name: 'Brain', icon: '🧠', function: 'Thinking & Memory', fact: 'Your brain generates enough electricity to power a small LED bulb!' },
  { name: 'Hands', icon: '🖐️', function: 'Touching & Creating', fact: 'Each human hand contains 27 small bones working together!' }
];

export const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    category: 'alphabets',
    difficulty: 'Easy',
    question: 'Which letter does the word "Apple" begin with?',
    options: ['Letter A', 'Letter B', 'Letter C', 'Letter D'],
    answerIndex: 0,
    icon: '🍎',
    explanation: 'A is for Apple! (a-a-apple).'
  },
  {
    id: 'q2',
    category: 'alphabets',
    difficulty: 'Easy',
    question: 'Which sweet animal starts with the letter "C"?',
    options: ['Duck', 'Cat', 'Bear', 'Elephant'],
    answerIndex: 1,
    icon: '🐱',
    explanation: 'C is for Cat! Cats love warm cuddles and gentle purrs.'
  },
  {
    id: 'q3',
    category: 'numbers',
    difficulty: 'Easy',
    question: 'How many bright suns do we have in our daytime sky?',
    options: ['1 Sun', '2 Suns', '5 Suns', '0 Suns'],
    answerIndex: 0,
    icon: '☀️',
    explanation: 'We have 1 beautiful sun giving warmth to Earth.'
  },
  {
    id: 'q4',
    category: 'numbers',
    difficulty: 'Medium',
    question: 'If you have 3 red apples and pick 2 green apples, how many apples do you have in total?',
    options: ['4 Apples', '5 Apples', '6 Apples', '10 Apples'],
    answerIndex: 1,
    icon: '🍎',
    explanation: '3 + 2 = 5 juicy apples!'
  },
  {
    id: 'q5',
    category: 'colors',
    difficulty: 'Easy',
    question: 'What color do you see when looking up at a clear morning sky?',
    options: ['Green', 'Blue', 'Purple', 'Orange'],
    answerIndex: 1,
    icon: '🌤️',
    explanation: 'A clear sunny sky is a beautiful calm Blue!'
  },
  {
    id: 'q6',
    category: 'colors',
    difficulty: 'Medium',
    question: 'What magic color appears when you mix Yellow and Blue paint?',
    options: ['Purple', 'Green', 'Orange', 'Pink'],
    answerIndex: 1,
    icon: '🎨',
    explanation: 'Yellow + Blue blends into sparkling Green!'
  },
  {
    id: 'q7',
    category: 'shapes',
    difficulty: 'Easy',
    question: 'Which shape is round like a dinner plate or full moon?',
    options: ['Square', 'Triangle', 'Circle', 'Rectangle'],
    answerIndex: 2,
    icon: '⭕',
    explanation: 'A circle is completely round with no sharp corners.'
  },
  {
    id: 'q8',
    category: 'shapes',
    difficulty: 'Medium',
    question: 'How many straight equal sides does a square have?',
    options: ['3 sides', '4 sides', '5 sides', '6 sides'],
    answerIndex: 1,
    icon: '⬛',
    explanation: 'A square has 4 sides of the exact same length.'
  },
  {
    id: 'q9',
    category: 'animals',
    difficulty: 'Easy',
    question: 'Which animal is known as the "King of the Jungle"?',
    options: ['Lion', 'Monkey', 'Giraffe', 'Penguin'],
    answerIndex: 0,
    icon: '🦁',
    explanation: 'The brave lion with its golden mane is King of the Jungle!'
  },
  {
    id: 'q10',
    category: 'animals',
    difficulty: 'Challenge',
    question: 'Which playful sea creature sleeps with one eye open to stay safe?',
    options: ['Shark', 'Dolphin', 'Sea Turtle', 'Octopus'],
    answerIndex: 1,
    icon: '🐬',
    explanation: 'Dolphins rest half their brain at a time and keep one eye watchful!'
  }
];

export const BADGES_DATA = [
  { id: 'b1', title: 'Curious Explorer', desc: 'Completed your first learning activity!', icon: '🧭', category: 'General', unlocked: true, requiredStars: 5 },
  { id: 'b2', title: 'Alphabet Ace', desc: 'Mastered 5 alphabet letters with phonics', icon: '🔤', category: 'Language', unlocked: true, requiredStars: 10 },
  { id: 'b3', title: 'Number Ninja', desc: 'Counted items and solved math challenges', icon: '🔢', category: 'Math', unlocked: true, requiredStars: 15 },
  { id: 'b4', title: 'Rainbow Artist', desc: 'Created art and mixed secondary colors', icon: '🎨', category: 'Art', unlocked: false, requiredStars: 25 },
  { id: 'b5', title: 'Shape Master', desc: 'Identified all 2D and 3D shapes in real life', icon: '🔷', category: 'Geometry', unlocked: false, requiredStars: 35 },
  { id: 'b6', title: 'Wild Zoologist', desc: 'Discovered creature habitats and calls', icon: '🦁', category: 'Science', unlocked: false, requiredStars: 45 },
  { id: 'b7', title: 'Memory Wizard', desc: 'Solved memory flip cards with zero mistakes', icon: '🃏', category: 'Games', unlocked: false, requiredStars: 55 },
  { id: 'b8', title: 'Quiz Champion', desc: 'Earned 100% on a Challenge level quiz', icon: '🏆', category: 'Quiz', unlocked: false, requiredStars: 70 }
];

export const INITIAL_DAILY_CHALLENGES = [
  { id: 'c1', title: 'Letter Safari A & B', desc: 'Listen to phonics and spell words for A & B', category: 'alphabets', reward: 3, done: false },
  { id: 'c2', title: 'Counting 1 to 5', desc: 'Slide the beads on the interactive abacus', category: 'numbers', reward: 3, done: false },
  { id: 'c3', title: 'Color Magic Lab', desc: 'Mix two primary colors to make green', category: 'colors', reward: 3, done: false },
  { id: 'c4', title: 'Shape Detective', desc: 'Find 3 triangles in the shape playground', category: 'shapes', reward: 4, done: false },
  { id: 'c5', title: 'Animal Sound Mimic', desc: 'Listen to the Lion roar and Owl hoot', category: 'animals', reward: 5, done: false }
];
