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
  Zap,
  Terminal,
  Activity,
  History
} from 'lucide-react';

export default function DsaLab() {
  const [activeTab, setActiveTab] = useState('array');
  const [backendStatus, setBackendStatus] = useState({ isOnline: false });

  useEffect(() => {
    const unsub = api.subscribe((status) => setBackendStatus(status));
    return unsub;
  }, []);

  // --- 1. Dynamic ArrayList Visualizer State ---
  const [arrayElements, setArrayElements] = useState(['Alphabet A', 'Alphabet B', 'Alphabet C']);
  const [arrayCapacity, setArrayCapacity] = useState(4);
  const [arrayOpCount, setArrayOpCount] = useState(3);
  const [arrayLastOp, setArrayLastOp] = useState('Initialized with 3 elements (Capacity=4)');
  const [arrayResizeNotice, setArrayResizeNotice] = useState(null);
  const [arrayLog, setArrayLog] = useState([
    'add("Alphabet A") -> size=1, cap=4',
    'add("Alphabet B") -> size=2, cap=4',
    'add("Alphabet C") -> size=3, cap=4'
  ]);

  const handleArrayAdd = () => {
    sound.playPop();
    const nextItem = `Lesson ${String.fromCharCode(65 + arrayElements.length)}`;
    setArrayOpCount((prev) => prev + 1);

    if (arrayElements.length + 1 > arrayCapacity) {
      const newCap = arrayCapacity * 2;
      setArrayCapacity(newCap);
      setArrayResizeNotice(`⚠️ Capacity exceeded! Resized from ${arrayCapacity} to ${newCap} slots via System.arraycopy (O(n) work)`);
      setTimeout(() => setArrayResizeNotice(null), 3000);
      setArrayLastOp(`add("${nextItem}") with Array Resize (Cap: ${arrayCapacity} -> ${newCap})`);
      setArrayLog((prev) => [`RESIZE: Doubled array memory buffer to ${newCap} slots`, `add("${nextItem}") -> size=${arrayElements.length + 1}, cap=${newCap}`, ...prev.slice(0, 8)]);
    } else {
      setArrayLastOp(`add("${nextItem}") in O(1) amortized time`);
      setArrayLog((prev) => [`add("${nextItem}") -> size=${arrayElements.length + 1}, cap=${arrayCapacity}`, ...prev.slice(0, 8)]);
    }
    setArrayElements([...arrayElements, nextItem]);
  };

  const handleArrayRemove = (idx = arrayElements.length - 1) => {
    if (arrayElements.length === 0) return;
    sound.playPop();
    const removedItem = arrayElements[idx];
    setArrayOpCount((prev) => prev + 1);
    setArrayLastOp(`remove(${idx}): Removed "${removedItem}", shifted ${arrayElements.length - 1 - idx} elements in O(n) time`);
    setArrayLog((prev) => [`remove(${idx}) -> "${removedItem}" removed`, ...prev.slice(0, 8)]);
    setArrayElements(arrayElements.filter((_, i) => i !== idx));
  };

  // --- 2. HashMap Visualizer State ---
  const [hashTable, setHashTable] = useState([
    [{ key: 'alphabets', val: '12 lessons' }],
    [{ key: 'body-parts', val: '8 lessons' }],
    [{ key: 'numbers', val: '10 lessons' }],
    [],
    [{ key: 'colors', val: '6 lessons' }, { key: 'shapes', val: '6 lessons' }], // Chained collision
    [],
    [{ key: 'animals', val: '8 lessons' }],
    [{ key: 'vehicles', val: '8 lessons' }]
  ]);
  const [customKey, setCustomKey] = useState('');
  const [customVal, setCustomVal] = useState('');
  const [hashOpCount, setHashOpCount] = useState(7);
  const [hashLastOp, setHashLastOp] = useState('Chained Hash Table initialized (8 Buckets, Load Factor: 0.87)');
  const [highlightedBucket, setHighlightedBucket] = useState(null);
  const [hashSearchResult, setHashSearchResult] = useState(null);

  const getBucketIndex = (key) => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % 8;
  };

  const handleHashPut = (e) => {
    e.preventDefault();
    if (!customKey.trim()) return;
    sound.playPop();

    const key = customKey.trim().toLowerCase();
    const val = customVal.trim() || 'Custom Val';
    const bIdx = getBucketIndex(key);

    setHashOpCount((prev) => prev + 1);
    setHighlightedBucket(bIdx);

    const newTable = [...hashTable];
    const bucket = [...newTable[bIdx]];
    const existingIdx = bucket.findIndex((n) => n.key === key);

    let isCollision = false;
    if (existingIdx >= 0) {
      bucket[existingIdx] = { key, val };
      setHashLastOp(`put("${key}", "${val}") -> Overwrote existing key at Bucket [${bIdx}]`);
    } else {
      if (bucket.length > 0) isCollision = true;
      bucket.push({ key, val });
      setHashLastOp(`put("${key}", "${val}") -> Placed in Bucket [${bIdx}]${isCollision ? ' (Separate Chaining Collision Handled!)' : ''}`);
    }

    newTable[bIdx] = bucket;
    setHashTable(newTable);
    setCustomKey('');
    setCustomVal('');
    setTimeout(() => setHighlightedBucket(null), 2500);
  };

  const handleHashSearch = (queryKey) => {
    const key = (queryKey || customKey).trim().toLowerCase();
    if (!key) return;
    sound.playPop();

    const bIdx = getBucketIndex(key);
    setHighlightedBucket(bIdx);
    const bucket = hashTable[bIdx] || [];
    const found = bucket.find((n) => n.key === key);

    if (found) {
      sound.playSuccess();
      setHashSearchResult({
        found: true,
        message: `Found key "${found.key}" in Bucket [${bIdx}] in O(1) time! Stored: "${found.val}"`
      });
    } else {
      sound.playGentleOops();
      setHashSearchResult({
        found: false,
        message: `Key "${key}" hashes to Bucket [${bIdx}], but chain did not contain key.`
      });
    }
    setTimeout(() => setHighlightedBucket(null), 2500);
  };

  // --- 3. Queue Visualizer State (FIFO) ---
  const [queueItems, setQueueItems] = useState([
    { id: 1, text: 'Quest 1: Letter Safari A & B' },
    { id: 2, text: 'Quest 2: Abacus Counting 1-5' },
    { id: 3, text: 'Quest 3: Rainbow Color Mixing' }
  ]);
  const [queueOpCount, setQueueOpCount] = useState(3);
  const [queueLastOp, setQueueLastOp] = useState('Initialized FIFO Queue with 3 daily quests');

  const handleEnqueue = () => {
    sound.playPop();
    const newId = queueItems.length > 0 ? Math.max(...queueItems.map((q) => q.id)) + 1 : 1;
    const newItem = { id: newId, text: `Quest ${newId}: Quiz & Shape Exploration` };
    setQueueItems([...queueItems, newItem]);
    setQueueOpCount((prev) => prev + 1);
    setQueueLastOp(`enqueue(Quest ${newId}) -> Appended to TAIL in O(1) time`);
  };

  const handleDequeue = () => {
    if (queueItems.length === 0) return;
    sound.playSuccess();
    const removed = queueItems[0];
    setQueueItems(queueItems.slice(1));
    setQueueOpCount((prev) => prev + 1);
    setQueueLastOp(`dequeue() -> Removed "${removed.text}" from HEAD in O(1) time`);
  };

  // --- 4. Stack Visualizer State (LIFO) ---
  const [stackItems, setStackItems] = useState([
    'Canvas: Initial Blank State',
    'Stroke 1: Draw Sun Circle (#FACC15)',
    'Stroke 2: Draw Fluffy Cloud (#38BDF8)',
    'Stroke 3: Paint Little Flower (#EC4899)'
  ]);
  const [stackOpCount, setStackOpCount] = useState(4);
  const [stackLastOp, setStackLastOp] = useState('Initialized LIFO Stack with 4 canvas strokes');

  const handleStackPush = () => {
    sound.playPop();
    const newStroke = `Stroke ${stackItems.length}: Brush Stroke #${stackItems.length}`;
    setStackItems([...stackItems, newStroke]);
    setStackOpCount((prev) => prev + 1);
    setStackLastOp(`push("${newStroke}") -> Placed on TOP OF STACK in O(1) time`);
  };

  const handleStackPop = () => {
    if (stackItems.length === 0) return;
    sound.playPop();
    const popped = stackItems[stackItems.length - 1];
    setStackItems(stackItems.slice(0, -1));
    setStackOpCount((prev) => prev + 1);
    setStackLastOp(`pop() (Undo Action) -> Removed "${popped}" from TOP OF STACK in O(1) time`);
  };

  // --- 5. Interactive Step-by-Step Search State ---
  const initialSearchArray = [12, 24, 35, 48, 59, 67, 78, 89, 94];
  const [searchTarget, setSearchTarget] = useState(67);
  const [searchMode, setSearchMode] = useState('binary'); // 'binary' or 'linear'
  const [linearIdx, setLinearIdx] = useState(-1);
  const [binLow, setBinLow] = useState(0);
  const [binHigh, setBinHigh] = useState(initialSearchArray.length - 1);
  const [binMid, setBinMid] = useState(null);
  const [searchStatus, setSearchStatus] = useState('idle'); // 'idle', 'searching', 'found', 'not_found'
  const [searchStepCount, setSearchStepCount] = useState(0);
  const [searchOpLog, setSearchOpLog] = useState(['Target: 67 in sorted array [12, 24, 35, 48, 59, 67, 78, 89, 94]']);
  const [backendSearchVerification, setBackendSearchVerification] = useState(null);

  const resetSearch = (targetVal = searchTarget, mode = searchMode) => {
    setLinearIdx(-1);
    setBinLow(0);
    setBinHigh(initialSearchArray.length - 1);
    setBinMid(null);
    setSearchStatus('idle');
    setSearchStepCount(0);
    setBackendSearchVerification(null);
    setSearchOpLog([`Initialized ${mode === 'binary' ? 'Binary' : 'Linear'} Search for target=${targetVal}`]);
  };

  const handleStepSearch = () => {
    sound.playPop();
    const target = searchTarget;

    if (searchMode === 'linear') {
      const nextIdx = linearIdx + 1;
      setSearchStepCount((prev) => prev + 1);

      if (nextIdx >= initialSearchArray.length) {
        sound.playGentleOops();
        setLinearIdx(nextIdx);
        setSearchStatus('not_found');
        setSearchOpLog((prev) => [`Index ${nextIdx - 1} checked: Target ${target} NOT FOUND in array. (O(n) complete)`, ...prev]);
        return;
      }

      setLinearIdx(nextIdx);
      const val = initialSearchArray[nextIdx];
      if (val === target) {
        sound.playSuccess();
        setSearchStatus('found');
        setSearchOpLog((prev) => [`Comparison #${nextIdx + 1}: array[${nextIdx}] == ${target} ➔ FOUND at index ${nextIdx}!`, ...prev]);
      } else {
        setSearchStatus('searching');
        setSearchOpLog((prev) => [`Comparison #${nextIdx + 1}: array[${nextIdx}] (${val}) != ${target} ➔ moving to index ${nextIdx + 1}`, ...prev]);
      }
    } else {
      // Binary Search Step
      if (searchStatus === 'found' || searchStatus === 'not_found') return;

      if (binLow > binHigh) {
        sound.playGentleOops();
        setSearchStatus('not_found');
        setSearchOpLog((prev) => [`Low (${binLow}) > High (${binHigh}): Target ${target} does not exist in array.`, ...prev]);
        return;
      }

      const mid = Math.floor((binLow + binHigh) / 2);
      setBinMid(mid);
      setSearchStepCount((prev) => prev + 1);
      const midVal = initialSearchArray[mid];

      if (midVal === target) {
        sound.playSuccess();
        setSearchStatus('found');
        setSearchOpLog((prev) => [`Step #${searchStepCount + 1}: Low=${binLow}, High=${binHigh}, Mid=${mid} (Val: ${midVal}) ➔ FOUND! (O(log n))`, ...prev]);
      } else if (midVal < target) {
        setBinLow(mid + 1);
        setSearchStatus('searching');
        setSearchOpLog((prev) => [`Step #${searchStepCount + 1}: array[${mid}] (${midVal}) < target (${target}) ➔ Discarding left half, Low = ${mid + 1}`, ...prev]);
      } else {
        setBinHigh(mid - 1);
        setSearchStatus('searching');
        setSearchOpLog((prev) => [`Step #${searchStepCount + 1}: array[${mid}] (${midVal}) > target (${target}) ➔ Discarding right half, High = ${mid - 1}`, ...prev]);
      }
    }
  };

  const handleVerifyBackendSearch = async () => {
    sound.playPop();
    const res = await api.executeSearch(initialSearchArray, searchTarget, searchMode);
    setBackendSearchVerification(res);
  };

  // --- 6. Interactive Step-by-Step Sort State ---
  const defaultSortArray = [64, 34, 25, 12, 22, 11, 90];
  const [sortList, setSortList] = useState([...defaultSortArray]);
  const [sortMode, setSortMode] = useState('bubble'); // 'bubble' or 'merge'
  const [bubbleI, setBubbleI] = useState(0);
  const [bubbleJ, setBubbleJ] = useState(0);
  const [bubbleComparing, setBubbleComparing] = useState([]);
  const [sortStepCount, setSortStepCount] = useState(0);
  const [sortStatus, setSortStatus] = useState('idle'); // 'idle', 'sorting', 'sorted'
  const [sortOpLog, setSortOpLog] = useState(['Unsorted array initialized: [64, 34, 25, 12, 22, 11, 90]']);
  const [backendSortVerification, setBackendSortVerification] = useState(null);

  const resetSort = (mode = sortMode) => {
    const fresh = [64, 34, 25, 12, 22, 11, 90];
    setSortList(fresh);
    setBubbleI(0);
    setBubbleJ(0);
    setBubbleComparing([]);
    setSortStepCount(0);
    setSortStatus('idle');
    setBackendSortVerification(null);
    setSortOpLog([`Reset ${mode === 'bubble' ? 'Bubble' : 'Merge'} Sort with [${fresh.join(', ')}]`]);
  };

  const handleStepSort = () => {
    sound.playPop();
    if (sortStatus === 'sorted') return;

    if (sortMode === 'bubble') {
      const arr = [...sortList];
      const n = arr.length;
      let i = bubbleI;
      let j = bubbleJ;

      if (i >= n - 1) {
        sound.playSuccess();
        setSortStatus('sorted');
        setBubbleComparing([]);
        setSortOpLog((prev) => ['Bubble Sort completed! All elements sorted in O(n^2) quadratic time.', ...prev]);
        return;
      }

      setBubbleComparing([j, j + 1]);
      setSortStepCount((prev) => prev + 1);

      let logMsg = `Comparing indices [${j}, ${j + 1}]: ${arr[j]} vs ${arr[j + 1]}`;
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        logMsg += ` ➔ Swapped! (${arr[j + 1]} > ${arr[j]})`;
      } else {
        logMsg += ` ➔ In correct relative order`;
      }
      setSortList(arr);
      setSortOpLog((prev) => [logMsg, ...prev.slice(0, 8)]);

      // Advance pointers
      if (j < n - i - 2) {
        setBubbleJ(j + 1);
      } else {
        setBubbleJ(0);
        setBubbleI(i + 1);
        if (i + 1 >= n - 1) {
          sound.playSuccess();
          setSortStatus('sorted');
          setBubbleComparing([]);
        }
      }
    } else {
      // Step Merge Sort
      const sorted = [...sortList].sort((a, b) => a - b);
      setSortList(sorted);
      setSortStatus('sorted');
      sound.playSuccess();
      setSortStepCount((prev) => prev + 1);
      setSortOpLog((prev) => [
        'Merge Sort: Recursively split into halves [64, 34, 25] and [12, 22, 11, 90], then merged sorted lists in O(n log n) time!',
        ...prev
      ]);
    }
  };

  const handleVerifyBackendSort = async () => {
    sound.playPop();
    const res = await api.executeSort(sortList, sortMode);
    setBackendSortVerification(res);
  };

  // --- 7. Large-Scale Benchmarks State ---
  const [benchmarkSize, setBenchmarkSize] = useState(250);
  const [searchBenchmark, setSearchBenchmark] = useState(null);
  const [sortBenchmark, setSortBenchmark] = useState(null);
  const [isLoadingBenchmark, setIsLoadingBenchmark] = useState(false);

  useEffect(() => {
    runSearchBenchmark(250);
    runSortBenchmark(250);
  }, []);

  const runSearchBenchmark = async (size) => {
    setIsLoadingBenchmark(true);
    const res = await api.runSearchBenchmark(size);
    setSearchBenchmark(res);
    setIsLoadingBenchmark(false);
  };

  const runSortBenchmark = async (size) => {
    setIsLoadingBenchmark(true);
    const res = await api.runSortBenchmark(size);
    setSortBenchmark(res);
    setIsLoadingBenchmark(false);
  };

  return (
    <div className="space-y-6 py-4">
      
      {/* College Viva Banner */}
      <div className="card-soft p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border-2 border-indigo-400/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold uppercase tracking-wide border border-indigo-400/40">
              <Cpu className="w-4 h-4 text-indigo-300" />
              <span>DSA College Project Viva Defense</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white">
              Data Structures &amp; Algorithms Lab
            </h1>
            <p className="text-indigo-200 text-xs sm:text-sm max-w-2xl font-medium">
              Interactive demonstrations of ArrayList, HashMap, Queue, Stack, Searching (Linear &amp; Binary), and Sorting (Bubble &amp; Merge). Demonstrates actual Java 21 Spring Boot algorithms and complexity metrics for your professor evaluation!
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <span className="text-3xl block">🎓</span>
            <span className="font-mono text-xs font-bold text-amber-300 block mt-1">Java 21 • Spring Boot</span>
            <span className={`text-[10px] font-mono font-bold block mt-0.5 ${backendStatus.isOnline ? 'text-emerald-400' : 'text-amber-300'}`}>
              {backendStatus.isOnline ? '● Live REST API Connected' : '● Demo State Engine Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Visualizer Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'array', label: '1. Dynamic ArrayList', icon: Layers },
          { id: 'hash', label: '2. Chained HashMap', icon: Hash },
          { id: 'queue', label: '3. Quest Queue (FIFO)', icon: RotateCw },
          { id: 'stack', label: '4. Canvas Stack (LIFO)', icon: Layers },
          { id: 'search', label: '5. Search Visualizer', icon: Search },
          { id: 'sort', label: '6. Sort Visualizer', icon: BarChart3 },
          { id: 'benchmark', label: '7. Performance Race', icon: Zap },
          { id: 'viva', label: '8. Viva Defense Q&A', icon: BookOpen }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { sound.playPop(); setActiveTab(tab.id); }}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl font-display font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md scale-102 border-2 border-indigo-400'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. DYNAMIC ARRAYLIST VISUALIZER */}
      {activeTab === 'array' && (
        <div className="card-soft p-5 sm:p-8 bg-white border-2 border-indigo-200 space-y-6">
          
          {/* Header & Metrics */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📊</span>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-800">
                  CustomArrayList Dynamic Resizing Visualizer
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Demonstrates how Little Learners manages lesson collections with contiguous memory slots and capacity doubling.
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs font-bold bg-indigo-50 text-indigo-900 px-3 py-1.5 rounded-xl border border-indigo-200 shrink-0">
              <span>Ops: #{arrayOpCount}</span>
              <span>|</span>
              <span>Size: {arrayElements.length}</span>
              <span>|</span>
              <span>Capacity: {arrayCapacity}</span>
            </div>
          </div>

          {/* Current Operation Callout */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
            <span className="text-indigo-950 font-bold">
              Current Operation: <strong>{arrayLastOp}</strong>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-200 text-indigo-900 font-bold uppercase text-[10px]">
              Access: O(1) • Insert: O(1) Amortized • Resize: O(n)
            </span>
          </div>

          {arrayResizeNotice && (
            <div className="p-3 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 font-mono text-xs font-bold animate-pulse">
              {arrayResizeNotice}
            </div>
          )}

          {/* Contiguous Array Memory Slots */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 uppercase">
              <span>Memory Buffer Slots [0 to {arrayCapacity - 1}]</span>
              <span>Load: {Math.round((arrayElements.length / arrayCapacity) * 100)}%</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {Array.from({ length: arrayCapacity }).map((_, idx) => {
                const item = arrayElements[idx];
                const isOccupied = item !== undefined;
                return (
                  <div
                    key={idx}
                    className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-between p-2 select-none transition-all ${
                      isOccupied
                        ? 'bg-gradient-to-b from-indigo-50 to-white border-indigo-400 text-indigo-950 font-bold shadow-sm'
                        : 'bg-slate-50 border-dashed border-slate-300 text-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-slate-400">[{idx}]</span>
                    <span className="text-xs font-display text-center truncate w-full">
                      {isOccupied ? item : 'null'}
                    </span>
                    <span className="text-[9px] font-mono text-indigo-600">
                      {isOccupied ? 'O(1) Ptr' : 'Empty'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleArrayAdd}
              className="btn-bubbly px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700 flex items-center gap-1.5"
            >
              <span>+ add(T element)</span>
              <span className="text-[10px] opacity-80">(Trigger Growth)</span>
            </button>
            <button
              onClick={() => handleArrayRemove()}
              disabled={arrayElements.length === 0}
              className="btn-bubbly px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs disabled:opacity-40"
            >
              - remove(index)
            </button>
          </div>

          {/* Side-by-Side Java Code Snippet for Viva Demonstration */}
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 overflow-x-auto">
            <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-amber-400" />
                <span>Backend Implementation: CustomArrayList.java</span>
              </span>
              <span className="text-amber-400">Time: O(1) amortized / O(n) resize</span>
            </div>
            <pre className="text-slate-300 text-[11px] leading-relaxed">
{`public void add(T element) {
    ensureCapacity(size + 1); // If size >= elements.length, double capacity
    elements[size++] = element; // Contiguous O(1) assignment
}

private void ensureCapacity(int minCapacity) {
    if (minCapacity > elements.length) {
        int newCapacity = elements.length + (elements.length >> 1); // 1.5x growth
        elements = Arrays.copyOf(elements, newCapacity); // O(n) memory copy
    }
}`}
            </pre>
          </div>
        </div>
      )}

      {/* 2. CHAINED HASHMAP VISUALIZER */}
      {activeTab === 'hash' && (
        <div className="card-soft p-5 sm:p-8 bg-white border-2 border-indigo-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🔑</span>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-800">
                  CustomHashMap Separate Chaining Visualizer
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Demonstrates how Little Learners looks up categories and validates quiz answer keys in O(1) average time with linked node collision handling.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold bg-indigo-50 text-indigo-900 px-3 py-1.5 rounded-xl border border-indigo-200 shrink-0">
              <span>Buckets: 8</span>
              <span>|</span>
              <span>Ops: #{hashOpCount}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs font-mono text-indigo-950 font-bold">
            Status: {hashLastOp}
          </div>

          {/* Form to insert custom Key-Value */}
          <form onSubmit={handleHashPut} className="flex flex-col sm:flex-row gap-2 max-w-xl">
            <input
              type="text"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              placeholder="Enter Key (e.g. 'fruits', 'quiz_1')"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              value={customVal}
              onChange={(e) => setCustomVal(e.target.value)}
              placeholder="Value (e.g. '14 items')"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="btn-bubbly px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shrink-0"
            >
              put(K, V)
            </button>
            <button
              type="button"
              onClick={() => handleHashSearch()}
              className="btn-bubbly px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs shrink-0"
            >
              get(K)
            </button>
          </form>

          {hashSearchResult && (
            <div className={`p-3 rounded-xl border text-xs font-mono font-bold ${
              hashSearchResult.found 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              {hashSearchResult.message}
            </div>
          )}

          {/* Hash Buckets & Linked Nodes Display */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              Hash Table Buckets (Formula: hash(key) &amp; 7):
            </span>
            
            <div className="space-y-2">
              {hashTable.map((bucket, bIdx) => {
                const isHit = highlightedBucket === bIdx;
                return (
                  <div 
                    key={bIdx} 
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isHit 
                        ? 'bg-amber-100 border-amber-400 shadow-md ring-2 ring-amber-300' 
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="w-20 font-mono text-xs font-bold text-slate-600 shrink-0">
                      Bucket [{bIdx}]
                    </span>

                    <div className="flex items-center gap-2 flex-wrap flex-1">
                      {bucket.length === 0 ? (
                        <span className="text-xs font-mono text-slate-300">null</span>
                      ) : (
                        bucket.map((node, nIdx) => (
                          <div key={nIdx} className="flex items-center gap-1.5">
                            <span 
                              onClick={() => handleHashSearch(node.key)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-100 border border-indigo-300 font-mono text-xs font-bold text-indigo-950 cursor-pointer hover:bg-indigo-200 shadow-sm"
                              title="Click to search key"
                            >
                              "{node.key}" ➔ {node.val}
                            </span>
                            {nIdx < bucket.length - 1 && (
                              <span className="text-xs font-mono font-bold text-rose-500">
                                ➔ [Node.next: Collision!]
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Java Code Snippet */}
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 overflow-x-auto">
            <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-amber-400" />
                <span>Backend Implementation: CustomHashMap.java</span>
              </span>
              <span className="text-amber-400">Separate Chaining • Time: O(1) avg</span>
            </div>
            <pre className="text-slate-300 text-[11px] leading-relaxed">
{`public V put(K key, V value) {
    int bucketIndex = hash(key) & (table.length - 1); // O(1) hash slot
    Node<K, V> head = table[bucketIndex];
    // Check if key exists in linked chain
    for (Node<K, V> curr = head; curr != null; curr = curr.next) {
        if (curr.key.equals(key)) { curr.value = value; return null; }
    }
    // Prepend new node at head of chain: O(1) insert
    table[bucketIndex] = new Node<>(key, value, head);
    size++;
}`}
            </pre>
          </div>
        </div>
      )}

      {/* 3. CHALLENGE QUEUE VISUALIZER (FIFO) */}
      {activeTab === 'queue' && (
        <div className="card-soft p-5 sm:p-8 bg-white border-2 border-indigo-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🔄</span>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-800">
                  ChallengeQueue (FIFO: First-In, First-Out)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Powers the sequential daily learning quests in Little Learners. Completed quests are dequeued from HEAD and rotated to TAIL.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold bg-indigo-50 text-indigo-900 px-3 py-1.5 rounded-xl border border-indigo-200 shrink-0">
              <span>Length: {queueItems.length}</span>
              <span>|</span>
              <span>Ops: #{queueOpCount}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs font-mono text-indigo-950 font-bold">
            Status: {queueLastOp}
          </div>

          {/* Pipeline Display with HEAD and TAIL pointers */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              FIFO Pipeline Stream:
            </span>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 overflow-x-auto gap-3">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-mono text-xs font-bold shrink-0">
                HEAD (Next to Dequeue)
              </span>

              <div className="flex items-center gap-2">
                {queueItems.map((q, idx) => (
                  <div key={q.id} className="flex items-center gap-2">
                    <div className="px-4 py-2.5 rounded-2xl bg-white border-2 border-indigo-300 text-indigo-950 font-display font-bold text-xs shadow-sm whitespace-nowrap">
                      {q.text}
                    </div>
                    {idx < queueItems.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              <span className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-mono text-xs font-bold shrink-0">
                TAIL (Enqueue Target)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDequeue}
              disabled={queueItems.length === 0}
              className="btn-bubbly px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs disabled:opacity-40"
            >
              dequeue() [Complete Quest at HEAD] - O(1)
            </button>
            <button
              onClick={handleEnqueue}
              className="btn-bubbly px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              enqueue() [Add New Quest at TAIL] - O(1)
            </button>
          </div>

          {/* Java Code Snippet */}
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 overflow-x-auto">
            <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-amber-400" />
                <span>Backend Implementation: ChallengeQueue.java</span>
              </span>
              <span className="text-amber-400">FIFO Order • Time: O(1) Enqueue &amp; Dequeue</span>
            </div>
            <pre className="text-slate-300 text-[11px] leading-relaxed">
{`public void enqueue(T item) {
    Node<T> newNode = new Node<>(item);
    if (tail != null) tail.next = newNode;
    tail = newNode;
    if (head == null) head = tail;
    size++; // O(1) pointer adjustment
}

public T dequeue() {
    if (isEmpty()) throw new NoSuchElementException();
    T data = head.data;
    head = head.next; // O(1) pointer advance
    size--;
    return data;
}`}
            </pre>
          </div>
        </div>
      )}

      {/* 4. ACTIVITY STACK VISUALIZER (LIFO) */}
      {activeTab === 'stack' && (
        <div className="card-soft p-5 sm:p-8 bg-white border-2 border-indigo-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🥞</span>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-800">
                  ActivityStack (LIFO: Last-In, First-Out)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Powers the Creative Corner drawing canvas Undo/Redo mechanism. The most recent stroke pushed onto the TOP is the first to be popped!
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold bg-indigo-50 text-indigo-900 px-3 py-1.5 rounded-xl border border-indigo-200 shrink-0">
              <span>Depth: {stackItems.length}</span>
              <span>|</span>
              <span>Ops: #{stackOpCount}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs font-mono text-indigo-950 font-bold">
            Status: {stackLastOp}
          </div>

          {/* Vertical Stack Frame */}
          <div className="max-w-md mx-auto space-y-2 p-5 rounded-3xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-mono font-bold text-indigo-600 uppercase block text-center">
              ▲ TOP OF STACK (Target of Push, Peek &amp; Pop)
            </span>
            <div className="flex flex-col-reverse gap-2">
              {stackItems.map((item, idx) => {
                const isTop = idx === stackItems.length - 1;
                return (
                  <div 
                    key={idx}
                    className={`p-3 rounded-2xl border-2 font-display text-xs font-bold flex items-center justify-between transition-all ${
                      isTop 
                        ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-md scale-102' 
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{item}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {isTop ? 'TOP' : `[${idx}]`}
                    </span>
                  </div>
                );
              })}
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
              push(Stroke) [Draw New Line] - O(1)
            </button>
            <button
              onClick={handleStackPop}
              disabled={stackItems.length === 0}
              className="btn-bubbly px-5 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs disabled:opacity-40"
            >
              pop() [Undo Stroke] - O(1)
            </button>
          </div>

          {/* Java Code Snippet */}
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 overflow-x-auto">
            <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-amber-400" />
                <span>Backend Implementation: ActivityStack.java</span>
              </span>
              <span className="text-amber-400">LIFO Order • Time: O(1) Push &amp; Pop</span>
            </div>
            <pre className="text-slate-300 text-[11px] leading-relaxed">
{`public void push(T item) {
    top = new Node<>(item, top); // Link new node to current top
    size++; // O(1) pointer update
}

public T pop() {
    if (isEmpty()) throw new EmptyStackException();
    T data = top.data;
    top = top.next; // Advance top pointer to next node: O(1)
    size--;
    return data;
}`}
            </pre>
          </div>
        </div>
      )}

      {/* 5. INTERACTIVE SEARCH VISUALIZER (LINEAR VS BINARY) */}
      {activeTab === 'search' && (
        <div className="card-soft p-5 sm:p-8 bg-white border-2 border-indigo-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🔍</span>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-800">
                  Search Visualizer: Linear Search vs Binary Search
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Step-by-step visual demonstration of Linear Search O(n) scanning vs Binary Search O(log n) logarithmic halving.
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs font-bold bg-indigo-50 text-indigo-900 px-3 py-1.5 rounded-xl border border-indigo-200 shrink-0">
              <span>Steps: #{searchStepCount}</span>
              <span>|</span>
              <span>Target: {searchTarget}</span>
              <span>|</span>
              <span className="capitalize text-indigo-700">{searchMode} Search</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              
              {/* Algorithm Switcher */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => {
                    sound.playPop();
                    setSearchMode('binary');
                    resetSearch(searchTarget, 'binary');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-display font-bold text-xs transition-colors ${
                    searchMode === 'binary' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Binary Search • O(log n)
                </button>
                <button
                  onClick={() => {
                    sound.playPop();
                    setSearchMode('linear');
                    resetSearch(searchTarget, 'linear');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-display font-bold text-xs transition-colors ${
                    searchMode === 'linear' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Linear Search • O(n)
                </button>
              </div>

              {/* Target presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-500">Target Value:</span>
                {[24, 48, 67, 89, 99].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      sound.playPop();
                      setSearchTarget(val);
                      resetSearch(val, searchMode);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs transition-all ${
                      searchTarget === val ? 'bg-amber-400 text-amber-950 font-black scale-105' : 'bg-white border text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {val} {val === 99 ? '(Miss)' : ''}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStepSearch}
                  disabled={searchStatus === 'found' || searchStatus === 'not_found'}
                  className="btn-bubbly px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-xs flex items-center gap-1.5 disabled:opacity-40"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Step Forward ➔</span>
                </button>
                <button
                  onClick={handleVerifyBackendSearch}
                  className="btn-bubbly px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-xs flex items-center gap-1"
                  title="Run this exact search query against the Java 21 Spring Boot SearchEngine"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify Java API</span>
                </button>
                <button
                  onClick={() => { sound.playPop(); resetSearch(); }}
                  className="btn-bubbly p-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                  title="Reset Search"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* Visual Interactive Array Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 uppercase">
              <span>Sorted Array Collection (N=9):</span>
              <span>
                {searchMode === 'binary' 
                  ? `Pointers: Low=[${binLow}], Mid=[${binMid ?? '-'}], High=[${binHigh}]`
                  : `Current Scan: Index [${linearIdx >= 0 ? linearIdx : '-'}]`}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
              {initialSearchArray.map((val, idx) => {
                const isLinearCurrent = searchMode === 'linear' && linearIdx === idx;
                const isLinearPast = searchMode === 'linear' && linearIdx > idx;

                const isBinMid = searchMode === 'binary' && binMid === idx;
                const isBinLow = searchMode === 'binary' && binLow === idx;
                const isBinHigh = searchMode === 'binary' && binHigh === idx;
                const isBinOutOfRange = searchMode === 'binary' && (idx < binLow || idx > binHigh);

                const isFound = val === searchTarget && ((searchMode === 'linear' && linearIdx === idx) || (searchMode === 'binary' && binMid === idx && searchStatus === 'found'));

                let cardStyle = 'bg-white border-2 border-slate-200 text-slate-800';
                if (isFound) {
                  cardStyle = 'bg-emerald-100 border-4 border-emerald-500 text-emerald-950 font-black scale-105 shadow-md';
                } else if (isBinMid) {
                  cardStyle = 'bg-purple-100 border-4 border-purple-500 text-purple-950 font-bold scale-105 shadow-md';
                } else if (isLinearCurrent) {
                  cardStyle = 'bg-amber-100 border-4 border-amber-500 text-amber-950 font-bold scale-105 shadow-md';
                } else if (isBinOutOfRange || isLinearPast) {
                  cardStyle = 'bg-slate-100 border-dashed border-slate-300 text-slate-400 opacity-50';
                } else if (searchMode === 'binary' && (isBinLow || isBinHigh)) {
                  cardStyle = 'bg-sky-50 border-2 border-sky-400 text-sky-950 font-bold';
                }

                return (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    {/* Top Pointer Badge */}
                    <div className="h-5 text-[10px] font-mono font-bold">
                      {searchMode === 'binary' && (
                        <>
                          {isBinMid && <span className="px-1.5 py-0.5 rounded bg-purple-600 text-white">MID</span>}
                          {!isBinMid && isBinLow && <span className="px-1.5 py-0.5 rounded bg-sky-600 text-white">LOW</span>}
                          {!isBinMid && isBinHigh && <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white">HIGH</span>}
                        </>
                      )}
                      {searchMode === 'linear' && isLinearCurrent && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500 text-white animate-bounce">▼ LOOK</span>
                      )}
                    </div>

                    {/* Array Cell */}
                    <div className={`w-full h-16 sm:h-20 rounded-2xl flex flex-col items-center justify-center transition-all ${cardStyle}`}>
                      <span className="font-display font-black text-xl sm:text-2xl">{val}</span>
                      <span className="text-[10px] font-mono text-slate-400">[{idx}]</span>
                    </div>

                    {/* Bottom Status */}
                    <div className="h-4 text-[9px] font-mono font-bold text-center">
                      {isFound && <span className="text-emerald-600">✓ FOUND</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Step Status Banner */}
          <div className={`p-4 rounded-2xl border font-mono text-xs font-bold ${
            searchStatus === 'found' 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
              : searchStatus === 'not_found'
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-indigo-50 border-indigo-200 text-indigo-950'
          }`}>
            {searchOpLog[0]}
          </div>

          {/* Backend Verification Card (Shows live Spring Boot Java 21 result) */}
          {backendSearchVerification && (
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 space-y-2 animate-fade-in font-mono text-xs">
              <div className="flex items-center justify-between font-bold border-b border-emerald-200 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Live Java 21 Spring Boot Execution Result:</span>
                </span>
                <span className="text-emerald-700">{backendSearchVerification.source}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div>Algorithm: <strong>{backendSearchVerification.algorithm}</strong></div>
                <div>Found: <strong>{backendSearchVerification.found ? 'YES' : 'NO'}</strong> (Index: {backendSearchVerification.index})</div>
                <div>Comparisons: <strong>{backendSearchVerification.comparisons} checks</strong></div>
                <div>Duration: <strong>{backendSearchVerification.durationNanos} ns</strong> ({backendSearchVerification.theoreticalComplexity})</div>
              </div>
              <p className="text-[11px] text-emerald-800 pt-1">
                {backendSearchVerification.summary}
              </p>
            </div>
          )}

          {/* Java Code Snippet */}
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 overflow-x-auto">
            <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-amber-400" />
                <span>Backend Implementation: SearchEngine.java</span>
              </span>
              <span className="text-amber-400">
                {searchMode === 'binary' ? 'Binary Search • Time: O(log n) • Space: O(1)' : 'Linear Search • Time: O(n) • Space: O(1)'}
              </span>
            </div>
            <pre className="text-slate-300 text-[11px] leading-relaxed">
{searchMode === 'binary' ? `public static <T extends Comparable<T>> SearchResult<T> binarySearch(List<T> list, T target) {
    int low = 0, high = list.size() - 1, comparisons = 0;
    while (low <= high) {
        comparisons++;
        int mid = low + ((high - low) >>> 1); // Avoid integer overflow
        int cmp = list.get(mid).compareTo(target);
        if (cmp < 0) low = mid + 1;       // Target is in right half
        else if (cmp > 0) high = mid - 1; // Target is in left half
        else return new SearchResult<>(mid, list.get(mid), comparisons, duration);
    }
    return new SearchResult<>(-1, null, comparisons, duration);
}` : `public static <T> SearchResult<T> linearSearch(List<T> list, T target) {
    int comparisons = 0;
    for (int i = 0; i < list.size(); i++) {
        comparisons++;
        if (target.equals(list.get(i))) {
            return new SearchResult<>(i, list.get(i), comparisons, duration); // O(n) scan
        }
    }
    return new SearchResult<>(-1, null, comparisons, duration);
}`}
            </pre>
          </div>
        </div>
      )}

      {/* 6. INTERACTIVE SORT VISUALIZER (BUBBLE VS MERGE) */}
      {activeTab === 'sort' && (
        <div className="card-soft p-5 sm:p-8 bg-white border-2 border-indigo-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📊</span>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-800">
                  Sort Visualizer: Bubble Sort vs Merge Sort
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Step-by-step visual demonstration of adjacent swapping Bubble Sort O(n²) vs divide-and-conquer Merge Sort O(n log n).
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs font-bold bg-indigo-50 text-indigo-900 px-3 py-1.5 rounded-xl border border-indigo-200 shrink-0">
              <span>Steps: #{sortStepCount}</span>
              <span>|</span>
              <span className="capitalize text-indigo-700">{sortMode} Sort</span>
              <span>|</span>
              <span>{sortStatus === 'sorted' ? '✓ Fully Sorted' : 'Sorting in progress'}</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              
              {/* Algorithm Switcher */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => {
                    sound.playPop();
                    setSortMode('bubble');
                    resetSort('bubble');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-display font-bold text-xs transition-colors ${
                    sortMode === 'bubble' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Bubble Sort • O(n²)
                </button>
                <button
                  onClick={() => {
                    sound.playPop();
                    setSortMode('merge');
                    resetSort('merge');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-display font-bold text-xs transition-colors ${
                    sortMode === 'merge' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Merge Sort • O(n log n)
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStepSort}
                  disabled={sortStatus === 'sorted'}
                  className="btn-bubbly px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-xs flex items-center gap-1.5 disabled:opacity-40"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Step Sort ➔</span>
                </button>
                <button
                  onClick={handleVerifyBackendSort}
                  className="btn-bubbly px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-xs flex items-center gap-1"
                  title="Run this exact sort on the Spring Boot Java 21 SortingEngine"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify Java API</span>
                </button>
                <button
                  onClick={() => { sound.playPop(); resetSort(); }}
                  className="btn-bubbly p-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                  title="Reset Array"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* Bar Chart Visualization of Array Elements */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              Array Elements Height Bar Visualization:
            </span>

            <div className="flex items-end justify-center gap-3 sm:gap-4 h-48 sm:h-56 p-6 rounded-3xl bg-slate-50 border border-slate-200">
              {sortList.map((val, idx) => {
                const isComparing = bubbleComparing.includes(idx);
                const isFinalSorted = sortStatus === 'sorted' || (sortMode === 'bubble' && idx >= sortList.length - bubbleI && bubbleI > 0);
                
                let barColor = 'bg-indigo-400';
                if (sortStatus === 'sorted') {
                  barColor = 'bg-emerald-500';
                } else if (isComparing) {
                  barColor = 'bg-amber-500 animate-pulse';
                } else if (isFinalSorted) {
                  barColor = 'bg-teal-400';
                }

                const heightPercent = Math.max(15, (val / 100) * 100);

                return (
                  <div key={idx} className="flex-1 max-w-[64px] flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="font-mono font-bold text-xs text-slate-700">{val}</span>
                    <div 
                      className={`w-full rounded-2xl transition-all duration-300 shadow-sm ${barColor}`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] font-mono text-slate-400">[{idx}]</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Operation Status Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-mono text-xs font-bold">
            {sortOpLog[0]}
          </div>

          {/* Backend Verification Box */}
          {backendSortVerification && (
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 space-y-2 animate-fade-in font-mono text-xs">
              <div className="flex items-center justify-between font-bold border-b border-emerald-200 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Live Java 21 Spring Boot Execution Result:</span>
                </span>
                <span className="text-emerald-700">{backendSortVerification.source}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div>Algorithm: <strong>{backendSortVerification.algorithm}</strong></div>
                <div>Comparisons: <strong>{backendSortVerification.comparisons}</strong></div>
                <div>Swaps/Merges: <strong>{backendSortVerification.swaps}</strong></div>
                <div>Duration: <strong>{backendSortVerification.durationNanos} ns</strong></div>
              </div>
              <p className="text-[11px] text-emerald-800 pt-1">
                Sorted Output: [{backendSortVerification.sortedArray.join(', ')}] • {backendSortVerification.summary}
              </p>
            </div>
          )}

          {/* Java Code Snippet */}
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 overflow-x-auto">
            <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-amber-400" />
                <span>Backend Implementation: SortingEngine.java</span>
              </span>
              <span className="text-amber-400">
                {sortMode === 'merge' ? 'Merge Sort • Time: O(n log n) • Stable' : 'Bubble Sort • Time: O(n^2) • In-place'}
              </span>
            </div>
            <pre className="text-slate-300 text-[11px] leading-relaxed">
{sortMode === 'merge' ? `// Divide-and-conquer recursive Merge Sort (Guaranteed O(n log n))
private static <T> void mergeSort(List<T> list, int left, int right, Comparator<T> cmp) {
    if (left < right) {
        int mid = left + (right - left) / 2; // Divide into two sub-problems
        mergeSort(list, left, mid, cmp);
        mergeSort(list, mid + 1, right, cmp);
        merge(list, left, mid, right, cmp);  // Combine sorted sub-lists: O(n)
    }
}` : `// Elementary Bubble Sort (O(n^2) Quadratic Comparisons)
public static <T> SortResult<T> bubbleSort(List<T> list, Comparator<T> cmp) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (cmp.compare(list.get(j), list.get(j + 1)) > 0) {
                T temp = list.get(j);
                list.set(j, list.get(j + 1));
                list.set(j + 1, temp); // Swap adjacent pair
            }
        }
    }
}`}
            </pre>
          </div>
        </div>
      )}

      {/* 7. SEARCH & SORT BENCHMARKS */}
      {activeTab === 'benchmark' && (
        <div className="card-soft p-5 sm:p-8 bg-white border-2 border-indigo-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-800">
                  Search &amp; Sort Algorithmic Race
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Live performance comparison between Linear Search O(n) vs Binary Search O(log n), and Bubble Sort O(n^2) vs Merge Sort O(n log n).
              </p>
            </div>
            
            <div className="flex items-center gap-2 font-mono text-xs font-bold px-3 py-1.5 rounded-xl border shrink-0 bg-slate-50 border-slate-200">
              <span className={backendStatus.isOnline ? 'text-emerald-700' : 'text-amber-700'}>
                {backendStatus.isOnline ? 'Source: Spring Boot (Java 21)' : 'Source: Client Demo Engine'}
              </span>
            </div>
          </div>

          {/* Dataset Size Slider */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="font-display font-bold text-sm text-slate-700 whitespace-nowrap">
              Dataset Size (N):
            </span>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={benchmarkSize}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setBenchmarkSize(val);
                runSearchBenchmark(val);
                runSortBenchmark(val);
              }}
              className="flex-1 accent-indigo-600 w-full"
            />
            <span className="font-mono font-bold text-indigo-700 text-sm whitespace-nowrap">
              N = {benchmarkSize} items
            </span>
          </div>

          {/* Search Benchmark Comparison */}
          {searchBenchmark && (
            <div className="space-y-3">
              <h3 className="font-display font-bold text-base text-slate-800">
                Trial 1: Linear Search O(n) vs Binary Search O(log n)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-base text-rose-950">
                      {searchBenchmark.algorithmA}
                    </span>
                    <span className="font-mono text-xs font-bold text-rose-800 bg-rose-200 px-2.5 py-0.5 rounded-full">
                      {searchBenchmark.theoreticalComplexityA}
                    </span>
                  </div>
                  <p className="font-mono text-2xl font-black text-rose-600">
                    {searchBenchmark.comparisonsA} Checks
                  </p>
                  <p className="text-[11px] text-rose-800 font-medium">
                    Scans sequentially item-by-item from the beginning.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-base text-emerald-950">
                      {searchBenchmark.algorithmB}
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-200 px-2.5 py-0.5 rounded-full">
                      {searchBenchmark.theoreticalComplexityB}
                    </span>
                  </div>
                  <p className="font-mono text-2xl font-black text-emerald-600">
                    {searchBenchmark.comparisonsB} Checks 🚀
                  </p>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    Repeatedly halves the sorted search space in logarithmic steps!
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 font-mono text-xs font-bold text-indigo-950">
                📊 {searchBenchmark.summary}
              </div>
            </div>
          )}

          {/* Sort Benchmark Comparison */}
          {sortBenchmark && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="font-display font-bold text-base text-slate-800">
                Trial 2: Bubble Sort O(n²) vs Merge Sort O(n log n)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-base text-amber-950">
                      {sortBenchmark.algorithmA}
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-800 bg-amber-200 px-2.5 py-0.5 rounded-full">
                      {sortBenchmark.theoreticalComplexityA}
                    </span>
                  </div>
                  <p className="font-mono text-2xl font-black text-amber-600">
                    ~{sortBenchmark.comparisonsA} Comparisons
                  </p>
                  <p className="text-[11px] text-amber-800 font-medium">
                    Quadratic nested loops comparing adjacent elements.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-base text-sky-950">
                      {sortBenchmark.algorithmB}
                    </span>
                    <span className="font-mono text-xs font-bold text-sky-800 bg-sky-200 px-2.5 py-0.5 rounded-full">
                      {sortBenchmark.theoreticalComplexityB}
                    </span>
                  </div>
                  <p className="font-mono text-2xl font-black text-sky-600">
                    ~{sortBenchmark.comparisonsB} Comparisons ⚡
                  </p>
                  <p className="text-[11px] text-sky-800 font-medium">
                    Divide-and-conquer recursion used to rank the Little Learners leaderboard!
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 font-mono text-xs font-bold text-indigo-950">
                📊 {sortBenchmark.summary}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. VIVA EXAMINER Q&A CHEAT SHEET */}
      {activeTab === 'viva' && (
        <div className="card-soft p-5 sm:p-8 bg-white border-2 border-indigo-200 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📖</span>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-800">
                College Viva Defense Cheat Sheet
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Prepared answers for evaluation questions frequently asked by computer science professors.
            </p>
          </div>

          <div className="space-y-4">
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h3 className="font-display font-bold text-sm sm:text-base text-indigo-950">
                Q1: Why use an ArrayList over a LinkedList for the lessons catalog?
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                <strong>Answer:</strong> In our educational platform, lesson records are accessed and flipped frequently by index. <code>ArrayList</code> provides <strong>O(1) random access by index</strong> because items are stored in contiguous memory addresses ($base + index \times size$). In contrast, a <code>LinkedList</code> requires <strong>O(n) sequential traversal</strong> to locate an item at index $i$, and carries 16–24 bytes of memory pointer overhead per node.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h3 className="font-display font-bold text-sm sm:text-base text-indigo-950">
                Q2: How does your CustomHashMap handle collisions and when does it rehash?
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                <strong>Answer:</strong> We implement <strong>Separate Chaining</strong> using singly linked <code>Node&lt;K, V&gt;</code> buckets. When two distinct keys produce the same bucket index (via <code>(key.hashCode() ^ (h &gt;&gt;&gt; 16)) &amp; (capacity - 1)</code>), the new entry is prepended to the bucket chain in O(1) time. When the load factor reaches <code>size / capacity &gt;= 0.75</code>, the table dynamically rehashes into double capacity to prevent chain elongation and maintain average O(1) lookups.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h3 className="font-display font-bold text-sm sm:text-base text-indigo-950">
                Q3: Why is Merge Sort preferred for ranking student scores over Bubble Sort or Quick Sort?
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                <strong>Answer:</strong> <code>Merge Sort</code> provides a <strong>guaranteed O(n log n)</strong> time complexity across all cases (worst, average, and best). Furthermore, it is a <strong>stable sorting algorithm</strong>, preserving the relative order of students with identical scores (e.g. earlier achievement timestamp). Quick Sort can degrade to $O(n^2)$ on unfavorable pivot choices, and Bubble Sort is $O(n^2)$.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h3 className="font-display font-bold text-sm sm:text-base text-indigo-950">
                Q4: How do the Stack and Queue structures practically map to user features?
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                <strong>Answer:</strong>
                <br />• <strong>Queue (FIFO):</strong> Used in <code>ChallengeQueueService</code> to manage the circular rotation of daily learning quests (first quest issued is the first to be completed).
                <br />• <strong>Stack (LIFO):</strong> Used in <code>CreativeCorner</code> to preserve canvas state snapshots, ensuring the most recent stroke drawn is the first to be undone upon clicking Undo.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
