const { ipcRenderer } = require('electron');

// State variables
let focusDuration = 25; // minutes
let breakDuration = 5; // minutes
let loopMode = 1; // 1, 2, or 4
let currentLoop = 0;
let isFocus = true; // true if focus, false if break
let timerInterval = null;
let remainingTime = 0; // seconds

// Settings State
let volume = 50;
let backgrounds = {
    home: './img/image-bg-home.png',
    focus: './img/image-bg-start.png',
    break: './img/image-bg-stop.png'
};
let language = 'es';

// Language Dictionary
const texts = {
    es: {
        title: 'POMODORO',
        focusState: 'FOCO!',
        breakState: 'DESCANSO',
        start: 'INICIAR',
        settingsTitle: 'AJUSTES',
        volume: 'Volumen',
        bgHome: 'Fondo Inicio (URL)',
        bgFocus: 'Fondo Foco (URL)',
        bgBreak: 'Fondo Descanso (URL)',
        lang: 'Idioma',
        back: 'VOLVER'
    },
    en: {
        title: 'POMODORO',
        focusState: 'FOCUS!',
        breakState: 'BREAK',
        start: 'START',
        settingsTitle: 'SETTINGS',
        volume: 'Volume',
        bgHome: 'Home BG (URL)',
        bgFocus: 'Focus BG (URL)',
        bgBreak: 'Break BG (URL)',
        lang: 'Language',
        back: 'BACK'
    }
};

// DOM Elements
const homeScreen = document.getElementById('home-screen');
const focusScreen = document.getElementById('focus-screen');
const breakScreen = document.getElementById('break-screen');
const settingsScreen = document.getElementById('settings-screen');

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
const btnSettings = document.getElementById('btn-settings');
const homeTitle = document.querySelector('#home-screen .title');

// Settings Elements
const volumeSlider = document.getElementById('volume-slider');
const bgHomeInput = document.getElementById('bg-home-input');
const bgFocusInput = document.getElementById('bg-focus-input');
const bgBreakInput = document.getElementById('bg-break-input');
const btnLangEs = document.getElementById('btn-lang-es');
const btnLangEn = document.getElementById('btn-lang-en');
const btnSettingsBack = document.getElementById('btn-settings-back');
const lblVolume = document.getElementById('lbl-volume');
const lblBgHome = document.getElementById('lbl-bg-home');
const lblBgFocus = document.getElementById('lbl-bg-focus');
const lblBgBreak = document.getElementById('lbl-bg-break');
const lblLang = document.getElementById('lbl-lang');
const settingsTitle = document.getElementById('settings-title');

// Focus/Break Screen Elements
const focusTimerDisplay = document.getElementById('focus-timer-display');
const focusProgressBar = document.getElementById('focus-progress-bar');
const breakTimerDisplay = document.getElementById('break-timer-display');
const focusStateTitle = document.querySelector('#focus-screen .state-title');
const breakStateTitle = document.querySelector('#break-screen .state-title');

// Load Settings from LocalStorage
function loadSettings() {
    const savedVolume = localStorage.getItem('pomodoro_volume');
    if (savedVolume !== null) volume = parseInt(savedVolume);

    const savedBgs = localStorage.getItem('pomodoro_backgrounds');
    if (savedBgs) backgrounds = JSON.parse(savedBgs);

    const savedLang = localStorage.getItem('pomodoro_language');
    if (savedLang) language = savedLang;

    // Apply UI
    volumeSlider.value = volume;
    if (backgrounds.home && !backgrounds.home.startsWith('./')) bgHomeInput.value = backgrounds.home;
    if (backgrounds.focus && !backgrounds.focus.startsWith('./')) bgFocusInput.value = backgrounds.focus;
    if (backgrounds.break && !backgrounds.break.startsWith('./')) bgBreakInput.value = backgrounds.break;

    updateLanguageUI();
    applyBackgrounds();
}

function saveSettings() {
    localStorage.setItem('pomodoro_volume', volume);
    localStorage.setItem('pomodoro_backgrounds', JSON.stringify(backgrounds));
    localStorage.setItem('pomodoro_language', language);
}

function applyBackgrounds() {
    if (backgrounds.home) homeScreen.style.backgroundImage = `url('${backgrounds.home}')`;
    if (backgrounds.focus) focusScreen.style.backgroundImage = `url('${backgrounds.focus}')`;
    if (backgrounds.break) breakScreen.style.backgroundImage = `url('${backgrounds.break}')`;
}

function updateLanguageUI() {
    const t = texts[language];

    // Buttons state
    if (language === 'es') {
        btnLangEs.classList.add('active');
        btnLangEn.classList.remove('active');
    } else {
        btnLangEn.classList.add('active');
        btnLangEs.classList.remove('active');
    }

    // Texts
    if (homeTitle) homeTitle.textContent = t.title;
    if (focusStateTitle) focusStateTitle.textContent = t.focusState;
    if (breakStateTitle) breakStateTitle.textContent = t.breakState;
    btnStart.textContent = t.start;
    settingsTitle.textContent = t.settingsTitle;
    lblVolume.textContent = t.volume;
    lblBgHome.textContent = t.bgHome;
    lblBgFocus.textContent = t.bgFocus;
    lblBgBreak.textContent = t.bgBreak;
    lblLang.textContent = t.lang;
    btnSettingsBack.textContent = t.back;
}

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

// Settings Navigation
btnSettings.addEventListener('click', () => {
    homeScreen.classList.remove('active');
    settingsScreen.classList.add('active');
});

btnSettingsBack.addEventListener('click', () => {
    settingsScreen.classList.remove('active');
    homeScreen.classList.add('active');
});

// Settings Interactions
volumeSlider.addEventListener('input', (e) => {
    volume = e.target.value;
    saveSettings();
});

// Debounce helper for inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const updateBackgrounds = debounce(() => {
    if (bgHomeInput.value.trim()) backgrounds.home = bgHomeInput.value.trim();
    if (bgFocusInput.value.trim()) backgrounds.focus = bgFocusInput.value.trim();
    if (bgBreakInput.value.trim()) backgrounds.break = bgBreakInput.value.trim();
    saveSettings();
    applyBackgrounds();
}, 500);

bgHomeInput.addEventListener('input', updateBackgrounds);
bgFocusInput.addEventListener('input', updateBackgrounds);
bgBreakInput.addEventListener('input', updateBackgrounds);

btnLangEs.addEventListener('click', () => {
    language = 'es';
    saveSettings();
    updateLanguageUI();
});

btnLangEn.addEventListener('click', () => {
    language = 'en';
    saveSettings();
    updateLanguageUI();
});

// Sound
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playBeep() {
    if (volume == 0) return;

    // Create oscillator
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = 880; // A5

    // Volume control (logarithmic approximation)
    const vol = volume / 100;
    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
}

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
            playBeep(); // Play sound
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

// Initial Call
loadSettings(); // Load settings first
updateHomeUI();
homeScreen.classList.add('active');

