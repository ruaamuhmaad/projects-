class TodoApp {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('modernTasks')) || [];
    this.currentFilter = 'all';
    this.initElements();
    this.initEventListeners();
    this.render();
  }

  initElements() {
    this.taskInput = document.getElementById('taskInput');
    this.addBtn = document.getElementById('addBtn');
    this.taskList = document.getElementById('taskList');
    this.emptyState = document.getElementById('emptyState');
    this.totalTasks = document.getElementById('totalTasks');
    this.completedTasks = document.getElementById('completedTasks');
    this.pendingTasks = document.getElementById('pendingTasks');
    this.filterBtns = document.querySelectorAll('.filter-btn');
  }

  initEventListeners() {
    this.addBtn.addEventListener('click', () => this.addTask());
    this.taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTask();
    });

    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setFilter(e.target.dataset.filter);
      });
    });
  }

  addTask() {
    const text = this.taskInput.value.trim();
    if (text === '') {
      this.taskInput.style.borderColor = '#f56565';
      setTimeout(() => {
        this.taskInput.style.borderColor = '#e2e8f0';
      }, 1000);
      return;
    }

    const task = {
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: new Date()
    };

    this.tasks.unshift(task);
    this.taskInput.value = '';
    this.saveTasks();
    this.render();
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      this.render();
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasks();
    this.render();
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    this.render();
  }

  getFilteredTasks() {
    switch (this.currentFilter) {
      case 'completed':
        return this.tasks.filter(t => t.completed);
      case 'pending':
        return this.tasks.filter(t => !t.completed);
      default:
        return this.tasks;
    }
  }

  updateStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const pending = total - completed;

    this.totalTasks.textContent = total;
    this.completedTasks.textContent = completed;
    this.pendingTasks.textContent = pending;
  }

  render() {
    const filteredTasks = this.getFilteredTasks();
    this.taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
      this.emptyState.style.display = 'block';
      this.taskList.style.display = 'none';
    } else {
      this.emptyState.style.display = 'none';
      this.taskList.style.display = 'block';

      filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
          <div class="task-content">${task.text}</div>
          <div class="task-actions">
            <button class="action-btn complete-btn" onclick="app.toggleTask(${task.id})">
              ${task.completed ? '↩️' : '✅'}
            </button>
            <button class="action-btn delete-btn" onclick="app.deleteTask(${task.id})">
              🗑️
            </button>
          </div>
        `;

        this.taskList.appendChild(li);
      });
    }

    this.updateStats();
  }

  saveTasks() {
    localStorage.setItem('modernTasks', JSON.stringify(this.tasks));
  }
}

// Initialize the app
const app = new TodoApp();
