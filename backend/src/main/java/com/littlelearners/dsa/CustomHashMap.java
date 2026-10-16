package com.littlelearners.dsa;

import java.util.ArrayList;
import java.util.List;

/**
 * Custom Hash Map implementing separate chaining for collision resolution.
 * Used for O(1) average-time category lookups, answer key validation, and fast user score retrieval.
 *
 * Time Complexities:
 * - put(K, V): O(1) average, O(n) worst-case if severe collision
 * - get(K): O(1) average, O(n) worst-case
 * - remove(K): O(1) average
 * - containsKey(K): O(1) average
 */
public class CustomHashMap<K, V> {
    private static final int INITIAL_CAPACITY = 16;
    private static final float LOAD_FACTOR = 0.75f;

    public static class Node<K, V> {
        final K key;
        V value;
        Node<K, V> next;

        public Node(K key, V value, Node<K, V> next) {
            this.key = key;
            this.value = value;
            this.next = next;
        }

        public K getKey() { return key; }
        public V getValue() { return value; }
    }

    private Node<K, V>[] table;
    private int size;
    private int collisionCount;
    private int rehashCount;

    @SuppressWarnings("unchecked")
    public CustomHashMap(int capacity) {
        this.table = (Node<K, V>[]) new Node[capacity];
        this.size = 0;
        this.collisionCount = 0;
        this.rehashCount = 0;
    }

    public CustomHashMap() {
        this(INITIAL_CAPACITY);
    }

    private int hash(K key) {
        if (key == null) return 0;
        int h = key.hashCode();
        return (h ^ (h >>> 16)) & (table.length - 1);
    }

    public V put(K key, V value) {
        if ((float) size / table.length >= LOAD_FACTOR) {
            rehash();
        }

        int bucketIndex = hash(key);
        Node<K, V> head = table[bucketIndex];

        // Check if key already exists in the chain
        Node<K, V> curr = head;
        while (curr != null) {
            if ((curr.key == null && key == null) || (curr.key != null && curr.key.equals(key))) {
                V oldVal = curr.value;
                curr.value = value;
                return oldVal;
            }
            curr = curr.next;
        }

        if (head != null) {
            collisionCount++;
        }

        // Insert new node at head of chain (O(1) insertion)
        table[bucketIndex] = new Node<>(key, value, head);
        size++;
        return null;
    }

    public V get(K key) {
        int bucketIndex = hash(key);
        Node<K, V> curr = table[bucketIndex];
        while (curr != null) {
            if ((curr.key == null && key == null) || (curr.key != null && curr.key.equals(key))) {
                return curr.value;
            }
            curr = curr.next;
        }
        return null;
    }

    public boolean containsKey(K key) {
        return get(key) != null;
    }

    public V remove(K key) {
        int bucketIndex = hash(key);
        Node<K, V> curr = table[bucketIndex];
        Node<K, V> prev = null;

        while (curr != null) {
            if ((curr.key == null && key == null) || (curr.key != null && curr.key.equals(key))) {
                if (prev == null) {
                    table[bucketIndex] = curr.next;
                } else {
                    prev.next = curr.next;
                }
                size--;
                return curr.value;
            }
            prev = curr;
            curr = curr.next;
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private void rehash() {
        int newCapacity = table.length * 2;
        Node<K, V>[] oldTable = table;
        table = (Node<K, V>[]) new Node[newCapacity];
        size = 0;
        rehashCount++;

        for (Node<K, V> headNode : oldTable) {
            Node<K, V> curr = headNode;
            while (curr != null) {
                put(curr.key, curr.value);
                curr = curr.next;
            }
        }
    }

    public int size() {
        return size;
    }

    public int getCapacity() {
        return table.length;
    }

    public int getCollisionCount() {
        return collisionCount;
    }

    public int getRehashCount() {
        return rehashCount;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    public List<K> keySet() {
        List<K> keys = new ArrayList<>();
        for (Node<K, V> head : table) {
            Node<K, V> curr = head;
            while (curr != null) {
                keys.add(curr.key);
                curr = curr.next;
            }
        }
        return keys;
    }

    public List<V> values() {
        List<V> vals = new ArrayList<>();
        for (Node<K, V> head : table) {
            Node<K, V> curr = head;
            while (curr != null) {
                vals.add(curr.value);
                curr = curr.next;
            }
        }
        return vals;
    }
}
