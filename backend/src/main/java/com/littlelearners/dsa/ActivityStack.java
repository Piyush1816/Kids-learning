package com.littlelearners.dsa;

import java.util.ArrayList;
import java.util.EmptyStackException;
import java.util.List;

/**
 * Custom Stack (LIFO - Last In, First Out) implementation.
 * Used in Little Learners for:
 * 1. Creative Corner Canvas: Undo/Redo operations on drawing strokes.
 * 2. Navigation History: Backtracking through visited learning lessons.
 *
 * Time Complexities:
 * - push(T): O(1)
 * - pop(): O(1)
 * - peek(): O(1)
 * - isEmpty(): O(1)
 */
public class ActivityStack<T> {
    private static class Node<T> {
        T data;
        Node<T> next;

        Node(T data, Node<T> next) {
            this.data = data;
            this.next = next;
        }
    }

    private Node<T> top;
    private int size;
    private final int maxCapacity;

    public ActivityStack() {
        this(100); // Default history depth
    }

    public ActivityStack(int maxCapacity) {
        this.top = null;
        this.size = 0;
        this.maxCapacity = maxCapacity;
    }

    public void push(T item) {
        top = new Node<>(item, top);
        size++;

        // Trim tail if exceeding max capacity for memory safety
        if (size > maxCapacity) {
            trimTail();
        }
    }

    public T pop() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        T data = top.data;
        top = top.next;
        size--;
        return data;
    }

    public T peek() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        return top.data;
    }

    public boolean isEmpty() {
        return top == null;
    }

    public int size() {
        return size;
    }

    public void clear() {
        top = null;
        size = 0;
    }

    private void trimTail() {
        if (top == null) return;
        Node<T> curr = top;
        for (int i = 0; i < maxCapacity - 1 && curr.next != null; i++) {
            curr = curr.next;
        }
        if (curr.next != null) {
            curr.next = null;
            size = maxCapacity;
        }
    }

    public List<T> toList() {
        List<T> list = new ArrayList<>();
        Node<T> curr = top;
        while (curr != null) {
            list.add(curr.data);
            curr = curr.next;
        }
        return list;
    }
}
