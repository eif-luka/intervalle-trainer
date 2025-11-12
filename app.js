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
let rootNote = 60; // MIDI note (Middle C = 60)
let correctCount = 0;
let totalCount = 0;
let piano = null;

// AudioContext vorbereiten
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Klavier laden
Soundfont.instrument(audioCtx, 'acoustic_grand_piano').then(function (p) {
  piano = p;
  console.log("🎹 Klavier geladen");
});

// Buttons verbinden
document.getElementById("play-interval").onclick = playNewInterval;
document.getElementById("repeat-interval").onclick = repeatInterval;

function playNewInterval() {
  currentInterval = intervals[Math.floor(Math.random() * intervals.length)];
  rootNote = 60 + Math.floor(Math.random() * 12);
  playInterval(rootNote, currentInterval.semitones);
  renderOptions();
}

function repeatInterval() {
  if (currentInterval) {
    playInterval(rootNote, currentInterval.semitones);
  }
}

function playInterval(root, semitones) {
  if (!piano) return;

  const note1 = root;
  const note2 = root + semitones;

  // Erst nacheinander
  piano.play(note1, audioCtx.currentTime + 0, { duration: 1 });
  piano.play(note2, audioCtx.currentTime + 1, { duration: 1 });

  // Dann zusammen
  piano.play(note1, audioCtx.currentTime + 2.2, { duration: 1.2 });
  piano.play(note2, audioCtx.currentTime + 2.2, { duration: 1.2 });
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
  showFeedback(selectedName);
  saveAnswer(currentInterval.name, correct);
}

function updateScore() {
  const percent = Math.round((correctCount / totalCount) * 100);
  document.getElementById("score").textContent = `${percent}%`;
}

function showFeedback(selectedName) {
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
