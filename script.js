const data = {
  unit1: [
    { type: "mc", q: "Hello artinya?", o: ["Halo","Dadah"], a: "Halo" },
    { type: "mc", q: "Cat artinya?", o: ["Kucing","Anjing"], a: "Kucing" }
  ],
  unit2: [
    { type: "arrange", q: "Susun: I love you",
      words: ["you","I","love"],
      a: "I love you"
    }
  ]
};

let xp = Number(localStorage.getItem("xp")) || 0;
let streak = Number(localStorage.getItem("streak")) || 0;
let lastDate = localStorage.getItem("date");
let level = Math.floor(xp / 50) + 1;

let questions = [];
let current = 0;
let answerBox = "";

updateStats();
renderMap();
updateStreak();

function renderMap() {
  const map = document.getElementById("map");
  map.innerHTML = "";

  Object.keys(data).forEach((unit,i)=>{
    const div = document.createElement("div");
    div.className = "unit";
    div.innerHTML = `<h2>Unit ${i+1}</h2>`;
    const btn = document.createElement("div");
    btn.className = "lesson";
    btn.innerText = "Start Lesson";
    btn.onclick = ()=>startUnit(unit);
    div.appendChild(btn);
    map.appendChild(div);
  });
}

function startUnit(unit) {
  questions = shuffle([...data[unit]]);
  current = 0;
  document.getElementById("map").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");
  loadQuestion();
}

function loadQuestion() {
  const q = questions[current];
  document.getElementById("question").innerText = q.q;
  const opt = document.getElementById("options");
  const bank = document.getElementById("word-bank");
  opt.innerHTML = "";
  bank.innerHTML = "";

  if (q.type === "mc") {
    q.o.forEach(o=>{
      const b = document.createElement("button");
      b.innerText = o;
      b.onclick = ()=>check(o,b);
      opt.appendChild(b);
    });
  }

  if (q.type === "arrange") {
    answerBox = "";
    shuffle(q.words).forEach(w=>{
      const span = document.createElement("span");
      span.className = "word";
      span.innerText = w;
      span.onclick = ()=>{
        answerBox += w + " ";
        span.remove();
        if (answerBox.trim() === q.a) correct();
      };
      bank.appendChild(span);
    });
  }
}

function check(ans,btn) {
  if (ans === questions[current].a) {
    btn.classList.add("correct");
    correct();
  } else {
    btn.classList.add("wrong");
  }
}

function correct() {
  xp += 10;
  save();
  current++;
  setTimeout(()=>{
    current < questions.length ? loadQuestion() : endLesson();
  },600);
}

function endLesson() {
  alert("Unit selesai 🎉");
  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("map").classList.remove("hidden");
}

function save() {
  localStorage.setItem("xp",xp);
  updateStats();
}

function updateStats() {
  level = Math.floor(xp/50)+1;
  document.getElementById("xp").innerText = xp;
  document.getElementById("level").innerText = level;
  document.getElementById("streak").innerText = streak;
}

function updateStreak() {
  const today = new Date().toDateString();
  if (today !== lastDate) {
    streak++;
    localStorage.setItem("streak",streak);
    localStorage.setItem("date",today);
  }
}

function shuffle(arr){ return arr.sort(()=>Math.random()-0.5); }
