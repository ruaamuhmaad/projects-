class Task {
    constructor(text) {
        this.id = Date.now() + Math.random();
        this.text = text;
        this.completed = false;
        this.createdAt = new Date();
    }

    toggle() {
        this.completed = !this.completed;
    }

    getFormattedDate() {
        return this.createdAt.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

class TaskManager {
    constructor() {
        this.tasks = [];
        this.initEventListeners();
        this.render();
    }

    addTask(text) {
        if (text.trim() === '') return false;
        const task = new Task(text.trim());
        this.tasks.unshift(task);
        this.render();
        return true;
    }

    removeTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.render();
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.toggle();
            this.render();
        }
    }

    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        return { total, completed, pending };
    }

    initEventListeners() {
        const input = document.getElementById('taskInput');
        const addBtn = document.getElementById('addTaskBtn');

        addBtn.addEventListener('click', () => {
            if (this.addTask(input.value)) input.value = '';
            input.focus();
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (this.addTask(input.value)) input.value = '';
            }
        });
    }

    render() {
        const container = document.getElementById('tasksContainer');
        const noTasks = document.getElementById('noTasksMessage');

        const stats = this.getStats();
        document.getElementById('totalTasks').textContent = stats.total;
        document.getElementById('completedTasks').textContent = stats.completed;
        document.getElementById('pendingTasks').textContent = stats.pending;

        container.innerHTML = '';
        if (this.tasks.length === 0) {
            container.appendChild(noTasks);
            return;
        }

        this.tasks.forEach(task => container.appendChild(this.createTaskElement(task)));
    }

    createTaskElement(task) {
        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'completed' : ''}`;
        div.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-id="${task.id}"></div>
            <div class="task-text">${this.escapeHtml(task.text)}</div>
            <div class="task-date">${task.getFormattedDate()}</div>
            <button class="delete-btn" data-id="${task.id}">Delete</button>
        `;

        div.querySelector('.task-checkbox').addEventListener('click', () => this.toggleTask(task.id));
        div.querySelector('.delete-btn').addEventListener('click', e => {
            e.stopPropagation();
            this.removeTask(task.id);
        });

        return div;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();
});
