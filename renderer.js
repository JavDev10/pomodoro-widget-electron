const { ipcRenderer } = require('electron');

// State variables
let focusDuration = 1; // minutes
let breakDuration = 1; // minutes
let loopMode = 1; // 1, 2, or 4
let currentLoop = 0;
let isFocus = true; // true if focus, false if break
let timerInterval = null;
let remainingTime = 0; // seconds

// DOM Elements
const homeScreen = document.getElementById('home-screen');
const focusScreen = document.getElementById('focus-screen');
const breakScreen = document.getElementById('break-screen');

// Home Screen Elements
const focusTimeDisplay = document.getElementById('focus-time-display');
const breakTimeDisplay = document.getElementById('break-time-display');
const btnFocusMinus = document.getElementById('btn-focus-minus');
const btnFocusPlus = document.getElementById('btn-focus-plus');
const btnBreakMinus = document.getElementById('btn-break-minus');
const btnBreakPlus = document.getElementById('btn-break-plus');
const btnLoop = document.getElementById('btn-loop');
const btnStart = document.getElementById('btn-start');
const btnClose = document.getElementById('btn-close');

// Initialize UI
function updateHomeUI() {
    focusTimeDisplay.textContent = `${focusDuration}:00`;
    breakTimeDisplay.textContent = `${breakDuration}:00`;
    btnLoop.textContent = `X${loopMode}`;
}

// Close Button Logic
if (btnClose) {
    btnClose.addEventListener('click', () => {
        ipcRenderer.send('close-app');
    });
}

// Event Listeners for Home Screen
btnFocusMinus.addEventListener('click', () => {
    if (focusDuration > 5) {
        focusDuration -= 5;
        updateHomeUI();
    }
});

btnFocusPlus.addEventListener('click', () => {
    if (focusDuration < 60) {
        focusDuration += 5;
        updateHomeUI();
    }
});

btnBreakMinus.addEventListener('click', () => {
    if (breakDuration > 5) {
        breakDuration -= 5;
        updateHomeUI();
    }
});

btnBreakPlus.addEventListener('click', () => {
    if (breakDuration < 30) {
        breakDuration += 5;
        updateHomeUI();
    }
});

btnLoop.addEventListener('click', () => {
    if (loopMode === 1) loopMode = 2;
    else if (loopMode === 2) loopMode = 4;
    else loopMode = 1;
    updateHomeUI();
});

btnStart.addEventListener('click', () => {
    currentLoop = 0;
    isFocus = true;
    startTimer(focusDuration * 60);
});

// Timer Logic
function startTimer(duration) {
    remainingTime = duration;
    const initialTime = duration;

    // Switch Screens
    homeScreen.classList.remove('active');
    if (isFocus) {
        focusScreen.classList.add('active');
        breakScreen.classList.remove('active');
        updateTimerDisplay(focusTimerDisplay, remainingTime);
    } else {
        focusScreen.classList.remove('active');
        breakScreen.classList.add('active');
        updateTimerDisplay(breakTimerDisplay, remainingTime);
    }

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        remainingTime--;

        if (isFocus) {
            updateTimerDisplay(focusTimerDisplay, remainingTime);
            // Update progress bar
            const progress = ((initialTime - remainingTime) / initialTime) * 100;
            focusProgressBar.style.width = `${progress}%`;
        } else {
            updateTimerDisplay(breakTimerDisplay, remainingTime);
        }

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            handleTimerComplete();
        }
    }, 1000); // Update every 1 second
}

function updateTimerDisplay(element, seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    element.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
}

function handleTimerComplete() {
    if (isFocus) {
        isFocus = false;
        // If we finished a focus and have loops left, go to break
        startTimer(breakDuration * 60); // Break runs
    } else {
        // Finished Break
        currentLoop++;
        if (currentLoop < loopMode) {
            isFocus = true;
            startTimer(focusDuration * 60);
        } else {
            // All loops done, return home
            resetToHome();
        }
    }
}

function resetToHome() {
    homeScreen.classList.add('active');
    focusScreen.classList.remove('active');
    breakScreen.classList.remove('active');
    isFocus = true;
    currentLoop = 0;
}

// Focus Screen Elements
const focusTimerDisplay = document.getElementById('focus-timer-display');
const focusProgressBar = document.getElementById('focus-progress-bar');
const breakTimerDisplay = document.getElementById('break-timer-display');

// Initial Call
updateHomeUI();
homeScreen.classList.add('active');
