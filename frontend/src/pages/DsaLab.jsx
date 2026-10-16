import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { sound } from '../services/audioService';
import { 
  Cpu, 
  Layers, 
  Hash, 
  RotateCw, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  BookOpen, 
  BarChart3, 
  Code2, 
  Sparkles,
  Search,
  Zap
} from 'lucide-react';

export default function DsaLab() {
  const [activeTab, setActiveTab] = useState('array');

  // --- 1. Dynamic ArrayList Visualizer State ---
  const [arrayElements, setArrayElements] = useState(['Alphabet A', 'Alphabet B', 'Alphabet C']);
  const [arrayCapacity, setArrayCapacity] = useState(4);
  const [arrayResizeNotice, setArrayResizeNotice] = useState(null);

  const handleArrayAdd = () => {
    sound.playPop();
    const nextItem = `Lesson ${String.fromCharCode(65 + arrayElements.length)}`;
    if (arrayElements.length + 1 > arrayCapacity) {
      // 1.5x / 2x growth
      const newCap = arrayCapacity * 2;
      setArrayCapacity(newCap);
      setArrayResizeNotice(`Array resized from ${arrayCapacity} to ${newCap} slots! (O(n) copy)`);
      setTimeout(() => setArrayResizeNotice(null), 2500);
    }
    setArrayElements([...arrayElements, nextItem]);
  };

  const handleArrayRemove = () => {
    if (arrayElements.length === 0) return;
    sound.playPop();
    setArrayElements(arrayElements.slice(0, -1));
  };

  // --- 2. HashMap Visualizer State ---
  const [hashBuckets, setHashBuckets] = useState([
    [{ key: 'alphabets', val: '26 lessons' }],
    [],
    [{ key: 'numbers', val: '20 lessons' }],
    [],
    [{ key: 'colors', val: '12 lessons' }, { key: 'shapes', val: '10 lessons' }], // collision
    [],
    [{ key: 'animals', val: '16 lessons' }],
    []
  ]);
  const [searchKey, setSearchKey] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleHashSearch = () => {
    sound.playPop();
    const query = searchKey.trim().toLowerCase();
    let found = null;
    let bucketIdx = -1;

    hashBuckets.forEach((bucket, bIdx) => {
      bucket.forEach((node) => {
        if (node.key.toLowerCase() === query) {
          found = node;
          bucketIdx = bIdx;
        }
      });
    });

    if (found) {
      sound.playSuccess();
      setSearchResult(`Found key "${found.key}" in Bucket [${bucketIdx}] in O(1) time! Value: ${found.val}`);
    } else {
      sound.playGentleOops();
      setSearchResult(`Key "${query}" not found in hash table.`);
    }
  };

  // --- 3. Queue Visualizer State (FIFO) ---
  const [queueItems, setQueueItems] = useState([
    'Quest 1: Letter Safari',
    'Quest 2: Abacus Counting',
    'Quest 3: Rainbow Color Mix'
  ]);

  const handleEnqueue = () => {
    sound.playPop();
    setQueueItems([...queueItems, `Quest ${queueItems.length + 1}: Quiz Challenge`]);
  };

  const handleDequeue = () => {
    if (queueItems.length === 0) return;
    sound.playSuccess();
    setQueueItems(queueItems.slice(1));
  };

  // --- 4. Stack Visualizer State (LIFO) ---
  const [stackItems, setStackItems] = useState([
    'Initial Canvas Snapshot',
    'Stroke 1: Draw Sun Circle',
    'Stroke 2: Paint Yellow Ray'
  ]);

  const handleStackPush = () => {
    sound.playPop();
    setStackItems([...stackItems, `Stroke ${stackItems.length}: Add Color Pixel`]);
  };

  const handleStackPop = () => {
    if (stackItems.length === 0) return;
    sound.playPop();
    setStackItems(stackItems.slice(0, -1));
  };

  // --- 5. Benchmark Benchmark State ---
  const [benchmarkSize, setBenchmarkSize] = useState(250);
  const [searchBenchmark, setSearchBenchmark] = useState(api.runSearchBenchmark(250));

  const handleRunSearchBenchmark = () => {
    sound.playSuccess();
    setSearchBenchmark(api.runSearchBenchmark(benchmarkSize));
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Header with College Viva Notice */}
      <div className="card-soft p-6 sm:p-8 bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold uppercase tracking-wide border border-indigo-400/40">
              <Cpu className="w-4 h-4 text-indigo-300" />
              <span>College Project Viva &amp; DSA Showcase</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
              Data Structures &amp; Algorithms Lab
            </h1>
            <p className="text-indigo-200 text-sm max-w-2xl font-medium">
              Real-time interactive visualizers demonstrating how Java 21 Collections and custom algorithmic models power Little Learners. Ready for teacher evaluation and viva defense!
            </p>
          </div>
          <div className="shrink-0 p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <span className="text-3xl block">🎓</span>
            <span className="font-mono text-xs font-bold text-amber-300 block mt-1">Java 21 • Spring Boot</span>
          </div>
        </div>
      </div>

      {/* Visualizer Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'array', label: '1. ArrayList Visualizer', icon: Layers },
          { id: 'hash', label: '2. HashMap Visualizer', icon: Hash },
          { id: 'queue', label: '3. Challenge Queue (FIFO)', icon: RotateCw },
          { id: 'stack', label: '4. Canvas Stack (LIFO)', icon: Layers },
          { id: 'benchmark', label: '5. Search & Sort Benchmarks', icon: Zap },
          { id: 'viva', label: '6. Viva Q&A & Cheat Sheet', icon: BookOpen }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { sound.playPop(); setActiveTab(tab.id); }}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-display font-bold text-sm whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. ARRAYLIST VISUALIZER */}
      {activeTab === 'array' && (
        <div className="card-soft p-6 sm:p-8 bg-white border-2 border-indigo-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-2xl text-slate-800">
                CustomArrayList Dynamic Resizing Simulation
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Internal array capacity starts small. When element count exceeds capacity, the array doubles via <code>System.arraycopy</code>.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold bg-indigo-50 text-indigo-900 px-3 py-1.5 rounded-xl border border-indigo-200">
              <span>Size: {arrayElements.length}</span>
              <span>|</span>
              <span>Capacity: {arrayCapacity}</span>
            </div>
          </div>

          {arrayResizeNotice && (
            <div className="p-3 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 font-mono text-xs font-bold animate-pulse">
              ⚡ {arrayResizeNotice}
            </div>
          )}

          {/* Slots Visual Representation */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              Contiguous Memory Slots (Indices 0 to {arrayCapacity - 1}):
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {Array.from({ length: arrayCapacity }).map((_, idx) => {
                const item = arrayElements[idx];
                const isOccupied = item !== undefined;
                return (
                  <div
                    key={idx}
                    className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-between p-2 select-none transition-all ${
                      isOccupied
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-bold shadow-sm'
                        : 'bg-slate-50 border-dashed border-slate-300 text-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-slate-400">[{idx}]</span>
                    <span className="text-xs font-display text-center truncate w-full">
                      {isOccupied ? item : 'Empty'}
                    </span>
                    <span className="text-[9px] font-mono">
                      {isOccupied ? 'O(1) Access' : 'Null'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleArrayAdd}
              className="btn-bubbly px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700"
            >
              + Add Element (Trigger Dynamic Growth)
            </button>
            <button
              onClick={handleArrayRemove}
              disabled={arrayElements.length === 0}
              className="btn-bubbly px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs disabled:opacity-40"
            >
              - Remove Last Element
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono space-y-1">
            <p><strong>Complexity in Little Learners:</strong></p>
            <p>• <code>get(int index)</code>: <strong>O(1)</strong> — Direct pointer arithmetic calculation.</p>
            <p>• <code>add(T element)</code>: <strong>O(1) amortized</strong> — Append is instant until capacity is exhausted.</p>
            <p>• <code>remove(int index)</code>: <strong>O(n)</strong> — Remaining elements shift left.</p>
          </div>
        </div>
      )}

      {/* 2. HASHMAP VISUALIZER */}
      {activeTab === 'hash' && (
        <div className="card-soft p-6 sm:p-8 bg-white border-2 border-indigo-200 space-y-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-slate-800">
              CustomHashMap Separate Chaining Simulation
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Maps category keys and answer IDs to objects in average O(1) time. Demonstrates bucket index hashing and linked list collision resolution.
            </p>
          </div>

          {/* Search Toolbar */}
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="Search key: 'alphabets', 'colors', 'shapes'..."
              className="flex-1 px-4 py-2 rounded-xl border border-slate-300 font-mono text-xs outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleHashSearch}
              className="btn-bubbly px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Search O(1)
            </button>
          </div>

          {searchResult && (
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-mono text-xs font-bold">
              {searchResult}
            </div>
          )}

          {/* Hash Buckets Grid */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              Hash Table Buckets (Capacity = 8, Hash Function = hash(key) % 8):
            </span>
            <div className="space-y-2">
              {hashBuckets.map((bucket, bIdx) => (
                <div key={bIdx} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-16 font-mono text-xs font-bold text-slate-500">
                    Bucket [{bIdx}]
                  </span>
                  <div className="flex items-center gap-2 flex-wrap flex-1">
                    {bucket.length === 0 ? (
                      <span className="text-xs font-mono text-slate-300">null</span>
                    ) : (
                      bucket.map((node, nIdx) => (
                        <div key={nIdx} className="flex items-center gap-1.5">
                          <span className="px-3 py-1 rounded-lg bg-indigo-100 border border-indigo-300 font-mono text-xs font-bold text-indigo-900">
                            "{node.key}" ➔ {node.val}
                          </span>
                          {nIdx < bucket.length - 1 && (
                            <span className="text-xs font-mono font-bold text-rose-500">
                              ➔ [Linked Node Collision]
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. CHALLENGE QUEUE VISUALIZER (FIFO) */}
      {activeTab === 'queue' && (
        <div className="card-soft p-6 sm:p-8 bg-white border-2 border-indigo-200 space-y-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-slate-800">
              ChallengeQueue (FIFO: First-In, First-Out)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Controls the sequence of daily educational quests. When a child completes a quest, it is dequeued from the HEAD, and the next quest becomes available.
            </p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50 border border-indigo-200 overflow-x-auto">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-mono text-xs font-bold">
                HEAD (Next to Dequeue)
              </span>
              <div className="flex items-center gap-2">
                {queueItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="px-4 py-2 rounded-xl bg-white border-2 border-indigo-300 font-display font-bold text-xs text-indigo-950 shadow-sm whitespace-nowrap">
                      {item}
                    </span>
                    {idx < queueItems.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
              <span className="px-3 py-1 rounded-lg bg-slate-200 text-slate-700 font-mono text-xs font-bold">
                TAIL (Enqueue here)
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDequeue}
              disabled={queueItems.length === 0}
              className="btn-bubbly px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              Dequeue Head (Complete Quest)
            </button>
            <button
              onClick={handleEnqueue}
              className="btn-bubbly px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Enqueue Tail (Add New Daily Quest)
            </button>
          </div>
        </div>
      )}

      {/* 4. ACTIVITY STACK VISUALIZER (LIFO) */}
      {activeTab === 'stack' && (
        <div className="card-soft p-6 sm:p-8 bg-white border-2 border-indigo-200 space-y-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-slate-800">
              ActivityStack (LIFO: Last-In, First-Out)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Powers the Creative Corner drawing canvas undo feature and tracks navigation breadcrumbs. The most recent stroke pushed onto the TOP is the first to be popped!
            </p>
          </div>

          {/* Vertical Stack Visualizer */}
          <div className="max-w-md mx-auto space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-mono font-bold text-indigo-600 uppercase block text-center">
              ▲ TOP OF STACK (Peek &amp; Pop Target)
            </span>
            <div className="flex flex-col-reverse gap-2">
              {stackItems.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border-2 font-display text-xs font-bold flex items-center justify-between ${
                    idx === stackItems.length - 1
                      ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <span>{item}</span>
                  <span className="text-[10px] font-mono text-slate-400">Node [{idx}]</span>
                </div>
              ))}
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block text-center pt-2">
              ▼ BOTTOM OF STACK
            </span>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleStackPush}
              className="btn-bubbly px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Push New Action onto Stack O(1)
            </button>
            <button
              onClick={handleStackPop}
              disabled={stackItems.length === 0}
              className="btn-bubbly px-5 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs disabled:opacity-40"
            >
              Pop Top Action (Undo) O(1)
            </button>
          </div>
        </div>
      )}

      {/* 5. SEARCH & SORT BENCHMARK */}
      {activeTab === 'benchmark' && (
        <div className="card-soft p-6 sm:p-8 bg-white border-2 border-indigo-200 space-y-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-slate-800">
              Live Algorithm Benchmark &amp; Race
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Run comparative trials on Linear Search O(n) vs Binary Search O(log n), and Bubble Sort O(n^2) vs Merge Sort O(n log n).
            </p>
          </div>

          {/* Input Size Slider */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="font-display font-bold text-sm text-slate-700">Dataset Size (N):</span>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={benchmarkSize}
              onChange={(e) => setBenchmarkSize(parseInt(e.target.value, 10))}
              className="flex-1 accent-indigo-600"
            />
            <span className="font-mono font-bold text-indigo-700 text-sm">{benchmarkSize} elements</span>
            <button
              onClick={handleRunSearchBenchmark}
              className="btn-bubbly px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Run Benchmark Race
            </button>
          </div>

          {/* Benchmark Results Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-lg text-rose-950">
                  {searchBenchmark.algorithmA}
                </span>
                <span className="font-mono text-xs font-black text-rose-700 bg-rose-200/60 px-2.5 py-1 rounded-full">
                  {searchBenchmark.theoreticalComplexityA}
                </span>
              </div>
              <p className="font-mono text-2xl font-black text-rose-600">
                {searchBenchmark.comparisonsA} Checks
              </p>
              <p className="text-xs text-rose-800 font-medium">
                Scans every single item one-by-one from the beginning.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-lg text-emerald-950">
                  {searchBenchmark.algorithmB}
                </span>
                <span className="font-mono text-xs font-black text-emerald-700 bg-emerald-200/60 px-2.5 py-1 rounded-full">
                  {searchBenchmark.theoreticalComplexityB}
                </span>
              </div>
              <p className="font-mono text-2xl font-black text-emerald-600">
                {searchBenchmark.comparisonsB} Checks 🚀
              </p>
              <p className="text-xs text-emerald-800 font-medium">
                Divides sorted elements in half at each step. Ultra fast!
              </p>
            </div>

          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 font-mono text-xs font-bold text-indigo-950">
            📊 Result: {searchBenchmark.summary}
          </div>
        </div>
      )}

      {/* 6. VIVA DEFENSE CHEAT SHEET */}
      {activeTab === 'viva' && (
        <div className="card-soft p-6 sm:p-8 bg-white border-2 border-indigo-200 space-y-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-slate-800">
              College Viva Examiner Q&amp;A Cheat Sheet
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Quick, clear answers to common questions asked by professors during DSA project evaluation.
            </p>
          </div>

          <div className="space-y-4">
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h3 className="font-display font-bold text-base text-indigo-950">
                Q1: Why did you choose ArrayList over LinkedList for the lessons catalog?
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                <strong>Answer:</strong> Our educational lessons are read far more frequently than they are modified. An <code>ArrayList</code> provides <strong>O(1) random access by index</strong> because elements reside in contiguous memory slots. In contrast, <code>LinkedList</code> requires <strong>O(n) traversal</strong> to reach an arbitrary index and carries additional memory overhead for storing two node pointers per element.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h3 className="font-display font-bold text-base text-indigo-950">
                Q2: How does your CustomHashMap handle hash collisions?
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                <strong>Answer:</strong> We implemented <strong>Separate Chaining</strong> using linked <code>Node&lt;K, V&gt;</code> buckets. When two distinct keys produce the same hash bucket index (e.g., <code>hash % capacity</code>), the new entry is appended to the linked list at that bucket slot in O(1) time. When the table load factor exceeds 0.75, the table rehashes into double capacity to preserve average O(1) retrieval.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h3 className="font-display font-bold text-base text-indigo-950">
                Q3: Why is Merge Sort preferred for ranking student leaderboards?
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                <strong>Answer:</strong> <code>Merge Sort</code> provides a <strong>guaranteed O(n log n)</strong> time complexity in all cases (best, average, and worst). Furthermore, it is a <strong>stable sorting algorithm</strong>, meaning students with identical star counts maintain their relative milestone order.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h3 className="font-display font-bold text-base text-indigo-950">
                Q4: Where are Stacks and Queues practically utilized in the app?
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                <strong>Answer:</strong> We use a <strong>Queue (FIFO)</strong> in <code>ChallengeQueueService</code> to sequence the child's daily quests, ensuring tasks rotate in orderly succession. We use a <strong>Stack (LIFO)</strong> in <code>CreativeCorner</code> to preserve drawing canvas state snapshots so the child can Undo and Redo strokes in reverse chronological order.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
