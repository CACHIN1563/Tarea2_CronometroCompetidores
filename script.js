let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let competitors = [];
let isRunning = false;

const display = document.getElementById('display');
const startStopBtn = document.getElementById('startStopBtn');
const captureBtn = document.getElementById('captureBtn');
const resetBtn = document.getElementById('resetBtn');
const resultsBody = document.getElementById('resultsBody');
const noResults = document.getElementById('noResults');

function timeToString(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);

    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);

    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);

    let diffInMs = (diffInSec - ss) * 100;
    let ms = Math.floor(diffInMs);

    let formattedHH = hh.toString().padStart(2, "0");
    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
    let formattedMS = ms.toString().padStart(2, "0");

    return `${formattedHH}:${formattedMM}:${formattedSS}.<span class="ms">${formattedMS}</span>`;
}

function formatGap(time) {
    if (time === 0) return '<span class="gap-win">LÍDER</span>';
    
    let seconds = (time / 1000).toFixed(2);
    return `<span class="gap-late">+${seconds}s</span>`;
}

function updateDisplay() {
    elapsedTime = Date.now() - startTime;
    display.innerHTML = timeToString(elapsedTime);
}

function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateDisplay, 10);
    isRunning = true;
    startStopBtn.textContent = 'Pausar';
    startStopBtn.classList.add('btn-outline');
    startStopBtn.classList.remove('btn-primary');
    captureBtn.disabled = false;
}

function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startStopBtn.textContent = 'Continuar';
    startStopBtn.classList.remove('btn-outline');
    startStopBtn.classList.add('btn-primary');
}

function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    startTime = 0;
    isRunning = false;
    display.innerHTML = "00:00:00.<span class="ms">00</span>";
    startStopBtn.textContent = 'Iniciar';
    startStopBtn.classList.remove('btn-outline');
    startStopBtn.classList.add('btn-primary');
    captureBtn.disabled = true;
    competitors = [];
    resultsBody.innerHTML = '';
    noResults.style.display = 'block';
}

function captureCompetitor() {
    if (!isRunning && elapsedTime === 0) return;

    const currentTime = elapsedTime;
    const competitorCount = competitors.length + 1;
    
    const firstTime = competitors.length > 0 ? competitors[0].time : currentTime;
    const gap = currentTime - firstTime;

    const competitorData = {
        id: competitorCount,
        name: `Competidor ${competitorCount}`,
        time: currentTime,
        gap: gap
    };

    competitors.push(competitorData);
    renderCompetitor(competitorData);
    noResults.style.display = 'none';
}

function renderCompetitor(comp) {
    const row = document.createElement('tr');
    row.className = 'new-row';
    row.innerHTML = `
        <td>${comp.id}</td>
        <td>${comp.name}</td>
        <td>${timeToString(comp.time)}</td>
        <td>${formatGap(comp.gap)}</td>
    `;
    resultsBody.appendChild(row);
    
    // Auto scroll to bottom
    const tableContainer = document.querySelector('.table-container');
    tableContainer.scrollTop = tableContainer.scrollHeight;
}

startStopBtn.addEventListener('click', () => {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer();
    }
});

captureBtn.addEventListener('click', captureCompetitor);
resetBtn.addEventListener('click', resetTimer);
