let rows = [];
let items = [];
const body = document.body;
const board = document.querySelector("#board");
const select = document.querySelector("#select");
const next = document.querySelector("#next");
const gameOverElement = document.querySelector("#gameOver");
const previewDrag = document.querySelector("[data-preview-drag='true']");
let currentLine = 0;

let colors = ["red", "green", "blue", "yellow", "pink", "orange"];

let trys = 10;
let randomPassword = [];
let delay = 0;
let delayIncrement = 10;
let gameOver = false;
let savedDrop = null;
let startedGame = false;
let dragging = false;
let won = false;

function generateMap() {
  dragging = false;

  if (!startedGame) {
    board.innerHTML = "";

    generateRandomPassword();
    console.log(JSON.stringify(randomPassword));

    for (let i = 0; i < trys; i++) {
      board.innerHTML += `
      <div class="row toanimate" data-id="${i}">
        <div class="corrects">
          <div class="pin"></div>
          <div class="pin"></div>
          <div class="pin"></div>
          <div class="pin"></div>
        </div>
        <div class="item" draggable="true"></div>
        <div class="item" draggable="true"></div>
        <div class="item" draggable="true"></div>
        <div class="item" draggable="true"></div>
      </div>`;
    }
  }

  rows = Array.from(document.querySelectorAll(".row"));
  items = Array.from(document.querySelectorAll(".item"));

  if (!startedGame) {
    updateCurrentLine();
  }

  for (let i = 0; i < rows.length; i++) {
    const current = rows[i];
    current.classList.add("toanimate");
    setTimeout(() => {
      current.classList.remove("toanimate");
      current.classList.add("animate");
      setTimeout(() => {
        current.classList.remove("animate");
      }, 1500);
    }, 100 * i);
  }

  if (!sawTutorial) {
    startTutorial();
  }

  startedGame = true;
}

function generateRandomPassword() {
  let possibles = Array.from(colors);

  for (let i = 0; i < 4; i++) {
    let randomNumber = random(0, possibles.length - 1);
    randomPassword.push(possibles[randomNumber]);
    possibles.splice(randomNumber, 1);
  }
}

function updateCurrentLine() {
  rows.forEach((row) => {
    if (row.dataset.id == currentLine) {
      row.setAttribute("data-selected", "true");
    } else {
      row.removeAttribute("data-selected");
    }
  });
}

let start = {
  x: -1,
  y: -1,
};

if (isMobile) {
  window.ontouchstart = (e) => {
    console.log("ontouchstart");
    console.log(e.changedTouches[0]);
    dragstart(e.changedTouches[0]);
  };

  window.ontouchmove = (e) => {
    console.log("ontouchmove");
    let touch = e.changedTouches[0];
    if (touch.clientY < window.innerHeight / 4) {
      window.scrollTo(0, window.scrollY - 1);
    }
    dragover(touch);
  };

  window.ontouchend = (e) => {
    console.log("ontouchend");
    console.log(e.changedTouches[0]);
    dragend(e.changedTouches[0]);
  };
} else {
  window.ondragstart = (e) => {
    dragstart(e);
  };

  window.ondragover = (e) => {
    dragover(e);
  };

  window.ondragend = (e) => {
    dragend(e);
  };
}
window.oncontextmenu = (e) => {
  e.preventDefault();
  let target = e.originalTarget || e.srcElement;
  if (target.classList[0] != "item") {
    return;
  }
  if (target.classList[1] == null) {
    return;
  }
  if (target.classList.contains("inactive")) {
    enable(target);
    target.classList.remove("inactive");
  } else {
    disable(target, false);
    target.classList.add("inactive");
  }
};

next.onclick = () => {
  if (gameOver) {
    return;
  }
  let colorsGot = [];
  let filleds = 0;
  let invalid = false;

  Array.from(rows[currentLine].children).forEach((item) => {
    if (
      item.classList.contains("item") &&
      item.classList[1] != null &&
      item.dataset.placed != null
    ) {
      let validColor = false;
      for (let i = 0; i < colorsGot.length; i++) {
        if (item.classList[1] == colorsGot[i]) {
          invalid = true;
          break;
        }
      }

      for (let i = 0; i < colors.length; i++) {
        if (item.classList[1] == colors[i]) {
          validColor = true;
          filleds++;
          colorsGot.push(item.classList[1]);
          break;
        }
      }
    }
  });

  if (invalid) {
    alert("Não pode haver cores duplicadas");
    return;
  }

  if (filleds < 4) {
    alert("Preencha todos os 4 slots");
    return;
  }

  let correctColors = [];
  let correctColorsAndPlace = [];

  for (let i = 0; i < 4; i++) {
    const placedColor = colorsGot[i];
    for (let j = 0; j < 4; j++) {
      const testPassWordColor = randomPassword[j];
      if (placedColor == testPassWordColor) {
        if (i == j) {
          correctColorsAndPlace.push(placedColor);
          break;
        }
        correctColors.push(placedColor);
        break;
      }
    }
  }

  let corrects = Array.from(rows[currentLine].children[0].children);
  let selectedWhite = 0;
  let selectedBlack = 0;

  for (let i = 0; i < corrects.length; i++) {
    const pin = corrects[i];
    if (selectedWhite == correctColors.length && selectedBlack < correctColorsAndPlace.length) {
      if (correctColorsAndPlace.length != 0) {
        pin.classList.add("black");
        selectedBlack++;
      }
    }
    if (correctColors.length != 0 && selectedWhite < correctColors.length) {
      pin.classList.add("white");
      selectedWhite++;
    }
  }

  if (correctColorsAndPlace.length == 4) {
    won = true;
    finishGame();

    rows.forEach((row) => {
      row.removeAttribute("data-selected");
    });

    delay = 0;
    for (let i = 0; i < rows.length; i++) {
      const row = Array.from(rows[i].children);
      for (let j = 0; j < row.length; j++) {
        const item = row[j];
        if (item.classList[0] == "corrects") {
          const pins = Array.from(item.children);
          for (let z = 0; z < pins.length; z++) {
            animate(pins[z], true);
          }
        } else {
          animate(item);
        }
      }
    }
    return;
  }

  for (let i = 0; i < corrects.length; i++) {
    const pin = corrects[i];
    if (pin.classList[1] != null) {
      pin.classList.add("willDropPin");
      setTimeout(() => {
        pin.classList.add("droppedPin");

        setTimeout(() => {
          pin.classList.remove("willDropPin");
          pin.classList.remove("droppedPin");
        }, 1000);
      }, 200 * i + 100);
    }
  }

  currentLine++;
  updateCurrentLine();

  if (currentLine == trys) {
    setTimeout(() => {
      won = false;
      finishGame();

      board.innerHTML += `
        <h2 id="correctPasswordH1">Correct:</h2>
        <div class="row toanimate" data-id="null">
          <div class="corrects">
            <div class="pin"></div>
            <div class="pin"></div>
            <div class="pin"></div>
            <div class="pin"></div>
          </div>
          <div class="item ${randomPassword[0]}" draggable="true"></div>
          <div class="item ${randomPassword[1]}" draggable="true"></div>
          <div class="item ${randomPassword[2]}" draggable="true"></div>
          <div class="item ${randomPassword[3]}" draggable="true"></div>
        </div>`;

      const correctPassword = Array.from(board.children)[board.children.length - 1];

      correctPassword.classList.remove("toanimate");
      correctPassword.classList.add("animate");
      setTimeout(() => {
        correctPassword.classList.remove("animate");
      }, 1000);
    }, 500);
  }
};

function dragstart(e) {
  let target = e.originalTarget || e.srcElement || e.target;
  if (target.classList[0] != "item" || target.classList[1] == null) {
    e.preventDefault();
    return;
  }
  body.style.overflow = "hidden";

  let bound = target.getBoundingClientRect();

  start = {
    x: bound.x - e.clientX,
    y: bound.y - e.clientY,
  };

  let color = target.dataset.color;

  previewDrag.classList = `item ${color}`;
  previewDrag.setAttribute("data-color", color);
  enable(previewDrag);

  dragging = true;
  target.classList.add("willDrag");

  setTimeout(() => {
    target.classList.add("dragging");
    target.classList.remove("willDrag");
  }, 1);
}

function dragover(e) {
  console.log("drag");
  let dropX = e.clientX;
  let dropY = e.clientY;

  let element = document.elementFromPoint(dropX, dropY);

  if (!element.classList.contains("item") || element.parentElement.dataset.id != currentLine) {
    previewDrag.style.left = `${dropX + start.x}px`;
    previewDrag.style.top = `${dropY + start.y}px`;
    savedDrop = null;
    return;
  }

  let bound = element.getBoundingClientRect();
  previewDrag.style.left = `${bound.x}px`;
  previewDrag.style.top = `${bound.y}px`;
  savedDrop = element;
}

function dragend(e) {
  body.style.overflow = "";
  let target = e.originalTarget || e.srcElement || e.target;
  if (target.classList[0] != "item" || target.classList[1] == null) {
    e.preventDefault();
    return;
  }

  let dropX = e.clientX;
  let dropY = e.clientY;
  let element = document.elementFromPoint(dropX, dropY);
  dragging = false;
  target.classList.remove("dragging");
  target.classList.remove("willDrag");

  x = -64;
  y = -64;
  previewDrag.style.left = "-100px";
  previewDrag.style.top = "-100px";
  disable(previewDrag);
  start = {
    x: -1,
    y: -1,
  };

  if (!element.classList.contains("item") || element.parentElement.dataset.id != currentLine) {
    if (savedDrop == null) {
      return;
    } else {
      element = savedDrop;
    }
  }

  let color = target.dataset.color;

  element.setAttribute("data-placed", "true");
  element.classList = `item ${color}`;
  element.classList.add("dropped");
  element.setAttribute("data-color", color);

  setTimeout(() => {
    element.classList.remove("dropped");
  }, 1000);
}

function finishGame() {
  gameOver = true;

  gameOverElement.setAttribute("data-won", won);
  if (won) {
    gameOverElement.children[0].innerText = "You won!";
  } else {
    gameOverElement.children[0].innerText = "You lost!";
  }

  enable(gameOverElement);
  setTimeout(() => {
    gameOverElement.classList.add("willDissapear");
    setTimeout(() => {
      disable(gameOverElement);
    }, 1000);
  }, 2000);
}
