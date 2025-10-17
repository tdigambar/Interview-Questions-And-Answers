# Data Structures and Algorithms Interview Questions

A comprehensive collection of Data Structures and Algorithms interview questions covering basic to advanced concepts with JavaScript implementations.

## Table of Contents

- [Basic Level](#basic-level)
- [Intermediate Level](#intermediate-level)
- [Advanced Level](#advanced-level)

---

## Basic Level

### 1. What is Time Complexity and Space Complexity?

**Time Complexity** measures how the runtime of an algorithm grows with input size.
**Space Complexity** measures how much memory an algorithm uses relative to input size.

**Big O Notation:**
- **O(1)**: Constant time
- **O(log n)**: Logarithmic time
- **O(n)**: Linear time
- **O(n log n)**: Linearithmic time
- **O(n²)**: Quadratic time
- **O(2ⁿ)**: Exponential time

```javascript
// O(1) - Constant time
function getFirst(arr) {
  return arr[0];
}

// O(n) - Linear time
function findElement(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// O(n²) - Quadratic time
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// O(log n) - Logarithmic time
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
```

### 2. What is an Array and its operations?

An Array is a contiguous collection of elements stored at adjacent memory locations.

```javascript
class DynamicArray {
  constructor() {
    this.data = {};
    this.length = 0;
  }
  
  // O(1)
  get(index) {
    return this.data[index];
  }
  
  // O(1)
  push(item) {
    this.data[this.length] = item;
    this.length++;
    return this.length;
  }
  
  // O(1)
  pop() {
    const lastItem = this.data[this.length - 1];
    delete this.data[this.length - 1];
    this.length--;
    return lastItem;
  }
  
  // O(n)
  insert(index, item) {
    for (let i = this.length; i > index; i--) {
      this.data[i] = this.data[i - 1];
    }
    this.data[index] = item;
    this.length++;
  }
  
  // O(n)
  delete(index) {
    for (let i = index; i < this.length - 1; i++) {
      this.data[i] = this.data[i + 1];
    }
    delete this.data[this.length - 1];
    this.length--;
  }
}
```

### 3. What is a Linked List?

A Linked List is a linear data structure where elements are stored in nodes, and each node points to the next node.

```javascript
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  
  // O(1)
  append(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }
  
  // O(1)
  prepend(value) {
    const newNode = new Node(value);
    newNode.next = this.head;
    this.head = newNode;
    if (!this.tail) this.tail = newNode;
    this.length++;
  }
  
  // O(n)
  insert(index, value) {
    if (index === 0) return this.prepend(value);
    if (index >= this.length) return this.append(value);
    
    const newNode = new Node(value);
    let current = this.head;
    for (let i = 0; i < index - 1; i++) {
      current = current.next;
    }
    newNode.next = current.next;
    current.next = newNode;
    this.length++;
  }
  
  // O(n)
  remove(index) {
    if (index === 0) {
      this.head = this.head.next;
      this.length--;
      return;
    }
    
    let current = this.head;
    for (let i = 0; i < index - 1; i++) {
      current = current.next;
    }
    current.next = current.next.next;
    if (index === this.length - 1) this.tail = current;
    this.length--;
  }
  
  // O(n)
  reverse() {
    let prev = null;
    let current = this.head;
    this.tail = this.head;
    
    while (current) {
      const next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    this.head = prev;
  }
}
```

### 4. What is a Stack?

A Stack is a LIFO (Last In First Out) data structure.

```javascript
class Stack {
  constructor() {
    this.items = [];
  }
  
  // O(1)
  push(element) {
    this.items.push(element);
  }
  
  // O(1)
  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }
  
  // O(1)
  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
}

// Applications
function isValidParentheses(s) {
  const stack = new Stack();
  const pairs = { '(': ')', '[': ']', '{': '}' };
  
  for (let char of s) {
    if (char in pairs) {
      stack.push(char);
    } else {
      const top = stack.pop();
      if (pairs[top] !== char) return false;
    }
  }
  
  return stack.isEmpty();
}
```

### 5. What is a Queue?

A Queue is a FIFO (First In First Out) data structure.

```javascript
class Queue {
  constructor() {
    this.items = {};
    this.front = 0;
    this.rear = 0;
  }
  
  // O(1)
  enqueue(element) {
    this.items[this.rear] = element;
    this.rear++;
  }
  
  // O(1)
  dequeue() {
    if (this.isEmpty()) return null;
    const item = this.items[this.front];
    delete this.items[this.front];
    this.front++;
    return item;
  }
  
  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.front];
  }
  
  isEmpty() {
    return this.rear === this.front;
  }
  
  size() {
    return this.rear - this.front;
  }
}

// Circular Queue
class CircularQueue {
  constructor(k) {
    this.queue = new Array(k);
    this.size = k;
    this.front = -1;
    this.rear = -1;
  }
  
  enqueue(value) {
    if (this.isFull()) return false;
    
    if (this.isEmpty()) this.front = 0;
    
    this.rear = (this.rear + 1) % this.size;
    this.queue[this.rear] = value;
    return true;
  }
  
  dequeue() {
    if (this.isEmpty()) return false;
    
    if (this.front === this.rear) {
      this.front = -1;
      this.rear = -1;
    } else {
      this.front = (this.front + 1) % this.size;
    }
    return true;
  }
  
  isEmpty() {
    return this.front === -1;
  }
  
  isFull() {
    return (this.rear + 1) % this.size === this.front;
  }
}
```

### 6. What is a Hash Table?

A Hash Table stores key-value pairs using a hash function to compute an index.

```javascript
class HashTable {
  constructor(size = 53) {
    this.keyMap = new Array(size);
  }
  
  _hash(key) {
    let total = 0;
    const PRIME = 31;
    for (let i = 0; i < Math.min(key.length, 100); i++) {
      const char = key[i];
      const value = char.charCodeAt(0) - 96;
      total = (total * PRIME + value) % this.keyMap.length;
    }
    return total;
  }
  
  // O(1) average
  set(key, value) {
    const index = this._hash(key);
    if (!this.keyMap[index]) {
      this.keyMap[index] = [];
    }
    // Handle collisions with chaining
    for (let pair of this.keyMap[index]) {
      if (pair[0] === key) {
        pair[1] = value;
        return;
      }
    }
    this.keyMap[index].push([key, value]);
  }
  
  // O(1) average
  get(key) {
    const index = this._hash(key);
    if (this.keyMap[index]) {
      for (let pair of this.keyMap[index]) {
        if (pair[0] === key) return pair[1];
      }
    }
    return undefined;
  }
  
  keys() {
    const keysArr = [];
    for (let bucket of this.keyMap) {
      if (bucket) {
        for (let pair of bucket) {
          keysArr.push(pair[0]);
        }
      }
    }
    return keysArr;
  }
  
  values() {
    const valuesArr = [];
    for (let bucket of this.keyMap) {
      if (bucket) {
        for (let pair of bucket) {
          if (!valuesArr.includes(pair[1])) {
            valuesArr.push(pair[1]);
          }
        }
      }
    }
    return valuesArr;
  }
}
```

### 7. What is Binary Search?

Binary Search efficiently finds an element in a sorted array by repeatedly dividing the search interval in half.

```javascript
// Iterative - O(log n) time, O(1) space
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}

// Recursive - O(log n) time, O(log n) space
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;
  
  const mid = Math.floor((left + right) / 2);
  
  if (arr[mid] === target) return mid;
  
  if (arr[mid] < target) {
    return binarySearchRecursive(arr, target, mid + 1, right);
  } else {
    return binarySearchRecursive(arr, target, left, mid - 1);
  }
}

// Find first occurrence
function findFirst(arr, target) {
  let left = 0, right = arr.length - 1;
  let result = -1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      result = mid;
      right = mid - 1; // Continue searching left
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return result;
}
```

### 8. What are common Sorting Algorithms?

**Bubble Sort - O(n²):**
```javascript
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // Optimization
  }
  return arr;
}
```

**Selection Sort - O(n²):**
```javascript
function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}
```

**Insertion Sort - O(n²):**
```javascript
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
  return arr;
}
```

**Merge Sort - O(n log n):**
```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}
```

**Quick Sort - O(n log n) average:**
```javascript
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left - 1;
  
  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}
```

### 9. What is Recursion?

Recursion is when a function calls itself to solve a problem by breaking it into smaller sub-problems.

```javascript
// Factorial
function factorial(n) {
  if (n <= 1) return 1; // Base case
  return n * factorial(n - 1); // Recursive case
}

// Fibonacci
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Fibonacci with memoization
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

// Sum of array
function sumArray(arr) {
  if (arr.length === 0) return 0;
  return arr[0] + sumArray(arr.slice(1));
}

// Reverse string
function reverseString(str) {
  if (str.length <= 1) return str;
  return reverseString(str.slice(1)) + str[0];
}
```

### 10. What are Two Pointer techniques?

Two Pointer technique uses two pointers to solve array/string problems efficiently.

```javascript
// Remove duplicates from sorted array
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  
  let i = 0;
  for (let j = 1; j < nums.length; j++) {
    if (nums[j] !== nums[i]) {
      i++;
      nums[i] = nums[j];
    }
  }
  
  return i + 1;
}

// Two sum in sorted array
function twoSum(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  
  return [-1, -1];
}

// Container with most water
function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;
  
  while (left < right) {
    const width = right - left;
    const minHeight = Math.min(height[left], height[right]);
    maxWater = Math.max(maxWater, width * minHeight);
    
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  
  return maxWater;
}
```

---

## Intermediate Level

### 11. What is a Binary Tree?

A Binary Tree is a hierarchical data structure where each node has at most two children.

```javascript
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree {
  constructor() {
    this.root = null;
  }
  
  // Tree Traversals
  inOrder(node = this.root, result = []) {
    if (node) {
      this.inOrder(node.left, result);
      result.push(node.value);
      this.inOrder(node.right, result);
    }
    return result;
  }
  
  preOrder(node = this.root, result = []) {
    if (node) {
      result.push(node.value);
      this.preOrder(node.left, result);
      this.preOrder(node.right, result);
    }
    return result;
  }
  
  postOrder(node = this.root, result = []) {
    if (node) {
      this.postOrder(node.left, result);
      this.postOrder(node.right, result);
      result.push(node.value);
    }
    return result;
  }
  
  levelOrder() {
    if (!this.root) return [];
    
    const result = [];
    const queue = [this.root];
    
    while (queue.length > 0) {
      const level = [];
      const levelSize = queue.length;
      
      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift();
        level.push(node.value);
        
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
      
      result.push(level);
    }
    
    return result;
  }
  
  height(node = this.root) {
    if (!node) return 0;
    return 1 + Math.max(this.height(node.left), this.height(node.right));
  }
  
  isBalanced(node = this.root) {
    if (!node) return true;
    
    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);
    
    return Math.abs(leftHeight - rightHeight) <= 1 &&
           this.isBalanced(node.left) &&
           this.isBalanced(node.right);
  }
}
```

### 12. What is a Binary Search Tree (BST)?

A BST is a binary tree where left child < parent < right child.

```javascript
class BST {
  constructor() {
    this.root = null;
  }
  
  insert(value) {
    const newNode = new TreeNode(value);
    
    if (!this.root) {
      this.root = newNode;
      return this;
    }
    
    let current = this.root;
    while (true) {
      if (value === current.value) return undefined;
      
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }
  
  search(value) {
    let current = this.root;
    
    while (current) {
      if (value === current.value) return current;
      if (value < current.value) current = current.left;
      else current = current.right;
    }
    
    return null;
  }
  
  findMin(node = this.root) {
    while (node.left) {
      node = node.left;
    }
    return node;
  }
  
  findMax(node = this.root) {
    while (node.right) {
      node = node.right;
    }
    return node;
  }
  
  delete(value) {
    this.root = this.deleteNode(this.root, value);
  }
  
  deleteNode(node, value) {
    if (!node) return null;
    
    if (value < node.value) {
      node.left = this.deleteNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.deleteNode(node.right, value);
    } else {
      // Node to delete found
      if (!node.left && !node.right) return null;
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      
      // Node has two children
      const minRight = this.findMin(node.right);
      node.value = minRight.value;
      node.right = this.deleteNode(node.right, minRight.value);
    }
    
    return node;
  }
  
  isValidBST(node = this.root, min = -Infinity, max = Infinity) {
    if (!node) return true;
    
    if (node.value <= min || node.value >= max) return false;
    
    return this.isValidBST(node.left, min, node.value) &&
           this.isValidBST(node.right, node.value, max);
  }
}
```

### 13. What is a Heap?

A Heap is a complete binary tree that satisfies the heap property.

```javascript
class MinHeap {
  constructor() {
    this.heap = [];
  }
  
  getParentIndex(i) {
    return Math.floor((i - 1) / 2);
  }
  
  getLeftChildIndex(i) {
    return 2 * i + 1;
  }
  
  getRightChildIndex(i) {
    return 2 * i + 2;
  }
  
  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
  
  insert(value) {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }
  
  heapifyUp(index) {
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      
      if (this.heap[parentIndex] > this.heap[index]) {
        this.swap(parentIndex, index);
        index = parentIndex;
      } else {
        break;
      }
    }
  }
  
  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    
    return min;
  }
  
  heapifyDown(index) {
    while (true) {
      let smallest = index;
      const leftChild = this.getLeftChildIndex(index);
      const rightChild = this.getRightChildIndex(index);
      
      if (leftChild < this.heap.length && this.heap[leftChild] < this.heap[smallest]) {
        smallest = leftChild;
      }
      
      if (rightChild < this.heap.length && this.heap[rightChild] < this.heap[smallest]) {
        smallest = rightChild;
      }
      
      if (smallest !== index) {
        this.swap(index, smallest);
        index = smallest;
      } else {
        break;
      }
    }
  }
  
  peek() {
    return this.heap[0];
  }
  
  size() {
    return this.heap.length;
  }
}
```

### 14. What is a Graph?

A Graph is a non-linear data structure consisting of vertices and edges.

```javascript
class Graph {
  constructor() {
    this.adjacencyList = {};
  }
  
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }
  
  addEdge(v1, v2) {
    this.adjacencyList[v1].push(v2);
    this.adjacencyList[v2].push(v1); // For undirected graph
  }
  
  // DFS Recursive
  dfsRecursive(start) {
    const result = [];
    const visited = {};
    
    const dfs = (vertex) => {
      if (!vertex) return;
      
      visited[vertex] = true;
      result.push(vertex);
      
      this.adjacencyList[vertex].forEach(neighbor => {
        if (!visited[neighbor]) {
          dfs(neighbor);
        }
      });
    };
    
    dfs(start);
    return result;
  }
  
  // DFS Iterative
  dfsIterative(start) {
    const stack = [start];
    const result = [];
    const visited = {};
    visited[start] = true;
    
    while (stack.length) {
      const vertex = stack.pop();
      result.push(vertex);
      
      this.adjacencyList[vertex].forEach(neighbor => {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          stack.push(neighbor);
        }
      });
    }
    
    return result;
  }
  
  // BFS
  bfs(start) {
    const queue = [start];
    const result = [];
    const visited = {};
    visited[start] = true;
    
    while (queue.length) {
      const vertex = queue.shift();
      result.push(vertex);
      
      this.adjacencyList[vertex].forEach(neighbor => {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.push(neighbor);
        }
      });
    }
    
    return result;
  }
}
```

### 15. What is Dynamic Programming?

Dynamic Programming solves complex problems by breaking them into simpler subproblems and storing results.

```javascript
// Fibonacci with DP
function fibDP(n) {
  if (n <= 1) return n;
  
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}

// Climbing stairs
function climbStairs(n) {
  if (n <= 2) return n;
  
  const dp = [0, 1, 2];
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}

// Longest Common Subsequence
function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}

// Coin Change
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  for (let coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// 0/1 Knapsack
function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  
  return dp[n][capacity];
}
```

### 16. What is Sliding Window technique?

Sliding Window maintains a subset of data that moves through the array.

```javascript
// Maximum sum subarray of size k
function maxSumSubarray(arr, k) {
  let maxSum = 0;
  let windowSum = 0;
  
  // Calculate first window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;
  
  // Slide the window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }
  
  return maxSum;
}

// Longest substring without repeating characters
function lengthOfLongestSubstring(s) {
  const seen = new Set();
  let left = 0;
  let maxLength = 0;
  
  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }
    
    seen.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  
  return maxLength;
}

// Minimum window substring
function minWindow(s, t) {
  const need = {};
  const window = {};
  
  for (let char of t) {
    need[char] = (need[char] || 0) + 1;
  }
  
  let left = 0, right = 0;
  let valid = 0;
  let start = 0, len = Infinity;
  
  while (right < s.length) {
    const char = s[right];
    right++;
    
    if (char in need) {
      window[char] = (window[char] || 0) + 1;
      if (window[char] === need[char]) {
        valid++;
      }
    }
    
    while (valid === Object.keys(need).length) {
      if (right - left < len) {
        start = left;
        len = right - left;
      }
      
      const d = s[left];
      left++;
      
      if (d in need) {
        if (window[d] === need[d]) {
          valid--;
        }
        window[d]--;
      }
    }
  }
  
  return len === Infinity ? "" : s.substr(start, len);
}
```

### 17. What is Backtracking?

Backtracking builds solutions incrementally and abandons solutions that fail constraints.

```javascript
// Generate all subsets
function subsets(nums) {
  const result = [];
  
  function backtrack(start, current) {
    result.push([...current]);
    
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }
  
  backtrack(0, []);
  return result;
}

// Generate all permutations
function permute(nums) {
  const result = [];
  
  function backtrack(current) {
    if (current.length === nums.length) {
      result.push([...current]);
      return;
    }
    
    for (let num of nums) {
      if (current.includes(num)) continue;
      current.push(num);
      backtrack(current);
      current.pop();
    }
  }
  
  backtrack([]);
  return result;
}

// N-Queens
function solveNQueens(n) {
  const result = [];
  const board = Array(n).fill(0).map(() => Array(n).fill('.'));
  
  function isValid(row, col) {
    // Check column
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 'Q') return false;
    }
    
    // Check diagonal
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 'Q') return false;
    }
    
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 'Q') return false;
    }
    
    return true;
  }
  
  function backtrack(row) {
    if (row === n) {
      result.push(board.map(r => r.join('')));
      return;
    }
    
    for (let col = 0; col < n; col++) {
      if (isValid(row, col)) {
        board[row][col] = 'Q';
        backtrack(row + 1);
        board[row][col] = '.';
      }
    }
  }
  
  backtrack(0);
  return result;
}
```

### 18. What is a Trie?

A Trie (Prefix Tree) is used for efficient string searching and prefix matching.

```javascript
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  
  insert(word) {
    let node = this.root;
    
    for (let char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    
    node.isEndOfWord = true;
  }
  
  search(word) {
    let node = this.root;
    
    for (let char of word) {
      if (!node.children[char]) return false;
      node = node.children[char];
    }
    
    return node.isEndOfWord;
  }
  
  startsWith(prefix) {
    let node = this.root;
    
    for (let char of prefix) {
      if (!node.children[char]) return false;
      node = node.children[char];
    }
    
    return true;
  }
  
  delete(word) {
    const deleteHelper = (node, word, index) => {
      if (index === word.length) {
        if (!node.isEndOfWord) return false;
        node.isEndOfWord = false;
        return Object.keys(node.children).length === 0;
      }
      
      const char = word[index];
      if (!node.children[char]) return false;
      
      const shouldDeleteChild = deleteHelper(node.children[char], word, index + 1);
      
      if (shouldDeleteChild) {
        delete node.children[char];
        return Object.keys(node.children).length === 0 && !node.isEndOfWord;
      }
      
      return false;
    };
    
    deleteHelper(this.root, word, 0);
  }
}
```

### 19. What are Greedy Algorithms?

Greedy algorithms make locally optimal choices at each step.

```javascript
// Activity Selection
function activitySelection(start, end) {
  const n = start.length;
  const activities = [];
  
  for (let i = 0; i < n; i++) {
    activities.push({ start: start[i], end: end[i] });
  }
  
  activities.sort((a, b) => a.end - b.end);
  
  const selected = [activities[0]];
  let lastEnd = activities[0].end;
  
  for (let i = 1; i < n; i++) {
    if (activities[i].start >= lastEnd) {
      selected.push(activities[i]);
      lastEnd = activities[i].end;
    }
  }
  
  return selected;
}

// Fractional Knapsack
function fractionalKnapsack(weights, values, capacity) {
  const n = weights.length;
  const items = [];
  
  for (let i = 0; i < n; i++) {
    items.push({
      weight: weights[i],
      value: values[i],
      ratio: values[i] / weights[i]
    });
  }
  
  items.sort((a, b) => b.ratio - a.ratio);
  
  let totalValue = 0;
  let remainingCapacity = capacity;
  
  for (let item of items) {
    if (remainingCapacity >= item.weight) {
      totalValue += item.value;
      remainingCapacity -= item.weight;
    } else {
      totalValue += item.ratio * remainingCapacity;
      break;
    }
  }
  
  return totalValue;
}

// Jump Game
function canJump(nums) {
  let maxReach = 0;
  
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
    if (maxReach >= nums.length - 1) return true;
  }
  
  return true;
}
```

### 20. What is Union-Find (Disjoint Set)?

Union-Find tracks a partition of a set into disjoint subsets.

```javascript
class UnionFind {
  constructor(size) {
    this.parent = Array(size).fill(0).map((_, i) => i);
    this.rank = Array(size).fill(0);
    this.count = size;
  }
  
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }
  
  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    
    if (rootX === rootY) return false;
    
    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    
    this.count--;
    return true;
  }
  
  connected(x, y) {
    return this.find(x) === this.find(y);
  }
  
  getCount() {
    return this.count;
  }
}

// Application: Number of Connected Components
function countComponents(n, edges) {
  const uf = new UnionFind(n);
  
  for (let [u, v] of edges) {
    uf.union(u, v);
  }
  
  return uf.getCount();
}
```

---

## Advanced Level

### 21. What are advanced Graph algorithms?

**Dijkstra's Algorithm (Shortest Path):**
```javascript
function dijkstra(graph, start) {
  const distances = {};
  const visited = new Set();
  const pq = new MinHeap();
  
  // Initialize distances
  for (let vertex in graph) {
    distances[vertex] = Infinity;
  }
  distances[start] = 0;
  pq.insert({ vertex: start, distance: 0 });
  
  while (pq.size() > 0) {
    const { vertex } = pq.extractMin();
    
    if (visited.has(vertex)) continue;
    visited.add(vertex);
    
    for (let neighbor of graph[vertex]) {
      const newDistance = distances[vertex] + neighbor.weight;
      
      if (newDistance < distances[neighbor.node]) {
        distances[neighbor.node] = newDistance;
        pq.insert({ vertex: neighbor.node, distance: newDistance });
      }
    }
  }
  
  return distances;
}
```

**Bellman-Ford (Negative Weights):**
```javascript
function bellmanFord(graph, V, start) {
  const distances = Array(V).fill(Infinity);
  distances[start] = 0;
  
  // Relax edges V-1 times
  for (let i = 0; i < V - 1; i++) {
    for (let [u, v, weight] of graph) {
      if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
        distances[v] = distances[u] + weight;
      }
    }
  }
  
  // Check for negative cycles
  for (let [u, v, weight] of graph) {
    if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
      return null; // Negative cycle detected
    }
  }
  
  return distances;
}
```

**Topological Sort:**
```javascript
function topologicalSort(graph) {
  const visited = new Set();
  const stack = [];
  
  function dfs(vertex) {
    visited.add(vertex);
    
    for (let neighbor of graph[vertex] || []) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
    
    stack.push(vertex);
  }
  
  for (let vertex in graph) {
    if (!visited.has(vertex)) {
      dfs(vertex);
    }
  }
  
  return stack.reverse();
}
```

**Kruskal's MST:**
```javascript
function kruskal(edges, V) {
  edges.sort((a, b) => a[2] - b[2]);
  const uf = new UnionFind(V);
  const mst = [];
  let totalWeight = 0;
  
  for (let [u, v, weight] of edges) {
    if (uf.union(u, v)) {
      mst.push([u, v, weight]);
      totalWeight += weight;
    }
  }
  
  return { mst, totalWeight };
}
```

### 22. What are Segment Trees?

Segment Trees efficiently answer range queries and updates.

```javascript
class SegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = Array(4 * this.n).fill(0);
    this.build(arr, 0, 0, this.n - 1);
  }
  
  build(arr, node, start, end) {
    if (start === end) {
      this.tree[node] = arr[start];
      return;
    }
    
    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;
    
    this.build(arr, leftChild, start, mid);
    this.build(arr, rightChild, mid + 1, end);
    
    this.tree[node] = this.tree[leftChild] + this.tree[rightChild];
  }
  
  query(left, right) {
    return this.queryHelper(0, 0, this.n - 1, left, right);
  }
  
  queryHelper(node, start, end, left, right) {
    if (left > end || right < start) return 0;
    if (left <= start && end <= right) return this.tree[node];
    
    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;
    
    return this.queryHelper(leftChild, start, mid, left, right) +
           this.queryHelper(rightChild, mid + 1, end, left, right);
  }
  
  update(index, value) {
    this.updateHelper(0, 0, this.n - 1, index, value);
  }
  
  updateHelper(node, start, end, index, value) {
    if (start === end) {
      this.tree[node] = value;
      return;
    }
    
    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;
    
    if (index <= mid) {
      this.updateHelper(leftChild, start, mid, index, value);
    } else {
      this.updateHelper(rightChild, mid + 1, end, index, value);
    }
    
    this.tree[node] = this.tree[leftChild] + this.tree[rightChild];
  }
}
```

### 23. What are advanced String algorithms?

**KMP Pattern Matching:**
```javascript
function kmpSearch(text, pattern) {
  const lps = computeLPS(pattern);
  const matches = [];
  let i = 0, j = 0;
  
  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++;
      j++;
    }
    
    if (j === pattern.length) {
      matches.push(i - j);
      j = lps[j - 1];
    } else if (i < text.length && text[i] !== pattern[j]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }
  
  return matches;
}

function computeLPS(pattern) {
  const lps = Array(pattern.length).fill(0);
  let len = 0;
  let i = 1;
  
  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }
  
  return lps;
}
```

**Rabin-Karp:**
```javascript
function rabinKarp(text, pattern) {
  const d = 256;
  const q = 101;
  const m = pattern.length;
  const n = text.length;
  let p = 0;
  let t = 0;
  let h = 1;
  const matches = [];
  
  for (let i = 0; i < m - 1; i++) {
    h = (h * d) % q;
  }
  
  for (let i = 0; i < m; i++) {
    p = (d * p + pattern.charCodeAt(i)) % q;
    t = (d * t + text.charCodeAt(i)) % q;
  }
  
  for (let i = 0; i <= n - m; i++) {
    if (p === t) {
      let match = true;
      for (let j = 0; j < m; j++) {
        if (text[i + j] !== pattern[j]) {
          match = false;
          break;
        }
      }
      if (match) matches.push(i);
    }
    
    if (i < n - m) {
      t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
      if (t < 0) t += q;
    }
  }
  
  return matches;
}
```

### 24. What is a Fenwick Tree (Binary Indexed Tree)?

Fenwick Tree efficiently computes prefix sums and updates.

```javascript
class FenwickTree {
  constructor(n) {
    this.size = n;
    this.tree = Array(n + 1).fill(0);
  }
  
  update(index, delta) {
    index++;
    while (index <= this.size) {
      this.tree[index] += delta;
      index += index & (-index);
    }
  }
  
  query(index) {
    index++;
    let sum = 0;
    while (index > 0) {
      sum += this.tree[index];
      index -= index & (-index);
    }
    return sum;
  }
  
  rangeQuery(left, right) {
    return this.query(right) - (left > 0 ? this.query(left - 1) : 0);
  }
}
```

### 25. What are Bit Manipulation techniques?

```javascript
// Check if number is power of 2
function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}

// Count set bits
function countSetBits(n) {
  let count = 0;
  while (n) {
    n &= (n - 1);
    count++;
  }
  return count;
}

// Find single number
function singleNumber(nums) {
  let result = 0;
  for (let num of nums) {
    result ^= num;
  }
  return result;
}

// Reverse bits
function reverseBits(n) {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (n & 1);
    n >>= 1;
  }
  return result >>> 0;
}

// Generate all subsets
function subsetsBitMask(nums) {
  const n = nums.length;
  const result = [];
  
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        subset.push(nums[i]);
      }
    }
    result.push(subset);
  }
  
  return result;
}
```

### 26. What are Matrix algorithms?

```javascript
// Rotate matrix 90 degrees
function rotate(matrix) {
  const n = matrix.length;
  
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }
}

// Spiral order traversal
function spiralOrder(matrix) {
  if (!matrix.length) return [];
  
  const result = [];
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;
  
  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) {
      result.push(matrix[top][i]);
    }
    top++;
    
    for (let i = top; i <= bottom; i++) {
      result.push(matrix[i][right]);
    }
    right--;
    
    if (top <= bottom) {
      for (let i = right; i >= left; i--) {
        result.push(matrix[bottom][i]);
      }
      bottom--;
    }
    
    if (left <= right) {
      for (let i = bottom; i >= top; i--) {
        result.push(matrix[i][left]);
      }
      left++;
    }
  }
  
  return result;
}

// Search in sorted matrix
function searchMatrix(matrix, target) {
  if (!matrix.length) return false;
  
  let row = 0;
  let col = matrix[0].length - 1;
  
  while (row < matrix.length && col >= 0) {
    if (matrix[row][col] === target) return true;
    
    if (matrix[row][col] > target) {
      col--;
    } else {
      row++;
    }
  }
  
  return false;
}
```

### 27. What are LRU and LFU Cache implementations?

**LRU Cache:**
```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) return -1;
    
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
  }
}
```

**LFU Cache:**
```javascript
class LFUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.minFreq = 0;
    this.keyToVal = new Map();
    this.keyToFreq = new Map();
    this.freqToKeys = new Map();
  }
  
  get(key) {
    if (!this.keyToVal.has(key)) return -1;
    
    this.increaseFreq(key);
    return this.keyToVal.get(key);
  }
  
  put(key, value) {
    if (this.capacity <= 0) return;
    
    if (this.keyToVal.has(key)) {
      this.keyToVal.set(key, value);
      this.increaseFreq(key);
      return;
    }
    
    if (this.keyToVal.size >= this.capacity) {
      this.removeMinFreqKey();
    }
    
    this.keyToVal.set(key, value);
    this.keyToFreq.set(key, 1);
    
    if (!this.freqToKeys.has(1)) {
      this.freqToKeys.set(1, new Set());
    }
    this.freqToKeys.get(1).add(key);
    this.minFreq = 1;
  }
  
  increaseFreq(key) {
    const freq = this.keyToFreq.get(key);
    this.keyToFreq.set(key, freq + 1);
    
    this.freqToKeys.get(freq).delete(key);
    
    if (!this.freqToKeys.has(freq + 1)) {
      this.freqToKeys.set(freq + 1, new Set());
    }
    this.freqToKeys.get(freq + 1).add(key);
    
    if (this.freqToKeys.get(freq).size === 0) {
      this.freqToKeys.delete(freq);
      if (freq === this.minFreq) {
        this.minFreq++;
      }
    }
  }
  
  removeMinFreqKey() {
    const keySet = this.freqToKeys.get(this.minFreq);
    const keyToRemove = keySet.values().next().value;
    
    keySet.delete(keyToRemove);
    if (keySet.size === 0) {
      this.freqToKeys.delete(this.minFreq);
    }
    
    this.keyToVal.delete(keyToRemove);
    this.keyToFreq.delete(keyToRemove);
  }
}
```

### 28. What are advanced DP problems?

**Edit Distance:**
```javascript
function minDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],
          dp[i][j - 1],
          dp[i - 1][j - 1]
        );
      }
    }
  }
  
  return dp[m][n];
}
```

**Longest Increasing Subsequence:**
```javascript
function lengthOfLIS(nums) {
  const dp = [];
  
  for (let num of nums) {
    let left = 0, right = dp.length;
    
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (dp[mid] < num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    
    if (left === dp.length) {
      dp.push(num);
    } else {
      dp[left] = num;
    }
  }
  
  return dp.length;
}
```

### 29. What are Monotonic Stack/Queue problems?

**Next Greater Element:**
```javascript
function nextGreaterElement(nums) {
  const result = Array(nums.length).fill(-1);
  const stack = [];
  
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
      const idx = stack.pop();
      result[idx] = nums[i];
    }
    stack.push(i);
  }
  
  return result;
}
```

**Sliding Window Maximum:**
```javascript
function maxSlidingWindow(nums, k) {
  const result = [];
  const deque = [];
  
  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] <= i - k) {
      deque.shift();
    }
    
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop();
    }
    
    deque.push(i);
    
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }
  
  return result;
}
```

### 30. What are common optimization techniques?

**Memoization:**
```javascript
function memoize(fn) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

**Space Optimization:**
```javascript
// Fibonacci with O(1) space
function fibOptimized(n) {
  if (n <= 1) return n;
  
  let prev = 0, curr = 1;
  
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  
  return curr;
}
```

**Early Termination:**
```javascript
function isPrime(n) {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) {
      return false;
    }
  }
  
  return true;
}
```

---

## Conclusion

This comprehensive guide covers Data Structures and Algorithms from basic to advanced concepts. Master these topics to excel in technical interviews!

**Key Topics Covered:**
- **Basic**: Arrays, Linked Lists, Stacks, Queues, Hash Tables, Sorting, Binary Search, Recursion, Two Pointers
- **Intermediate**: Trees, BST, Heaps, Graphs, DP, Sliding Window, Backtracking, Tries, Greedy, Union-Find
- **Advanced**: Graph algorithms, Segment Trees, String algorithms, Fenwick Trees, Bit Manipulation, LRU/LFU Cache, Advanced DP, Monotonic Stack/Queue, Optimization
