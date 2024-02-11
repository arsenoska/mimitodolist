document.addEventListener('DOMContentLoaded', function () {
    loadTasks();
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const addTaskButton = document.querySelector('.add-task button');

    if (taskInput.value.trim() !== '') {
        addTaskButton.disabled = true;

        const newTaskDiv = createTaskElement(taskInput.value);

        taskList.appendChild(newTaskDiv);
        taskInput.value = '';

        saveTasks();
        setTimeout(function () {
            addTaskButton.disabled = false;
        }, 500);
    }
}

function createTaskElement(taskTextContent) {
    const newTaskDiv = document.createElement('div');
    newTaskDiv.className = 'task';

    const taskText = document.createElement('span');
    taskText.textContent = taskTextContent;

    const taskButtons = document.createElement('div');
    taskButtons.className = 'task-buttons';

    const complete = document.createElement('input');
    complete.type = 'checkbox';
    complete.className = 'complete-checkbox';
    complete.onclick = function () {
        completeTask(newTaskDiv, complete);
    };

    const editButton = document.createElement('button');
    editButton.className = 'edit-btn';
    editButton.textContent = '✎';
    editButton.onclick = function () {
        editTask(newTaskDiv, taskText);
    };

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = '✗';
    deleteButton.onclick = function () {
        deleteTask(newTaskDiv);
    };

    taskButtons.appendChild(complete);
    taskButtons.appendChild(editButton);
    taskButtons.appendChild(deleteButton);

    newTaskDiv.appendChild(complete);
    newTaskDiv.appendChild(taskText);
    newTaskDiv.appendChild(editButton);
    newTaskDiv.appendChild(deleteButton);

    return newTaskDiv;
}

function deleteTask(taskDiv) {
    const taskList = document.getElementById('taskList');
    taskDiv.style.animation = 'fadeOut 0.5s ease';
    setTimeout(function () {
        taskList.removeChild(taskDiv);
        saveTasks();
    }, 500);
}

function completeTask(taskDiv, checkbox) {
    const taskText = taskDiv.querySelector('span');
    taskText.classList.toggle('completed');

    const editButton = taskDiv.querySelector('.edit-btn');

    if (checkbox.checked) {
        checkbox.disabled = true;
        editButton.style.display = 'none';
    }

    saveTasks();
}

function editTask(taskDiv, taskText) {
    const newText = prompt('Edit task:', taskText.textContent);
    if (newText !== null) {
        taskText.textContent = newText;
        saveTasks();
    }
}

function saveTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = [];
    for (const taskDiv of taskList.children) {
        const taskText = taskDiv.querySelector('span').textContent;
        const isCompleted = taskDiv.querySelector('.complete-checkbox').checked;
        tasks.push({ text: taskText, completed: isCompleted });
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const taskList = document.getElementById('taskList');
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        for (const task of tasks) {
            const newTaskDiv = createTaskElement(task.text);
            const completeCheckbox = newTaskDiv.querySelector('.complete-checkbox');
            const taskText = newTaskDiv.querySelector('span');
            if (task.completed) {
                completeCheckbox.checked = true;
                completeCheckbox.disabled = true;
                taskText.classList.add('completed'); 
                newTaskDiv.querySelector('.edit-btn').style.display = 'none';
            }
            taskList.appendChild(newTaskDiv);
        }
    }
}
