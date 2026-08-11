function showAurora() {
  const aurora = document.getElementById("aurora");
  if (!aurora) return;
  aurora.style.left = Math.random() * 70 + 10 + "%";
  aurora.style.opacity = "1";
  setTimeout(() => { aurora.style.opacity = "0"; }, 7000);
}

setInterval(() => {
  if (Math.random() > 0.6) showAurora();
}, 30000);

function todaySky() {
  document.getElementById("stars").innerText = Math.floor(Math.random() * 300 + 500);
  document.getElementById("chance").innerText = Math.floor(Math.random() * 60) + "%";
  const h = new Date().getHours();
  document.getElementById("night").innerText = (h > 18 || h < 6) ? "深夜星空" : "白昼等待夜晚";
}
window.todaySky = todaySky;