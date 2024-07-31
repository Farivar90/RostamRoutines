document.addEventListener('DOMContentLoaded', function () {
    let timer;
    let timeLeft = 1500; // 25 minutes in seconds
    const timeDisplay = document.getElementById('time');
    const startButton = document.getElementById('start-timer');
    const resetButton = document.getElementById('reset-timer');

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    startButton.addEventListener('click', function () {
        if (!timer) {
            timer = setInterval(function () {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateDisplay();
                } else {
                    clearInterval(timer);
                    timer = null;
                }
            }, 1000);
        }
    });

    resetButton.addEventListener('click', function () {
        clearInterval(timer);
        timer = null;
        timeLeft = 1500;
        updateDisplay();
    });

    updateDisplay();
});
