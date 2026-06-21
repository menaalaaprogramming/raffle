const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

// تحميل البيانات من localStorage بشكل آمن
let names = [];

try {
  const saved = localStorage.getItem("wheel_names");
  names = saved ? JSON.parse(saved) : [];
} catch (e) {
  names = [];
  localStorage.removeItem("wheel_names");
}

let startAngle = 0;
let arc = 0;
let spinning = false;

// أول تحميل
updateList();
drawWheel();

// إضافة اسم
function addName() {
  const input = document.getElementById("nameInput");
  const name = input.value.trim();

  if (name === "") return;

  names.push(name);

  // 💾 مهم جدًا
  localStorage.setItem("wheel_names", JSON.stringify(names));

  input.value = "";

  updateList();
  drawWheel();
}

// عرض القائمة
function updateList() {
  const list = document.getElementById("namesList");
  list.innerHTML = "";

  names.forEach(n => {
    const li = document.createElement("li");
    li.textContent = n;
    list.appendChild(li);
  });
}

// رسم العجلة
function drawWheel() {
  if (names.length === 0) return;

  arc = (2 * Math.PI) / names.length;

  ctx.clearRect(0, 0, 400, 400);

  for (let i = 0; i < names.length; i++) {
    const angle = startAngle + i * arc;

    // ألوان فخمة (ذهبي + أسود + كريمي)
    const colors = ["#d4af37", "#111", "#c9a227", "#222"];
    ctx.fillStyle = colors[i % colors.length];

    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, angle, angle + arc);
    ctx.fill();

    // النص
    ctx.save();

    ctx.translate(
      200 + Math.cos(angle + arc / 2) * 120,
      200 + Math.sin(angle + arc / 2) * 120
    );

    ctx.rotate(angle + arc / 2);

    // ✨ تحسين الخط
    ctx.fillStyle = "white";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // ظل للنص عشان الوضوح
    ctx.shadowColor = "black";
    ctx.shadowBlur = 4;

    ctx.fillText(names[i], 0, 0);

    ctx.restore();
  }
}

// دوران العجلة
function spinWheel() {
  if (spinning || names.length === 0) return;

  spinning = true;

  let spinAngle = Math.random() * 10 + 20;
  let spinTime = 0;
  let spinDuration = 4000;

  function rotate() {
    spinTime += 30;

    if (spinTime >= spinDuration) {
      stopSpin();
      return;
    }

    startAngle += spinAngle * (1 - spinTime / spinDuration);
    drawWheel();
    requestAnimationFrame(rotate);
  }

  rotate();
}

// تحديد الفائز
function stopSpin() {
  spinning = false;

  const degrees = startAngle * 180 / Math.PI + 90;
  const normalized = (360 - (degrees % 360));
  const index = Math.floor(normalized / (360 / names.length));

  const winner = names[index];

  document.getElementById("result").textContent =
    "🏆 الفائز هو: " + winner;
}

// أول رسم
drawWheel();