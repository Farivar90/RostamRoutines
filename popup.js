document.addEventListener('DOMContentLoaded', function () {
    const timeDisplay = document.getElementById('time');
    const startButton = document.getElementById('start-timer');
    const resetButton = document.getElementById('reset-timer');
    const addTaskButton = document.getElementById('add-task');
    const newTaskInput = document.getElementById('new-task-input');
    const tasksList = document.getElementById('tasks');

    function updateDisplay(timeLeft) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    startButton.addEventListener('click', function () {
        chrome.runtime.sendMessage({ command: 'start' });
    });

    resetButton.addEventListener('click', function () {
        chrome.runtime.sendMessage({ command: 'reset' });
    });

    function addTask(taskText) {
        const li = document.createElement('li');
        li.textContent = taskText;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
            tasksList.removeChild(li);
            saveTasks();
        });

        li.appendChild(deleteButton);
        tasksList.appendChild(li);
        saveTasks();
    }

    addTaskButton.addEventListener('click', function () {
        const taskText = newTaskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            newTaskInput.value = '';
        }
    });

    function saveTasks() {
        const tasks = [];
        tasksList.querySelectorAll('li').forEach(task => {
            tasks.push(task.firstChild.textContent);
        });
        chrome.storage.sync.set({ tasks });
    }

    function loadTasks() {
        chrome.storage.sync.get('tasks', function (data) {
            if (data.tasks) {
                data.tasks.forEach(taskText => addTask(taskText));
            }
        });
    }

    setInterval(() => {
        chrome.runtime.sendMessage({ command: 'getTime' }, (response) => {
            updateDisplay(response.timeLeft);
        });
    }, 1000);

    loadTasks();
});
