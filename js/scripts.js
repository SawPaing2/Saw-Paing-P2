function get(element) {
    return document.getElementById(element);
}

function openModal(isNew = true) {
    console.log("Checking modal-title element:", get('modal-title'));
    if (get('modal-title')) {
        get('modal-dialog').classList.add('visible');
        get('modal-backdrop').classList.add('visible');
        get('modal-title').textContent = isNew ? 'Add Task' : 'Edit Task';
        if (isNew) {
            get('edit-title-text').value = '';
        }
    } else {
        console.error("Modal title element not found!");
    }
}

function closeModal() {
    get('modal-dialog').classList.remove('visible');
    get('modal-backdrop').classList.remove('visible');
    get('edit-title-text').value = ''; 
}

function saveTask() {
    const title = get('edit-title-text').value;
    if (title) {
        let tasks = [];
        try {
            tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        } catch (e) {
            console.error("Failed to parse tasks from localStorage", e);
        }
        tasks.push({ title: title, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
        get('edit-title-text').value = ''; 
        closeModal();
    }
}

function deleteTask(index) {
    let tasks = [];
    try {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    } catch (e) {
        console.error("Failed to parse tasks from localStorage", e);
        return;
    }
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function toggleCompletion(index) {
    let tasks = [];
    try {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    } catch (e) {
        console.error("Failed to parse tasks from localStorage", e);
        return;
    }
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function displayTasks() {
    let tasks = [];
    try {
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    } catch (e) {
        console.error("Failed to parse tasks from localStorage", e);
    }
    const taskList = get('taskList');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.className = task.completed ? 'completed' : '';
        taskItem.innerHTML = `
            <span>${task.title}</span>
            <button onclick="toggleCompletion(${index})">${task.completed ? 'Incomplete' : 'Complete'}</button>
            <button onclick="deleteTask(${index})">Delete</button>
        `;
        taskList.appendChild(taskItem);
    });
}

window.addEventListener('load', function () {
    get('addTaskBtn').addEventListener('click', function() { openModal(true); });
    get('cancel-button').addEventListener('click', closeModal);
    get('save-button').addEventListener('click', saveTask);
    displayTasks();
});