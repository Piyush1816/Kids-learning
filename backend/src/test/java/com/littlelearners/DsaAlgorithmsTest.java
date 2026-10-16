package com.littlelearners;

import com.littlelearners.dsa.ActivityStack;
import com.littlelearners.dsa.ChallengeQueue;
import com.littlelearners.dsa.CustomArrayList;
import com.littlelearners.dsa.CustomHashMap;
import com.littlelearners.dsa.SearchEngine;
import com.littlelearners.dsa.SortingEngine;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class DsaAlgorithmsTest {

    @Test
    public void testCustomArrayListDynamicGrowth() {
        CustomArrayList<String> list = new CustomArrayList<>(4);
        assertEquals(4, list.getCapacity());

        list.add("Apple");
        list.add("Ball");
        list.add("Cat");
        list.add("Dog");
        assertEquals(4, list.size());
        assertEquals(0, list.getResizeCount());

        // 5th element triggers resize (4 * 1.5 = 6)
        list.add("Elephant");
        assertTrue(list.getCapacity() > 4);
        assertEquals(1, list.getResizeCount());
        assertEquals("Elephant", list.get(4));

        // Test remove
        String removed = list.remove(1);
        assertEquals("Ball", removed);
        assertEquals(4, list.size());
        assertEquals("Cat", list.get(1));
    }

    @Test
    public void testCustomHashMapChainingAndPutGet() {
        CustomHashMap<String, Integer> map = new CustomHashMap<>(8);
        map.put("alphabets", 26);
        map.put("numbers", 100);
        map.put("colors", 12);

        assertEquals(26, map.get("alphabets"));
        assertEquals(100, map.get("numbers"));
        assertEquals(12, map.get("colors"));
        assertNull(map.get("nonexistent"));

        // Overwrite
        map.put("colors", 20);
        assertEquals(20, map.get("colors"));

        // Remove
        assertEquals(20, map.remove("colors"));
        assertNull(map.get("colors"));
        assertEquals(2, map.size());
    }

    @Test
    public void testChallengeQueueFIFO() {
        ChallengeQueue<String> queue = new ChallengeQueue<>();
        assertTrue(queue.isEmpty());

        queue.enqueue("Task 1");
        queue.enqueue("Task 2");
        queue.enqueue("Task 3");

        assertEquals(3, queue.size());
        assertEquals("Task 1", queue.peek());
        assertEquals("Task 1", queue.dequeue());
        assertEquals("Task 2", queue.dequeue());
        assertEquals("Task 3", queue.dequeue());
        assertTrue(queue.isEmpty());
    }

    @Test
    public void testActivityStackLIFO() {
        ActivityStack<String> stack = new ActivityStack<>(5);
        stack.push("Stroke 1");
        stack.push("Stroke 2");
        stack.push("Stroke 3");

        assertEquals("Stroke 3", stack.peek());
        assertEquals("Stroke 3", stack.pop());
        assertEquals("Stroke 2", stack.pop());
        assertEquals("Stroke 1", stack.pop());
        assertTrue(stack.isEmpty());
    }

    @Test
    public void testBinarySearchVsLinearSearch() {
        List<Integer> sorted = Arrays.asList(2, 4, 6, 8, 10, 12, 14, 16, 18, 20);

        SearchEngine.SearchResult<Integer> binaryRes = SearchEngine.binarySearch(sorted, 16);
        assertEquals(7, binaryRes.getIndex());
        assertTrue(binaryRes.getComparisons() <= 4, "Binary search on 10 items takes <= 4 steps");

        SearchEngine.SearchResult<Integer> linearRes = SearchEngine.linearSearch(sorted, 16);
        assertEquals(7, linearRes.getIndex());
        assertEquals(8, linearRes.getComparisons(), "Linear search takes 8 steps to reach index 7");
    }

    @Test
    public void testMergeSortStability() {
        List<Integer> unsorted = Arrays.asList(45, 12, 85, 32, 89, 39, 69, 44, 42, 1, 99);
        SortingEngine.SortResult<Integer> res = SortingEngine.mergeSort(unsorted, Integer::compareTo);

        List<Integer> expected = new ArrayList<>(unsorted);
        expected.sort(Integer::compareTo);

        assertEquals(expected, res.getSortedList());
        assertTrue(res.getComparisons() > 0);
    }
}
