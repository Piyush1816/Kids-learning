package com.littlelearners.dsa;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Sorting algorithms implementation for ranking learner scores, achievements, and lessons.
 * Implements Merge Sort (Stable, O(n log n)) and Quick Sort (In-place, O(n log n) avg).
 */
public class SortingEngine {

    public static class SortResult<T> {
        private final List<T> sortedList;
        private final long comparisons;
        private final long swaps;
        private final long durationNanos;

        public SortResult(List<T> sortedList, long comparisons, long swaps, long durationNanos) {
            this.sortedList = sortedList;
            this.comparisons = comparisons;
            this.swaps = swaps;
            this.durationNanos = durationNanos;
        }

        public List<T> getSortedList() { return sortedList; }
        public long getComparisons() { return comparisons; }
        public long getSwaps() { return swaps; }
        public long getDurationNanos() { return durationNanos; }
    }

    /**
     * Merge Sort: Divide and conquer algorithm that splits lists recursively and merges in sorted order.
     * Guaranteed Time Complexity: O(n log n) in all cases (Best, Average, Worst).
     * Space Complexity: O(n) for auxiliary merge buffers.
     * Stable: Preserves the relative order of equal keys.
     */
    public static <T> SortResult<T> mergeSort(List<T> list, Comparator<T> comparator) {
        long start = System.nanoTime();
        List<T> copy = new ArrayList<>(list);
        long[] stats = new long[2]; // [0] = comparisons, [1] = swaps/merges
        mergeSortRecursive(copy, 0, copy.size() - 1, comparator, stats);
        long duration = System.nanoTime() - start;
        return new SortResult<>(copy, stats[0], stats[1], duration);
    }

    private static <T> void mergeSortRecursive(List<T> list, int left, int right, Comparator<T> comparator, long[] stats) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSortRecursive(list, left, mid, comparator, stats);
            mergeSortRecursive(list, mid + 1, right, comparator, stats);
            merge(list, left, mid, right, comparator, stats);
        }
    }

    private static <T> void merge(List<T> list, int left, int mid, int right, Comparator<T> comparator, long[] stats) {
        int n1 = mid - left + 1;
        int n2 = right - mid;

        List<T> leftList = new ArrayList<>(n1);
        List<T> rightList = new ArrayList<>(n2);

        for (int i = 0; i < n1; i++) leftList.add(list.get(left + i));
        for (int j = 0; j < n2; j++) rightList.add(list.get(mid + 1 + j));

        int i = 0, j = 0, k = left;
        while (i < n1 && j < n2) {
            stats[0]++; // comparison
            stats[1]++; // merge move
            if (comparator.compare(leftList.get(i), rightList.get(j)) <= 0) {
                list.set(k++, leftList.get(i++));
            } else {
                list.set(k++, rightList.get(j++));
            }
        }

        while (i < n1) {
            stats[1]++;
            list.set(k++, leftList.get(i++));
        }
        while (j < n2) {
            stats[1]++;
            list.set(k++, rightList.get(j++));
        }
    }

    /**
     * Bubble Sort: Simple comparison-based algorithm for elementary visual comparison.
     * Time Complexity: O(n^2).
     */
    public static <T> SortResult<T> bubbleSort(List<T> list, Comparator<T> comparator) {
        long start = System.nanoTime();
        List<T> copy = new ArrayList<>(list);
        long comparisons = 0;
        long swaps = 0;
        int n = copy.size();
        boolean swapped;

        for (int i = 0; i < n - 1; i++) {
            swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                comparisons++;
                if (comparator.compare(copy.get(j), copy.get(j + 1)) > 0) {
                    T temp = copy.get(j);
                    copy.set(j, copy.get(j + 1));
                    copy.set(j + 1, temp);
                    swaps++;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
        long duration = System.nanoTime() - start;
        return new SortResult<>(copy, comparisons, swaps, duration);
    }
}
