package com.littlelearners.dsa;

import java.util.List;

/**
 * Searching algorithms demonstration for Little Learners.
 * Compares Linear Search O(n) against Binary Search O(log n) with step tracking.
 */
public class SearchEngine {

    public static class SearchResult<T> {
        private final int index;
        private final T item;
        private final int comparisons;
        private final long durationNanos;

        public SearchResult(int index, T item, int comparisons, long durationNanos) {
            this.index = index;
            this.item = item;
            this.comparisons = comparisons;
            this.durationNanos = durationNanos;
        }

        public int getIndex() { return index; }
        public T getItem() { return item; }
        public int getComparisons() { return comparisons; }
        public long getDurationNanos() { return durationNanos; }
    }

    /**
     * Linear Search: Checks every element sequentially until target is found or list ends.
     * Time Complexity: O(n) worst & average case, O(1) best case.
     * Space Complexity: O(1).
     */
    public static <T> SearchResult<T> linearSearch(List<T> list, T target) {
        long start = System.nanoTime();
        int comparisons = 0;
        for (int i = 0; i < list.size(); i++) {
            comparisons++;
            T current = list.get(i);
            if ((current == null && target == null) || (current != null && current.equals(target))) {
                long duration = System.nanoTime() - start;
                return new SearchResult<>(i, current, comparisons, duration);
            }
        }
        long duration = System.nanoTime() - start;
        return new SearchResult<>(-1, null, comparisons, duration);
    }

    /**
     * Binary Search: Repeatedly divides a sorted search space in half.
     * Requires sorted collection!
     * Time Complexity: O(log n) worst & average case, O(1) best case.
     * Space Complexity: O(1) iterative.
     */
    public static <T extends Comparable<T>> SearchResult<T> binarySearch(List<T> sortedList, T target) {
        long start = System.nanoTime();
        int comparisons = 0;
        int low = 0;
        int high = sortedList.size() - 1;

        while (low <= high) {
            comparisons++;
            int mid = low + ((high - low) >>> 1); // Avoid overflow
            T midVal = sortedList.get(mid);
            int cmp = midVal.compareTo(target);

            if (cmp < 0) {
                low = mid + 1;
            } else if (cmp > 0) {
                high = mid - 1;
            } else {
                long duration = System.nanoTime() - start;
                return new SearchResult<>(mid, midVal, comparisons, duration);
            }
        }
        long duration = System.nanoTime() - start;
        return new SearchResult<>(-1, null, comparisons, duration);
    }
}
