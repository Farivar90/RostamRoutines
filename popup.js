document.addEventListener('DOMContentLoaded', function () {
    const timeDisplay = document.getElementById('time');
    const startButton = document.getElementById('start-timer');
    const resetButton = document.getElementById('reset-timer');
    const addTaskButton = document.getElementById('add-task');
    const newTaskInput = document.getElementById('new-task-input');
    const taskEstimateInput = document.getElementById('task-estimate-input');
    const tasksList = document.getElementById('tasks');
    let timer;
    let timeLeft = 1500; // 25 minutes in seconds

    function updateDisplay(timeLeft) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function saveTasks() {
        const tasks = [];
        tasksList.querySelectorAll('li').forEach(task => {
            tasks.push({
                text: task.querySelector('.task-text').textContent,
                estimate: task.querySelector('.task-estimate').textContent
            });
        });
        chrome.storage.sync.set({ tasks });
    }

    function loadTasks() {
        chrome.storage.sync.get('tasks', function (data) {
            if (data.tasks) {
                data.tasks.forEach(task => addTask(task.text, task.estimate));
            }
        });
    }

    function calculatePomodoroSessions(estimate) {
        const sessionLength = 25; // Pomodoro session length in minutes
        const breakLength = 5; // Break length in minutes
        const totalMinutes = parseInt(estimate, 10);
        const fullSessions = Math.floor(totalMinutes / sessionLength);
        const remainingMinutes = totalMinutes % sessionLength;
        return `${fullSessions} Pomodoro sessions + ${remainingMinutes > 0 ? remainingMinutes + ' minutes remaining' : '0 minutes remaining'}`;
    }

    function addTask(taskText, taskEstimate) {
        const li = document.createElement('li');
        
        const taskTextElement = document.createElement('span');
        taskTextElement.className = 'task-text';
        taskTextElement.textContent = taskText;
        li.appendChild(taskTextElement);

        const taskEstimateElement = document.createElement('span');
        taskEstimateElement.className = 'task-estimate';
        taskEstimateElement.textContent = ` (ETA: ${taskEstimate} mins, ${calculatePomodoroSessions(taskEstimate)})`;
        li.appendChild(taskEstimateElement);

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
        const taskEstimate = taskEstimateInput.value.trim();
        if (taskText !== '' && taskEstimate !== '') {
            addTask(taskText, taskEstimate);
            newTaskInput.value = '';
            taskEstimateInput.value = '';
        }
    });

    startButton.addEventListener('click', function () {
        chrome.runtime.sendMessage({ command: 'start' });
    });

    resetButton.addEventListener('click', function () {
        chrome.runtime.sendMessage({ command: 'reset' });
    });

    setInterval(() => {
        chrome.runtime.sendMessage({ command: 'getTime' }, (response) => {
            updateDisplay(response.timeLeft);
        });
    }, 1000);

    loadTasks();
});
