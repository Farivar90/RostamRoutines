let timer;
let timeLeft = 1500; // 25 minutes in seconds

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ timeLeft, running: false });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'start') {
        startTimer();
    } else if (message.command === 'reset') {
        resetTimer();
    } else if (message.command === 'getTime') {
        sendResponse({ timeLeft });
    }
});

function startTimer() {
    chrome.storage.sync.get(['running'], (data) => {
        if (!data.running) {
            chrome.storage.sync.set({ running: true });
            timer = setInterval(() => {
                chrome.storage.sync.get(['timeLeft'], (data) => {
                    if (data.timeLeft > 0) {
                        timeLeft = data.timeLeft - 1;
                        chrome.storage.sync.set({ timeLeft });
                    } else {
                        clearInterval(timer);
                        chrome.storage.sync.set({ running: false });
                    }
                });
            }, 1000);
        }
    });
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 1500;
    chrome.storage.sync.set({ timeLeft, running: false });
}
