import React, { useState, useCallback, useMemo, memo } from 'react';

/**
 * Optimized To-Do List Application
 * Demonstrates re-render optimization techniques:
 * - React.memo for component memoization
 * - useCallback for function memoization
 * - useMemo for computed values
 * - Proper key usage
 */

// Memoized TodoItem component - only re-renders when its props change
const TodoItem = memo(({ todo, onToggle, onDelete }) => {
  console.log(`Rendering TodoItem: ${todo.id}`); // For debugging re-renders
  
  return (
    <li style={{ 
      display: 'flex', 
      alignItems: 'center', 
      padding: '8px',
      margin: '4px 0',
      backgroundColor: todo.completed ? '#d4edda' : '#fff',
      border: '1px solid #ddd',
      borderRadius: '4px'
    }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        style={{ marginRight: '10px' }}
      />
      <span style={{ 
        flex: 1, 
        textDecoration: todo.completed ? 'line-through' : 'none' 
      }}>
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        style={{
          padding: '4px 8px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Delete
      </button>
    </li>
  );
});

// Custom comparison function for React.memo (optional)
// Only re-render if todo object reference changes
TodoItem.displayName = 'TodoItem';

// Memoized TodoForm component
const TodoForm = memo(({ onAdd }) => {
  const [input, setInput] = useState('');
  
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (input.trim()) {
      onAdd(input.trim());
      setInput('');
    }
  }, [input, onAdd]);
  
  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new todo..."
        style={{
          padding: '8px',
          marginRight: '8px',
          width: '300px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      />
      <button
        type="submit"
        style={{
          padding: '8px 16px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Add Todo
      </button>
    </form>
  );
});

TodoForm.displayName = 'TodoForm';

// Main TodoList component with optimizations
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  
  // Memoized callback functions - prevents recreation on every render
  const handleAdd = useCallback((text) => {
    setTodos(prevTodos => [
      ...prevTodos,
      {
        id: Date.now(),
        text,
        completed: false,
        createdAt: new Date().toISOString()
      }
    ]);
  }, []); // Empty deps - function never changes
  
  const handleToggle = useCallback((id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []); // Empty deps - function never changes
  
  const handleDelete = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []); // Empty deps - function never changes
  
  // Memoized filtered todos - only recalculates when todos or filter changes
  const filteredTodos = useMemo(() => {
    console.log('Filtering todos...'); // For debugging
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);
  
  // Memoized statistics - only recalculates when todos changes
  const stats = useMemo(() => {
    return {
      total: todos.length,
      active: todos.filter(todo => !todo.completed).length,
      completed: todos.filter(todo => todo.completed).length
    };
  }, [todos]);
  
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Optimized Todo List</h1>
      
      <TodoForm onAdd={handleAdd} />
      
      {/* Filter buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '6px 12px',
            marginRight: '8px',
            backgroundColor: filter === 'all' ? '#007bff' : '#f8f9fa',
            color: filter === 'all' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilter('active')}
          style={{
            padding: '6px 12px',
            marginRight: '8px',
            backgroundColor: filter === 'active' ? '#007bff' : '#f8f9fa',
            color: filter === 'active' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Active ({stats.active})
        </button>
        <button
          onClick={() => setFilter('completed')}
          style={{
            padding: '6px 12px',
            backgroundColor: filter === 'completed' ? '#007bff' : '#f8f9fa',
            color: filter === 'completed' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Completed ({stats.completed})
        </button>
      </div>
      
      {/* Todo list */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id} // Stable key prevents unnecessary re-renders
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </ul>
      
      {filteredTodos.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666' }}>
          {filter === 'all' 
            ? 'No todos yet. Add one above!' 
            : `No ${filter} todos.`}
        </p>
      )}
    </div>
  );
}

export default TodoList;

/**
 * OPTIMIZATION TECHNIQUES USED:
 * 
 * 1. React.memo() - Prevents TodoItem and TodoForm from re-rendering
 *    unless their props actually change
 * 
 * 2. useCallback() - Memoizes handleAdd, handleToggle, handleDelete
 *    so they maintain the same reference across renders
 * 
 * 3. useMemo() - Memoizes filteredTodos and stats calculations
 *    so they only recalculate when dependencies change
 * 
 * 4. Stable keys - Using todo.id ensures React can efficiently
 *    track which items changed
 * 
 * 5. Functional updates - Using prevTodos => ... in setState
 *    ensures we're working with latest state
 * 
 * PERFORMANCE BENEFITS:
 * - Only TodoItem components with changed props re-render
 * - Filter buttons don't cause unnecessary re-renders
 * - Expensive calculations (filtering, stats) only run when needed
 * - Prevents cascading re-renders throughout the component tree
 */

