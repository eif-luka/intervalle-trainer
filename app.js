// Liste aller Intervalle bis Oktave
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
  { name: "reine Oktave", semitones: 12 }
];

let currentInterval = null;
let rootNote = 60; // MIDI-Startnote
let correctCount = 0;
let totalCount = 0;

// Setup Soundfont
const AudioContext = window.AudioContext || window.webkitAudioContext;
const ac = new AudioContext();
let piano;

// Klavier laden
Soundfont.instrument(ac, "acoustic_grand_piano").then(instrument => {
  piano = instrument;
  console.log("🎹 Klavier geladen!");
});

// Button-Events
document.getElementById("play-interval").onclick = playNewInterval;
document.getElementById("repeat-interval").onclick = repeatInterval;

function playNewInterval() {
  if (!piano) return alert("Klavier lädt noch... bitte kurz warten 🎹");

  const random = intervals[Math.floor(Math.random() * intervals.length)];
  currentInterval = random;
  rootNote = 60 + Math.floor(Math.random() * 12); // zufälliger Startton

  playInterval(rootNote, random.semitones);
  renderOptions();
}

function repeatInterval() {
  if (currentInterval && piano) {
    playInterval(rootNote, currentInterval.semitones);
  }
}

function playInterval(root, semitones) {
  const delay1 = ac.currentTime;
  const delay2 = delay1 + 1.0;
  const together = delay2 + 1.2;

  // Erste Note
  piano.play(root, delay1, { duration: 1.0, gain: 0.8 });
  // Zweite Note (Intervall)
  piano.play(root + semitones, delay2, { duration: 1.0, gain: 0.8 });
  // Beide zusammen
  piano.play(root, together, { duration: 1.5, gain: 0.8 });
  piano.play(root + semitones, together, { duration: 1.5, gain: 0.8 });
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
