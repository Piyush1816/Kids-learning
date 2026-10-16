package com.littlelearners.service;

import com.littlelearners.dsa.SearchEngine;
import com.littlelearners.dsa.SortingEngine;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class DsaVisualizerService {

    public static class BenchmarkComparison {
        private String algorithmA;
        private String algorithmB;
        private int inputSize;
        private long comparisonsA;
        private long comparisonsB;
        private long timeNanosA;
        private long timeNanosB;
        private String theoreticalComplexityA;
        private String theoreticalComplexityB;
        private String summary;

        public BenchmarkComparison(String algorithmA, String algorithmB, int inputSize,
                                   long comparisonsA, long comparisonsB, long timeNanosA,
                                   long timeNanosB, String theoreticalComplexityA,
                                   String theoreticalComplexityB, String summary) {
            this.algorithmA = algorithmA;
            this.algorithmB = algorithmB;
            this.inputSize = inputSize;
            this.comparisonsA = comparisonsA;
            this.comparisonsB = comparisonsB;
            this.timeNanosA = timeNanosA;
            this.timeNanosB = timeNanosB;
            this.theoreticalComplexityA = theoreticalComplexityA;
            this.theoreticalComplexityB = theoreticalComplexityB;
            this.summary = summary;
        }

        public String getAlgorithmA() { return algorithmA; }
        public String getAlgorithmB() { return algorithmB; }
        public int getInputSize() { return inputSize; }
        public long getComparisonsA() { return comparisonsA; }
        public long getComparisonsB() { return comparisonsB; }
        public long getTimeNanosA() { return timeNanosA; }
        public long getTimeNanosB() { return timeNanosB; }
        public String getTheoreticalComplexityA() { return theoreticalComplexityA; }
        public String getTheoreticalComplexityB() { return theoreticalComplexityB; }
        public String getSummary() { return summary; }
    }

    public BenchmarkComparison runSearchBenchmark(int size) {
        List<Integer> list = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            list.add(i * 2); // sorted even numbers
        }
        int target = (size - 2) * 2; // target near the end for worst-case Linear search

        SearchEngine.SearchResult<Integer> linearRes = SearchEngine.linearSearch(list, target);
        SearchEngine.SearchResult<Integer> binaryRes = SearchEngine.binarySearch(list, target);

        String summary = String.format(
            "For size N=%d, Binary Search completed in %d steps vs %d steps in Linear Search! (O(log n) vs O(n))",
            size, binaryRes.getComparisons(), linearRes.getComparisons()
        );

        return new BenchmarkComparison(
            "Linear Search",
            "Binary Search",
            size,
            linearRes.getComparisons(),
            binaryRes.getComparisons(),
            linearRes.getDurationNanos(),
            binaryRes.getDurationNanos(),
            "O(n)",
            "O(log n)",
            summary
        );
    }

    public BenchmarkComparison runSortBenchmark(int size) {
        Random rng = new Random(42);
        List<Integer> datasetA = new ArrayList<>(size);
        for (int i = 0; i < size; i++) {
            datasetA.add(rng.nextInt(10000));
        }
        List<Integer> datasetB = new ArrayList<>(datasetA);

        SortingEngine.SortResult<Integer> bubbleRes = SortingEngine.bubbleSort(datasetA, Integer::compareTo);
        SortingEngine.SortResult<Integer> mergeRes = SortingEngine.mergeSort(datasetB, Integer::compareTo);

        String summary = String.format(
            "For size N=%d, Merge Sort took %d comparisons vs %d comparisons in Bubble Sort! (O(n log n) vs O(n^2))",
            size, mergeRes.getComparisons(), bubbleRes.getComparisons()
        );

        return new BenchmarkComparison(
            "Bubble Sort",
            "Merge Sort",
            size,
            bubbleRes.getComparisons(),
            mergeRes.getComparisons(),
            bubbleRes.getDurationNanos(),
            mergeRes.getDurationNanos(),
            "O(n^2)",
            "O(n log n)",
            summary
        );
    }

    public List<Map<String, Object>> getDsaConcepts() {
        List<Map<String, Object>> concepts = new ArrayList<>();

        concepts.add(createConcept(
            "Dynamic Array (CustomArrayList)",
            "ArrayList<T>",
            "O(1) access by index, O(1) amortized insertion, O(n) resize/shift",
            "O(n)",
            "Stores lessons, achievements, and question collections in Little Learners. Demonstrates dynamic 1.5x capacity resizing when element threshold is reached."
        ));

        concepts.add(createConcept(
            "Hash Table (CustomHashMap)",
            "HashMap<K, V>",
            "O(1) average lookup, insertion, and deletion",
            "O(n)",
            "Enables instant O(1) lookups of categories and answer keys during quiz grading. Implements separate chaining collision handling with Node<K, V> buckets."
        ));

        concepts.add(createConcept(
            "Queue (ChallengeQueue)",
            "Queue<T> / LinkedList<T>",
            "O(1) enqueue, O(1) dequeue, O(1) peek",
            "O(n)",
            "Maintains the child's sequential daily learning challenge queue. Respects First-In, First-Out (FIFO) so completed tasks rotate seamlessly."
        ));

        concepts.add(createConcept(
            "Stack (ActivityStack)",
            "Stack<T> / Deque<T>",
            "O(1) push, O(1) pop, O(1) peek",
            "O(n)",
            "Powers the Creative Corner drawing canvas undo/redo system and keeps navigation breadcrumbs for going back to previous learning lessons."
        ));

        concepts.add(createConcept(
            "Binary Search (SearchEngine)",
            "Collections.binarySearch()",
            "O(log n) search time on sorted elements",
            "O(1)",
            "Divides sorted curricula in half repeatedly to locate lessons and dictionary items in logarithmic time."
        ));

        concepts.add(createConcept(
            "Merge Sort (SortingEngine)",
            "Arrays.sort() / TimSort",
            "O(n log n) divide-and-conquer sorting",
            "O(n)",
            "Ranks learner leaderboard scores and sorts educational activities by star difficulty. Stable and predictable performance."
        ));

        return concepts;
    }

    public Map<String, Object> executeCustomSearch(Map<String, Object> payload) {
        List<?> rawList = (List<?>) payload.getOrDefault("array", Collections.emptyList());
        List<Integer> list = new ArrayList<>();
        for (Object item : rawList) {
            if (item instanceof Number n) {
                list.add(n.intValue());
            }
        }
        int target = 0;
        if (payload.get("target") instanceof Number n) {
            target = n.intValue();
        }
        String algorithm = (String) payload.getOrDefault("algorithm", "binary");

        Map<String, Object> response = new HashMap<>();
        if ("linear".equalsIgnoreCase(algorithm)) {
            SearchEngine.SearchResult<Integer> res = SearchEngine.linearSearch(list, target);
            response.put("found", res.getIndex() >= 0);
            response.put("index", res.getIndex());
            response.put("comparisons", res.getComparisons());
            response.put("durationNanos", res.getDurationNanos());
            response.put("algorithm", "Linear Search");
            response.put("theoreticalComplexity", "O(n)");
            response.put("summary", String.format("Linear search scanned %d items to locate %d (Index: %d)", res.getComparisons(), target, res.getIndex()));
        } else {
            // Sort list for binary search if not already sorted
            List<Integer> sorted = new ArrayList<>(list);
            Collections.sort(sorted);
            SearchEngine.SearchResult<Integer> res = SearchEngine.binarySearch(sorted, target);
            response.put("found", res.getIndex() >= 0);
            response.put("index", res.getIndex());
            response.put("comparisons", res.getComparisons());
            response.put("durationNanos", res.getDurationNanos());
            response.put("sortedArray", sorted);
            response.put("algorithm", "Binary Search");
            response.put("theoreticalComplexity", "O(log n)");
            response.put("summary", String.format("Binary search located target %d in %d logarithmic steps (Index: %d)", target, res.getComparisons(), res.getIndex()));
        }
        response.put("source", "Spring Boot (Java 21 SearchEngine)");
        return response;
    }

    public Map<String, Object> executeCustomSort(Map<String, Object> payload) {
        List<?> rawList = (List<?>) payload.getOrDefault("array", Collections.emptyList());
        List<Integer> list = new ArrayList<>();
        for (Object item : rawList) {
            if (item instanceof Number n) {
                list.add(n.intValue());
            }
        }
        String algorithm = (String) payload.getOrDefault("algorithm", "merge");

        Map<String, Object> response = new HashMap<>();
        if ("bubble".equalsIgnoreCase(algorithm)) {
            SortingEngine.SortResult<Integer> res = SortingEngine.bubbleSort(list, Integer::compareTo);
            response.put("sortedArray", res.getSortedList());
            response.put("comparisons", res.getComparisons());
            response.put("swaps", res.getSwaps());
            response.put("durationNanos", res.getDurationNanos());
            response.put("algorithm", "Bubble Sort");
            response.put("theoreticalComplexity", "O(n^2)");
            response.put("summary", String.format("Bubble sort performed %d comparisons and %d swaps", res.getComparisons(), res.getSwaps()));
        } else {
            SortingEngine.SortResult<Integer> res = SortingEngine.mergeSort(list, Integer::compareTo);
            response.put("sortedArray", res.getSortedList());
            response.put("comparisons", res.getComparisons());
            response.put("swaps", res.getSwaps());
            response.put("durationNanos", res.getDurationNanos());
            response.put("algorithm", "Merge Sort");
            response.put("theoreticalComplexity", "O(n log n)");
            response.put("summary", String.format("Merge sort performed %d comparisons and %d merge steps", res.getComparisons(), res.getSwaps()));
        }
        response.put("source", "Spring Boot (Java 21 SortingEngine)");
        return response;
    }

    private Map<String, Object> createConcept(String name, String javaEquivalent, String timeComplexity, String spaceComplexity, String useCase) {
        Map<String, Object> map = new HashMap<>();
        map.put("name", name);
        map.put("javaEquivalent", javaEquivalent);
        map.put("timeComplexity", timeComplexity);
        map.put("spaceComplexity", spaceComplexity);
        map.put("useCase", useCase);
        return map;
    }
}
