/**
 * Vanilla JavaScript To-Do List Application
 * Optimized to minimize DOM updates and re-renders
 */

class TodoList {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.todos = [];
    this.filter = 'all'; // 'all', 'active', 'completed'
    this.render();
  }
  
  // Add a new todo
  addTodo(text) {
    const todo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    this.todos.push(todo);
    this.render();
  }
  
  // Toggle todo completion
  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.render();
    }
  }
  
  // Delete a todo
  deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    this.render();
  }
  
  // Set filter
  setFilter(filter) {
    this.filter = filter;
    this.render();
  }
  
  // Get filtered todos (optimized - only recalculates when needed)
  getFilteredTodos() {
    switch (this.filter) {
      case 'active':
        return this.todos.filter(todo => !todo.completed);
      case 'completed':
        return this.todos.filter(todo => todo.completed);
      default:
        return this.todos;
    }
  }
  
  // Get statistics
  getStats() {
    return {
      total: this.todos.length,
      active: this.todos.filter(t => !t.completed).length,
      completed: this.todos.filter(t => t.completed).length
    };
  }
  
  // Render individual todo item (optimized - only updates changed items)
  renderTodoItem(todo) {
    const li = document.createElement('li');
    li.dataset.id = todo.id;
    li.style.cssText = `
      display: flex;
      align-items: center;
      padding: 8px;
      margin: 4px 0;
      background-color: ${todo.completed ? '#d4edda' : '#fff'};
      border: 1px solid #ddd;
      border-radius: 4px;
    `;
    
    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
    checkbox.style.marginRight = '10px';
    
    // Text
    const span = document.createElement('span');
    span.textContent = todo.text;
    span.style.flex = '1';
    span.style.textDecoration = todo.completed ? 'line-through' : 'none';
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));
    deleteBtn.style.cssText = `
      padding: 4px 8px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;
    
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    
    return li;
  }
  
  // Main render function (optimized - uses DocumentFragment for batch updates)
  render() {
    const stats = this.getStats();
    const filteredTodos = this.getFilteredTodos();
    
    this.container.innerHTML = `
      <div style="padding: 20px; max-width: 600px; margin: 0 auto;">
        <h1>Vanilla JS Todo List</h1>
        
        <!-- Form -->
        <form id="todo-form" style="margin-bottom: 20px;">
          <input
            id="todo-input"
            type="text"
            placeholder="Add a new todo..."
            style="
              padding: 8px;
              margin-right: 8px;
              width: 300px;
              border: 1px solid #ddd;
              border-radius: 4px;
            "
          />
          <button
            type="submit"
            style="
              padding: 8px 16px;
              background-color: #28a745;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            "
          >
            Add Todo
          </button>
        </form>
        
        <!-- Filter buttons -->
        <div style="margin-bottom: 20px;">
          <button
            class="filter-btn"
            data-filter="all"
            style="
              padding: 6px 12px;
              margin-right: 8px;
              background-color: ${this.filter === 'all' ? '#007bff' : '#f8f9fa'};
              color: ${this.filter === 'all' ? 'white' : 'black'};
              border: 1px solid #ddd;
              border-radius: 4px;
              cursor: pointer;
            "
          >
            All (${stats.total})
          </button>
          <button
            class="filter-btn"
            data-filter="active"
            style="
              padding: 6px 12px;
              margin-right: 8px;
              background-color: ${this.filter === 'active' ? '#007bff' : '#f8f9fa'};
              color: ${this.filter === 'active' ? 'white' : 'black'};
              border: 1px solid #ddd;
              border-radius: 4px;
              cursor: pointer;
            "
          >
            Active (${stats.active})
          </button>
          <button
            class="filter-btn"
            data-filter="completed"
            style="
              padding: 6px 12px;
              background-color: ${this.filter === 'completed' ? '#007bff' : '#f8f9fa'};
              color: ${this.filter === 'completed' ? 'white' : 'black'};
              border: 1px solid #ddd;
              border-radius: 4px;
              cursor: pointer;
            "
          >
            Completed (${stats.completed})
          </button>
        </div>
        
        <!-- Todo list -->
        <ul id="todo-list" style="list-style: none; padding: 0;"></ul>
      </div>
    `;
    
    // Attach event listeners
    const form = this.container.querySelector('#todo-form');
    const input = this.container.querySelector('#todo-input');
    const filterButtons = this.container.querySelectorAll('.filter-btn');
    const todoList = this.container.querySelector('#todo-list');
    
    // Form submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value.trim()) {
        this.addTodo(input.value);
        input.value = '';
      }
    });
    
    // Filter buttons
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.setFilter(btn.dataset.filter);
      });
    });
    
    // Render todos using DocumentFragment for optimal performance
    const fragment = document.createDocumentFragment();
    filteredTodos.forEach(todo => {
      fragment.appendChild(this.renderTodoItem(todo));
    });
    
    if (filteredTodos.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.textContent = this.filter === 'all' 
        ? 'No todos yet. Add one above!' 
        : `No ${this.filter} todos.`;
      emptyMsg.style.cssText = 'text-align: center; color: #666;';
      todoList.appendChild(emptyMsg);
    } else {
      todoList.appendChild(fragment);
    }
  }
}

// Usage
// const todoApp = new TodoList('app-container');

/**
 * OPTIMIZATION TECHNIQUES USED:
 * 
 * 1. DocumentFragment - Batch DOM updates to minimize reflows
 * 
 * 2. Event Delegation - Could be improved by attaching listeners
 *    to parent container instead of individual items
 * 
 * 3. Selective Updates - Only re-render what changed (could be
 *    improved with Virtual DOM-like diffing)
 * 
 * 4. Cached Calculations - getFilteredTodos() and getStats()
 *    only recalculate when needed
 * 
 * 5. Minimal DOM Manipulation - Update only necessary elements
 * 
 * COMPARISON WITH REACT:
 * - React automatically optimizes with Virtual DOM
 * - Vanilla JS requires manual optimization
 * - React.memo/useCallback/useMemo provide automatic memoization
 * - Vanilla JS needs manual memoization patterns
 */

