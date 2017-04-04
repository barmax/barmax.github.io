'use strict';

function rand(from, to) {
  return Math.floor((to - from + 1) * Math.random()) + from;
} // взлет случайного шарика

function getRandomBubble() {
  const next = lines[rand(0, lines.length - 1)];
  if (getRandomBubble.prev && next === getRandomBubble.prev) {
    return getRandomBubble();
  }
  getRandomBubble.prev = next;
  return next;
}; // исключение повторения взлета шарика

function showButton() {
  startButton.style.display = 'initial';
} // показ кнопки "начать"

function hideButton() {
  startButton.style.display = 'none';
} // скрытие кнопки "начать"

function showBubble(line) {
  line.classList.remove('boom');
  line.classList.add('up');
} // шарик взлетает

function hideBubble(line) {
  line.classList.remove('up');
} // скрытие шарика

function boomBubble(line) {
  line.classList.add('boom');
} // взрыв шарика

function nextBubble() {
  if (!isGameStarted) {
    return resetGame();
  }
  const bubble = getRandomBubble();
  showBubble(bubble);
  bubble.timeout = setTimeout(() => {
    hideBubble(bubble);
  }, rand(800, 2100));
  setTimeout(nextBubble, rand(800, 2100));
} // вплытие следующего шарика

function handleBubbleClick() {
  const bubble = this.parentElement;
  clearTimeout(bubble.timeout);
  incPoints();
  boomBubble(bubble);
  hideBubble(bubble);
} // клик по шарику

function updateScoreboard() {
  scoreboard.dataset.points = currentPoints;
} // обновление счета

function updateTopScore() {
  bestScore.dataset.points = topPoints;
} // обновление лучшего счета

function checkTopScore() {
  if (currentPoints <= topPoints) {
    return;
  }
  topPoints = currentPoints;
  updateTopScore();
  saveTopScore(topPoints);
} // проверка текущего рез-та с лучшим

function incPoints() {
  ++currentPoints;
  updateScoreboard();
} // обновление результата

function resetPoints() {
  currentPoints = 0;
  updateScoreboard();
} // сброс рез-та

function startTimer() {
  showTimer(GAME_TIMEOUT);
  startedAt = Date.now();
  startTimer.interval = setInterval(updateTimer, 500);
}

function updateTimer() {
  if (!isGameStarted) {
    return;
  }
  let timeout = GAME_TIMEOUT - (Date.now() - startedAt);
  if (timeout < 0 ) {
    timeout = 0;
  }
  showTimer(timeout);
}

function showTimer(timeout) {
  timer.innerHTML = timeToString(timeout);
}

function startGame() {
  resetPoints();
  isGameStarted = true;
  hideButton();
  nextBubble();
  setTimeout(stopGame, GAME_TIMEOUT);
  startTimer();
} // старт игры

function resetGame() {
  showButton();
  checkTopScore();
} // сброс предыдущей игры

function stopGame() {
  isGameStarted = false;
  clearInterval(startTimer.interval);
} // остановка игры

function loadTopScore() {
  if (!localStorage) return 0;
  const score = localStorage.getItem('topScore');
  return score ? score : 0;
} // сравнение

function saveTopScore(score) {
  if (!localStorage) return;
  localStorage.setItem('topScore', score);
}

function timeToString(time) {
  const MSECONDS_IN_SEC = 1000;
  const MSECONDS_IN_MIN = 60 * MSECONDS_IN_SEC;

  let min = Math.floor(time / MSECONDS_IN_MIN);
  let sec = Math.floor((time % MSECONDS_IN_MIN) / MSECONDS_IN_SEC);
  let msec = (time % MSECONDS_IN_MIN) % MSECONDS_IN_SEC;
  let spacer = msec > 500 ? ':' : '&nbsp;';
  return [min, sec]
    .map(number => number >= 10 ? number : `0${number}`)
    .join(spacer);
}

const GAME_TIMEOUT = 15000;
let currentPoints = 0, topPoints = 0, isGameStarted = false, startedAt;
const lines = document.getElementsByClassName('hole');
const bubbles = document.getElementsByClassName('bubble');
const startButton = document.querySelector('.startButton');
const scoreboard = document.getElementById('currentScoreView');
const bestScore = document.getElementById('topScoreView');
const timer = document.querySelector('.timer');

for (let bubble of bubbles) {
  bubble.addEventListener('click', handleBubbleClick);
}
topPoints = loadTopScore();
updateTopScore();
startButton.addEventListener('click', startGame);
