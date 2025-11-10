const intervals = [
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
  { name: "kleine None", semitones: 13 },
  { name: "große None", semitones: 14 },
  { name: "kleine Dezime", semitones: 15 },
  { name: "große Dezime", semitones: 16 }
];

let currentInterval;
let correctCount = 0;
let totalCount = 0;

document.getElementById("play-interval").addEventListener("click", () => {
  playRandomInterval();
});

function playRandomInterval() {
  const random = intervals[Math.floor(Math.random() * intervals.length)];
  currentInterval = random;

  const rootNote = 60 + Math.floor(Math.random() * 12); // MIDI note
  const freq1 = midiToFreq(rootNote);
  const freq2 = midiToFreq(rootNote + random.semitones);

  playTone(freq1, 0);
  playTone(freq2, 1);

  renderOptions(random.name);
}

function midiToFreq(n) {
  return 440 * Math.pow(2, (n - 69) / 12);
}

function playTone(freq, delay) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
  gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + 0.8);
}

function renderOptions(correctName) {
  const container = document.getElementById("options-container");
  container.innerHTML = "";

  const names = shuffle(intervals.map(i => i.name)).slice(0, 5);
  if (!names.includes(correctName)) {
    names[Math.floor(Math.random() * names.length)] = correctName;
  }

  names.forEach(name => {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = name;
    div.onclick = () => handleAnswer(name);
    container.appendChild(div);
  });
}

function handleAnswer(selected) {
  totalCount++;
  const correct = selected === currentInterval.name;

  if (correct) {
    correctCount++;
    document.getElementById("result-text").textContent = "Richtig ✅";
  } else {
    document.getElementById("result-text").textContent = "Falsch ❌";
  }

  updateScore();
  updateFeedback(selected);
  saveAnswer(currentInterval.name, correct);
}

function updateScore() {
  const percent = Math.round((correctCount / totalCount) * 100);
  document.getElementById("score").textContent = `${percent}%`;
}

function updateFeedback(selectedName) {
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

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
