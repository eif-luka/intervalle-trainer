function saveAnswer(name, isCorrect) {
  const stats = JSON.parse(localStorage.getItem("intervalStats") || "{}");
  const entry = stats[name] || { correct: 0, total: 0 };

  // Ältere Antworten zählen weniger
  entry.correct = entry.correct * 0.95 + (isCorrect ? 1 : 0);
  entry.total = entry.total * 0.95 + 1;

  stats[name] = entry;
  localStorage.setItem("intervalStats", JSON.stringify(stats));
}

function showStats() {
  const stats = JSON.parse(localStorage.getItem("intervalStats") || "{}");
  const win = window.open("", "_blank");
  win.document.write("<h1>📊 Statistik</h1><table border='1'><tr><th>Intervall</th><th>Trefferrate</th></tr>");

  for (const [name, entry] of Object.entries(stats)) {
    const percent = ((entry.correct / entry.total) * 100).toFixed(1);
    win.document.write(`<tr><td>${name}</td><td>${percent}%</td></tr>`);
  }

  win.document.write("</table>");
}
