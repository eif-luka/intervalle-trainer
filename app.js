const intervals = [
  { name: "Prime", semitones: 0 },
  { name: "kleine Sekunde", semitones: 1 },
  { name: "große Sekunde", semitones: 2 },
  { name: "kleine Terz", semitones: 3 },
  { name: "große Terz", semitones: 4 },
  { name: "reine Quarte", semitones: 5 },
  { name: "überm. Quarte", semitones: 6 },
  { name: "reine Quinte", semitones: 7 },
  { name: "kleine Sexte", semitones: 8 },
  { name: "große Sexte", semitones: 9 },
  { name: "kleine Septime", semitones: 10 },
  { name: "große Septime", semitones: 11 },
  { name: "reine Oktave", semitones: 12 },
];

let currentInterval = null;
let rootNote = 60; // Default MIDI note
let correctCount = 0;
let totalCount = 0;

// Buttons
document.getElementById("play-interval").onclick = playNewInterval;
document.getElementById("repeat-interval").onclick = repeatInterval;

function playNewInterval() {
  const random = intervals[Math.floor(Math.random() * intervals.length)];
  currentInterval = random;
  rootNote = 60 + Math.floor(Math.random() * 12); // Random MIDI note C4–B4

  playInterval(rootNote, random.semitones);
  renderOptions();
}

function repeatInterval() {
  if (currentInterval) {
    playInterval(rootNote, currentInterval.semitones);
  }
}

function playInterval(root, semitones) {
  const freq1 = midiToFreq(root);
  const freq2 = midiToFreq(root + semitones);

  const ctx = new (window.AudioContext || window.webkitAudioContext)();

  // Nacheinander spielen
  playTone(ctx, freq1, 0);
  playTone(ctx, freq2, 1);

  // Zusammenklang danach
  const togetherDelay = 2;
  playTone(ctx, freq1, togetherDelay, 1.0);
  playTone(ctx, freq2, togetherDelay, 1.0);
}

function playTone(ctx, freq, delay, duration = 0.8) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
  gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

function midiToFreq(n) {
  return 440 * Math.pow(2, (n - 69) / 12);
}

function renderOptions() {
  const container = document.getElementById("options-container");
  container.innerHTML = "";

  intervals.forEach(interval => {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = interval.name;
    div.onclick = () => handleAnswer(interval.name);
    container.appendChild(div);
  });
}

function handleAnswer(selectedName) {
  totalCount++;
  const correct = selectedName === currentInterval.name;

  if (correct) {
    correctCount++;
    document.getElementById("result-text").textContent = "Richtig ✅";
  } else {
    document.getElementById("result-text").textContent = "Falsch ❌";
  }

  updateScore();
  showVisualFeedback(selectedName);
  saveAnswer(currentInterval.name, correct);
}

function updateScore() {
  const percent = Math.round((correctCount / totalCount) * 100);
  document.getElementById("score").textContent = `${percent}%`;
}

function showVisualFeedback(selectedName) {
  document.querySelectorAll(".option").forEach(opt => {
    if (opt.textContent === currentInterval.name) {
      opt.classList.add("correct");
    } else if (opt.textContent === selectedName) {
      opt.classList.add("incorrect");
    } else {
      opt.style.opacity = "0.5";
    }
  });
}
