# JavaScript Programming Problems & Solutions

Comprehensive collection of common JavaScript interview programming problems with multiple solution approaches.

---

## 📚 Table of Contents

1. [Arrays & Strings](#arrays--strings)
2. [Linked List](#linked-list)
3. [Stack & Queue](#stack--queue)
4. [Hashing](#hashing)
5. [Trees & Graphs](#trees--graphs)
6. [Mathematical Problems](#mathematical-problems)
7. [String Manipulation](#string-manipulation)
8. [Array Algorithms](#array-algorithms)
9. [Binary Array Problems](#binary-array-problems)
10. [Dynamic Programming](#dynamic-programming)
11. [Stack Problems](#stack-problems)
12. [String Algorithms](#string-algorithms)

---

## Arrays & Strings

### ✅ 1.1 Two Sum

**Problem:** Find indices of two numbers that add up to a target.

```javascript
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
}

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
```

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

---

### ✅ 1.2 Longest Substring Without Repeating Characters

**Problem:** Find the length of the longest substring without repeating characters using sliding window technique.

```javascript
function lengthOfLongestSubstring(s) {
  let left = 0, maxLen = 0;
  const seen = new Map();
  for (let right = 0; right < s.length; right++) {
    if (seen.has(s[right])) left = Math.max(seen.get(s[right]) + 1, left);
    seen.set(s[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}

console.log(lengthOfLongestSubstring("abcabcbb")); // 3
```

**Time Complexity:** O(n)  
**Space Complexity:** O(min(m,n)) where m is the size of the charset

---

### ✅ 1.3 Kadane's Algorithm (Max Subarray Sum)

**Problem:** Find the maximum sum of any contiguous subarray.

```javascript
function maxSubArray(nums) {
  let max = nums[0], current = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    max = Math.max(max, current);
  }
  return max;
}

console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // 6
```

**Time Complexity:** O(n)  
**Space Complexity:** O(1)

---

## Linked List

### ✅ 2.1 Reverse a Linked List

**Problem:** Reverse a singly linked list.

```javascript
class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}
```

**Time Complexity:** O(n)  
**Space Complexity:** O(1)

---

## Stack & Queue

### ✅ 3.1 Valid Parentheses

**Problem:** Check if a string containing `()[]{}` is valid.

```javascript
function isValid(s) {
  const stack = [];
  const map = { ')': '(', ']': '[', '}': '{' };
  for (let ch of s) {
    if (!map[ch]) stack.push(ch);
    else if (stack.pop() !== map[ch]) return false;
  }
  return stack.length === 0;
}

console.log(isValid("{[()]}")); // true
```

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

---

## Hashing

### ✅ 4.1 First Non-Repeating Character

**Problem:** Find the index of the first non-repeating character in a string.

```javascript
function firstUniqueChar(s) {
  const freq = {};
  for (let ch of s) freq[ch] = (freq[ch] || 0) + 1;
  for (let i = 0; i < s.length; i++) {
    if (freq[s[i]] === 1) return i;
  }
  return -1;
}

console.log(firstUniqueChar("loveleetcode")); // 2
```

**Time Complexity:** O(n)  
**Space Complexity:** O(1) - at most 26 characters

---

## Trees & Graphs

### ✅ 5.1 Binary Tree Traversal (DFS - Inorder)

**Problem:** Perform inorder traversal of a binary tree.

```javascript
function inorderTraversal(root) {
  if (!root) return [];
  return [
    ...inorderTraversal(root.left),
    root.val,
    ...inorderTraversal(root.right)
  ];
}
```

**Time Complexity:** O(n)  
**Space Complexity:** O(h) where h is the height of the tree

---

## Mathematical Problems

### ✅ Factorial Calculation

**Problem:** Calculate the factorial of a number using both iterative and recursive approaches.

#### 🧮 1️⃣ Iterative Approach

```javascript
function factorialIterative(n) {
  if (n < 0) return "Invalid input";
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  return result;
}

console.log(factorialIterative(5)); // Output: 120
```

**Time Complexity:** O(n)  
**Space Complexity:** O(1)

#### 🌀 2️⃣ Recursive Approach

```javascript
function factorialRecursive(n) {
  if (n < 0) return "Invalid input";
  if (n === 0 || n === 1) return 1;
  return n * factorialRecursive(n - 1);
}

console.log(factorialRecursive(5)); // Output: 120
```

**Time Complexity:** O(n)  
**Space Complexity:** O(n) — due to recursive call stack

#### 🧠 Bonus: One-Liner Version (ES6)

```javascript
const factorial = n => n <= 1 ? 1 : n * factorial(n - 1);
console.log(factorial(5)); // 120
```

---

### ✅ Prime Numbers (1 to 100)

**Problem:** Print all prime numbers from 1 to 100.

#### Simple Method

```javascript
function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function printPrimesUpTo100() {
  for (let i = 2; i <= 100; i++) {
    if (isPrime(i)) console.log(i);
  }
}

printPrimesUpTo100();
```

**Output:** 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97

#### ⚡ Modern ES6 Version

```javascript
const primes = Array.from({ length: 101 }, (_, i) => i)
  .filter(n => {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  });

console.log(primes);
```

#### 🧠 Sieve of Eratosthenes (Most Efficient)

```javascript
function sieveOfEratosthenes(limit) {
  const primes = Array(limit + 1).fill(true);
  primes[0] = primes[1] = false;

  for (let i = 2; i * i <= limit; i++) {
    if (primes[i]) {
      for (let j = i * i; j <= limit; j += i) {
        primes[j] = false;
      }
    }
  }

  for (let i = 2; i <= limit; i++) {
    if (primes[i]) console.log(i);
  }
}

sieveOfEratosthenes(100);
```

**Time Complexity:** O(n log log n)

---

## String Manipulation

### ✅ Palindrome Check

**Problem:** Check if a string is a palindrome (reads the same forward and backward).

#### 🧩 1️⃣ Simple Approach (Using Built-in Methods)

```javascript
function isPalindrome(str) {
  const cleaned = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const reversed = cleaned.split('').reverse().join('');
  return cleaned === reversed;
}

console.log(isPalindrome("Madam"));         // true
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("Hello"));         // false
```

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

#### 🧮 2️⃣ Two-Pointer Approach (More Efficient)

```javascript
function isPalindromeTwoPointer(str) {
  const cleaned = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  let left = 0, right = cleaned.length - 1;

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }
  return true;
}

console.log(isPalindromeTwoPointer("racecar")); // true
console.log(isPalindromeTwoPointer("hello"));   // false
```

**Time Complexity:** O(n)  
**Space Complexity:** O(1)

#### ⚡ Bonus (One-Liner for Quick Check)

```javascript
const isPalindromeQuick = s => {
  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return s === [...s].reverse().join('');
};

console.log(isPalindromeQuick("Level")); // true
```

---

### ✅ Count Vowels in String

**Problem:** Count the number of vowels in a string.

#### ✅ 1️⃣ Simple Loop Approach

```javascript
function countVowels(str) {
  const vowels = "aeiouAEIOU";
  let count = 0;

  for (let char of str) {
    if (vowels.includes(char)) {
      count++;
    }
  }
  return count;
}

console.log(countVowels("JavaScript")); // Output: 3 (a, a, i)
```

#### ✅ 2️⃣ Regex Approach (Short & Clean)

```javascript
function countVowelsRegex(str) {
  const matches = str.match(/[aeiou]/gi);
  return matches ? matches.length : 0;
}

console.log(countVowelsRegex("HELLO World")); // Output: 3 (E, O, o)
```

#### ✅ 3️⃣ Using Array Filter (Functional Style)

```javascript
function countVowelsFilter(str) {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  return str
    .toLowerCase()
    .split('')
    .filter(ch => vowels.includes(ch)).length;
}

console.log(countVowelsFilter("Interview Prep")); // Output: 5
```

**Examples:**

| Input | Output | Explanation |
|-------|--------|-------------|
| "JavaScript" | 3 | a, a, i |
| "ChatGPT" | 1 | a |
| "HELLO" | 2 | E, O |

---

## Array Algorithms

### ✅ Second Largest Element

**Problem:** Find the second largest element in an array.

#### 🧩 1️⃣ Simple & Clear Approach — Using Sort

```javascript
function secondLargest(arr) {
  const unique = [...new Set(arr)]; // remove duplicates
  if (unique.length < 2) return null; // not enough elements

  unique.sort((a, b) => b - a); // sort descending
  return unique[1];
}

console.log(secondLargest([10, 5, 8, 20, 20, 9])); // Output: 10
```

**Time Complexity:** O(n log n)

#### ⚡ 2️⃣ Optimized One-Pass Approach (No Sorting)

```javascript
function secondLargest(arr) {
  let first = -Infinity, second = -Infinity;

  for (let num of arr) {
    if (num > first) {
      second = first;
      first = num;
    } else if (num > second && num < first) {
      second = num;
    }
  }

  return second === -Infinity ? null : second;
}

console.log(secondLargest([10, 5, 8, 20, 20, 9])); // Output: 10
```

**Time Complexity:** O(n)  
**Space Complexity:** O(1)

#### 🧮 3️⃣ Using Math & Filter (Readable ES6 Version)

```javascript
function secondLargest(arr) {
  const max = Math.max(...arr);
  const filtered = arr.filter(n => n !== max);
  return filtered.length ? Math.max(...filtered) : null;
}

console.log(secondLargest([3, 7, 2, 9, 9, 5])); // Output: 7
```

**Examples:**

| Input | Output |
|-------|--------|
| [10, 5, 8, 20, 9] | 10 |
| [5, 5, 5] | null |
| [1] | null |
| [2, 8, 1, 10, 10, 9] | 9 |

---

### ✅ Merge Two Sorted Arrays

**Problem:** Merge two sorted arrays into a single sorted array without using built-in sort.

#### ✅ Two Pointer Technique (Optimal)

```javascript
function mergeSortedArrays(arr1, arr2) {
  let i = 0, j = 0;
  const merged = [];

  // Compare elements from both arrays
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] < arr2[j]) {
      merged.push(arr1[i]);
      i++;
    } else {
      merged.push(arr2[j]);
      j++;
    }
  }

  // Add remaining elements
  while (i < arr1.length) {
    merged.push(arr1[i]);
    i++;
  }

  while (j < arr2.length) {
    merged.push(arr2[j]);
    j++;
  }

  return merged;
}

console.log(mergeSortedArrays([1, 3, 5, 7], [2, 4, 6, 8]));
// [1, 2, 3, 4, 5, 6, 7, 8]
```

**Time Complexity:** O(n + m)  
**Space Complexity:** O(n + m)

#### 💡 Quick Version (Using Spread + Sort)

```javascript
const mergeSortedArraysQuick = (arr1, arr2) => [...arr1, ...arr2].sort((a, b) => a - b);

console.log(mergeSortedArraysQuick([1, 3, 5, 7], [2, 4, 6, 8]));
```

**Time Complexity:** O((n + m) log(n + m))

---

## Binary Array Problems

### ✅ Segregate 0s and 1s

**Problem:** Segregate 0s and 1s in a binary array.

**Input:** [0, 1, 0, 1, 1, 1]  
**Output:** [0, 0, 1, 1, 1, 1]

#### ✅ 1️⃣ Simple Count-Based Approach

```javascript
function segregate01(arr) {
  let count0 = 0;

  for (let num of arr) {
    if (num === 0) count0++;
  }

  for (let i = 0; i < arr.length; i++) {
    arr[i] = i < count0 ? 0 : 1;
  }

  return arr;
}

console.log(segregate01([0, 1, 0, 1, 1, 1])); // [0, 0, 1, 1, 1, 1]
```

**Time Complexity:** O(n)  
**Space Complexity:** O(1)

#### ⚡ 2️⃣ Two-Pointer Approach (Most Efficient)

```javascript
function segregateBinaryArray(arr) {
  let left = 0, right = arr.length - 1;

  while (left < right) {
    while (arr[left] === 0 && left < right) left++;
    while (arr[right] === 1 && left < right) right--;
    
    if (left < right) {
      [arr[left], arr[right]] = [arr[right], arr[left]]; // swap
      left++;
      right--;
    }
  }
  return arr;
}

console.log(segregateBinaryArray([0, 1, 0, 1, 1, 1])); // [0, 0, 1, 1, 1, 1]
```

**Logic:**
- Move left forward until it finds a 1
- Move right backward until it finds a 0
- Swap them and continue

**Time Complexity:** O(n)  
**Space Complexity:** O(1)

#### 🧮 3️⃣ Using sort() (Quick but Not Optimal)

```javascript
const segregated = [0, 1, 0, 1, 1, 1].sort((a, b) => a - b);
console.log(segregated); // [0, 0, 1, 1, 1, 1]
```

**Time Complexity:** O(n log n)

**Examples:**

| Input | Output |
|-------|--------|
| [0,1,0,1,1,1] | [0,0,1,1,1,1] |
| [1,0,1,0,0,1,1] | [0,0,0,1,1,1,1] |

---

## Dynamic Programming

### ✅ Best Time to Buy and Sell Stock

**Problem:** Find the maximum profit from buying and selling stock once.

**Input:** [7, 1, 5, 3, 6, 4]  
**Output:** 5 (Buy at 1, sell at 6)

#### ✅ One-Pass Optimal Solution

```javascript
function maxProfit(prices) {
  let minPrice = Infinity; // track the minimum buying price
  let maxProfit = 0;       // track the best profit so far

  for (let price of prices) {
    if (price < minPrice) {
      minPrice = price; // new lower buying price found
    } else {
      maxProfit = Math.max(maxProfit, price - minPrice);
    }
  }

  return maxProfit;
}

console.log(maxProfit([7, 1, 5, 3, 6, 4])); // Output: 5
console.log(maxProfit([7, 6, 4, 3, 1]));   // Output: 0 (no profit)
```

**Logic:**
- Keep track of the lowest price seen so far (minPrice)
- For each price, calculate potential profit: price - minPrice
- Update maxProfit if it's greater than the previous one

**Time Complexity:** O(n)  
**Space Complexity:** O(1)

**Examples:**

| Input | Output | Explanation |
|-------|--------|-------------|
| [7,1,5,3,6,4] | 5 | Buy at 1, Sell at 6 |
| [7,6,4,3,1] | 0 | Prices always fall |
| [2,4,1] | 2 | Buy at 2, Sell at 4 |

---

## Stack Problems

### ✅ Valid Parentheses (Detailed)

**Problem:** Check if a string containing `()[]{}` is valid.

#### Clean Implementation

```javascript
function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };

  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
    } else if (ch === ')' || ch === ']' || ch === '}') {
      if (stack.length === 0 || stack.pop() !== pairs[ch]) return false;
    } else {
      // if other characters are not allowed: treat as invalid
      return false;
    }
  }

  return stack.length === 0;
}

// Examples
console.log(isValid("()"));       // true
console.log(isValid("()[]{}"));   // true
console.log(isValid("(]"));       // false
console.log(isValid("([)]"));     // false
console.log(isValid("{[]}"));     // true
```

**Time Complexity:** O(n)  
**Space Complexity:** O(n) in worst case

#### Shorter (Concise) Variant

```javascript
const isValidShort = s => {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  for (let ch of s) {
    if (pairs[ch]) {
      if (stack.pop() !== pairs[ch]) return false;
    } else {
      stack.push(ch);
    }
  }
  return stack.length === 0;
};
```

---

## String Algorithms

### ✅ Group Anagrams

**Problem:** Group all anagrams together from an array of strings.

**Input:** ["eat", "tea", "tan", "ate", "nat", "bat"]  
**Output:** [["eat","tea","ate"],["tan","nat"],["bat"]]

#### ✅ Approach 1: Sort Each String (Hash Map Key)

```javascript
function groupAnagrams(strs) {
  const map = new Map();

  for (let str of strs) {
    // Sort characters alphabetically → acts as unique signature
    const sorted = str.split('').sort().join('');

    // Group words by their sorted signature
    if (!map.has(sorted)) map.set(sorted, []);
    map.get(sorted).push(str);
  }

  return Array.from(map.values());
}

console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
// [["eat","tea","ate"],["tan","nat"],["bat"]]
```

**Explanation:**
- Sort "eat" → "aet"
- "tea" → "aet"
- "ate" → "aet"
- ➡️ Grouped under same key "aet"

**Time Complexity:** O(n * k log k) where k is the average length of strings  
**Space Complexity:** O(n * k)

#### ⚡ Approach 2: Using Character Frequency (More Optimal)

```javascript
function groupAnagramsFreq(strs) {
  const map = new Map();

  for (let str of strs) {
    const count = Array(26).fill(0);
    for (let ch of str) {
      count[ch.charCodeAt(0) - 97]++;
    }
    const key = count.join('#'); // unique frequency signature
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(str);
  }

  return Array.from(map.values());
}

console.log(groupAnagramsFreq(["eat", "tea", "tan", "ate", "nat", "bat"]));
```

**Time Complexity:** O(n * k)  
**Space Complexity:** O(n * k)

**Summary:**

| Approach | Logic | Time | Space |
|----------|-------|------|-------|
| Sorting-based | Sort each word | O(n k log k) | O(n k) |
| Frequency-based | Character count array | O(n k) | O(n k) |

---

## 🎯 Summary

This collection covers the most commonly asked JavaScript programming problems in technical interviews, including:

- **Array & String manipulation**
- **Data structures** (Linked Lists, Stacks, Queues)
- **Algorithm patterns** (Two Pointers, Sliding Window, Hash Maps)
- **Mathematical problems**
- **Dynamic Programming basics**
- **String algorithms**

Each problem includes multiple solution approaches with time and space complexity analysis, making it perfect for interview preparation!

---

*For more comprehensive examples and detailed explanations, see the main [README.md](../README.md) which contains extensive TypeScript and Node.js examples.*
