const missions = [
  {
    number: 1,
    icon: "🧱",
    title: "¿Cuántos necesitamos?",
    text: "Lulu necesita <strong>5 rectángulos</strong> para comenzar a construir las paredes de su casa. ¿Cuántos necesita?",
    type: "number",
    options: [3, 5, 7],
    answer: 5,
    reward: "5 bloques"
  },
  {
    number: 2,
    icon: "➕",
    title: "¿Cuántos faltan?",
    text: "Lulu necesita <strong>8 rectángulos</strong> para su casa y ya tiene 5. ¿Cuántos le faltan?",
    type: "number",
    options: [2, 3, 4],
    answer: 3,
    reward: "3 bloques"
  },
  {
    number: 3,
    icon: "🔢",
    title: "Ponlos en orden",
    text: "Lulu encontró estos números. ¿Cuál está ordenado de menor a mayor?",
    type: "sequence",
    options: [
      {label: "1 — 2 — 3 — 4 — 5", value: "correct"},
      {label: "1 — 3 — 2 — 4 — 5", value: "wrong"},
      {label: "5 — 4 — 3 — 2 — 1", value: "wrong"}
    ],
    answer: "correct",
    reward: "Ordenar los materiales"
  },
  {
    number: 4,
    icon: "⚖️",
    title: "¿Dónde hay más?",
    text: "Lulu necesita encontrar el grupo que tiene <strong>más bloques</strong>. ¿Cuál debe elegir?",
    type: "groups",
    options: [
      {label: "A", count: 4},
      {label: "B", count: 7},
      {label: "C", count: 5}
    ],
    answer: "B",
    reward: "Más materiales"
  },
  {
    number: 5,
    icon: "🔺",
    title: "El techo de Lulu",
    text: "La casa está casi lista. Lulu necesita una figura que tenga <strong>3 lados</strong>. ¿Cuál debe utilizar?",
    type: "shape",
    options: [
      {label: "Triángulo", shape: "triangle", value: "triangle"},
      {label: "Cuadrado", shape: "square", value: "square"},
      {label: "Círculo", shape: "circle", value: "circle"}
    ],
    answer: "triangle",
    reward: "El techo de la casa"
  }
];

const state = {
  currentMission: 0,
  blocks: 0,
  completed: false,
  locked: false
};

const introScreen = document.querySelector("#introScreen");
const gameScreen = document.querySelector("#gameScreen");
const finishScreen = document.querySelector("#finishScreen");
const startBtn = document.querySelector("#startBtn");
const restartBtn = document.querySelector("#restartBtn");

const missionCounter = document.querySelector("#missionCounter");
const progressBar = document.querySelector("#progressBar");
const missionIcon = document.querySelector("#missionIcon");
const missionLabel = document.querySelector("#missionLabel");
const missionTitle = document.querySelector("#missionTitle");
const missionText = document.querySelector("#missionText");
const challengeArea = document.querySelector("#challengeArea");
const feedback = document.querySelector("#feedback");

const blocksCount = document.querySelector("#blocksCount");
const houseProgress = document.querySelector("#houseProgress");
const housePercent = document.querySelector("#housePercent");
const house = document.querySelector("#house");
const rain = document.querySelector("#rain");

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

function startGame() {
  introScreen.classList.add("hidden");
  finishScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  const backgroundMusic = document.getElementById("backgroundMusic");
  backgroundMusic.volume = 0.25;
  backgroundMusic.play();

  state.currentMission = 0;
  state.blocks = 0;
  state.completed = false;
  state.locked = false;

  renderMission();
  updateWorld();
}

function restartGame() {
  rain.classList.add("hidden");
  startGame();
  window.scrollTo({top: 0, behavior: "smooth"});
}

function renderMission() {
  const mission = missions[state.currentMission];

  state.locked = false;
  missionCounter.textContent = `Misión ${mission.number} de ${missions.length}`;
  progressBar.style.width = `${(mission.number / missions.length) * 100}%`;

  missionIcon.textContent = mission.icon;
  missionLabel.textContent = `MISIÓN ${mission.number}`;
  missionTitle.textContent = mission.title;
  missionText.innerHTML = mission.text;
  feedback.textContent = "";
  feedback.className = "feedback";

  challengeArea.innerHTML = "";

  if (mission.type === "number") {
    renderNumberChallenge(mission);
  }

  if (mission.type === "sequence") {
    renderSequenceChallenge(mission);
  }

  if (mission.type === "groups") {
    renderGroupChallenge(mission);
  }

  if (mission.type === "shape") {
    renderShapeChallenge(mission);
  }
}

function renderNumberChallenge(mission) {
  mission.options.forEach(option => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.textContent = option;
    button.addEventListener("click", () => checkAnswer(option));
    challengeArea.appendChild(button);
  });
}

function renderSequenceChallenge(mission) {
  mission.options.forEach(option => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.textContent = option.label;
    button.addEventListener("click", () => checkAnswer(option.value));
    challengeArea.appendChild(button);
  });
}

function renderGroupChallenge(mission) {
  mission.options.forEach(option => {
    const button = document.createElement("button");
    button.className = "group-choice";

    const title = document.createElement("span");
    title.className = "group-title";
    title.textContent = `Grupo ${option.label}`;

    const blocks = document.createElement("span");
    blocks.className = "blocks-row";
    blocks.textContent = "🟦".repeat(option.count);

    button.appendChild(title);
    button.appendChild(blocks);
    button.addEventListener("click", () => checkAnswer(option.label));

    challengeArea.appendChild(button);
  });
}

function renderShapeChallenge(mission) {
  const wrapper = document.createElement("div");
  wrapper.className = "choice-group";

  mission.options.forEach(option => {
    const button = document.createElement("button");
    button.className = "shape-choice";

    const shape = document.createElement("div");
    shape.className = `shape ${option.shape}`;

    const label = document.createElement("span");
    label.textContent = option.label;

    button.appendChild(shape);
    button.appendChild(label);

    button.addEventListener("click", () => checkAnswer(option.value));
    wrapper.appendChild(button);
  });

  challengeArea.appendChild(wrapper);
}

function checkAnswer(answer) {
  if (state.locked) return;

  const mission = missions[state.currentMission];

  if (answer === mission.answer) {
    handleCorrectAnswer(mission);
  } else {
    handleWrongAnswer();
  }
}

function handleWrongAnswer() {
  feedback.textContent = "🤔 Casi... ¡Mira con atención e inténtalo nuevamente!";
  feedback.className = "feedback error";
  challengeArea.classList.remove("shake");
  void challengeArea.offsetWidth;
  challengeArea.classList.add("shake");
}

function handleCorrectAnswer(mission) {
  state.locked = true;

  feedback.textContent = `🎉 ¡Muy bien! Lulu consiguió ${mission.reward}.`;
  feedback.className = "feedback success";

  disableChoices();
  animateReward();

  setTimeout(() => {
    if (state.currentMission === 0) {
      addBlocks(5, () => nextMission());
    } else if (state.currentMission === 1) {
      addBlocks(3, () => nextMission());
    } else {
      nextMission();
    }
  }, 650);
}

function disableChoices() {
  challengeArea.querySelectorAll("button").forEach(button => {
    button.disabled = true;
  });
}

function animateReward() {
  blocksCount.parentElement.classList.remove("pulse");
  void blocksCount.parentElement.offsetWidth;
  blocksCount.parentElement.classList.add("pulse");
}

function addBlocks(amount, callback) {
  const target = state.blocks + amount;
  let current = state.blocks;

  const timer = setInterval(() => {
    current++;
    state.blocks = current;
    updateWorld();

    if (current >= target) {
      clearInterval(timer);
      setTimeout(callback, 350);
    }
  }, 180);
}

function nextMission() {
  if (state.currentMission >= missions.length - 1) {
    finishGame();
    return;
  }

  state.currentMission++;
  renderMission();
  updateWorld();
}

function updateWorld() {
  const stage = Math.min(state.currentMission, 4);
  house.className = `house stage-${stage}`;

  blocksCount.textContent = state.blocks;

  const construction = Math.min(
    100,
    Math.round((state.currentMission / missions.length) * 100)
  );

  houseProgress.style.width = `${construction}%`;
  housePercent.textContent = `${construction}%`;
}

function finishGame() {
  state.completed = true;
  state.blocks = 8;

  blocksCount.textContent = state.blocks;
  house.className = "house stage-5";
  houseProgress.style.width = "100%";
  housePercent.textContent = "100%";

  setTimeout(() => {
    gameScreen.classList.add("hidden");
    finishScreen.classList.remove("hidden");
    rain.classList.remove("hidden");
    window.scrollTo({top: 0, behavior: "smooth"});
  }, 900);
}