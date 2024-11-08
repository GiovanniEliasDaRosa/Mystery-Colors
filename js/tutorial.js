const helpTutorial = document.querySelector("#helpTutorial");
const tutorial = document.querySelector("#tutorial");
const tutorial__title = document.querySelector("#tutorial__title");
const tutorial__description = document.querySelector("#tutorial__description");
let fontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);

let steps = [];
let currentStep = 0;
let repeatStepInterval = "";
let animationTimeout = "";

let sawTutorial = false;
let savedLocalStorageTutorial = localStorage.getItem("sawTutorial");
if (savedLocalStorageTutorial != null && savedLocalStorageTutorial == "true") {
  sawTutorial = true;
}

function startTutorial() {
  enable(tutorial);
  enable(helpTutorial);
  randomPassword = ["red", "yellow", "pink", "green"];

  steps = [
    {
      title: "Drag and drop",
      description: "Click on the item and drag it to the board",
      inicial: select.children[0],
      final: rows[0].children[1],
      hands: ["hand-pointer", "grab", "hand"],
    },
    {
      title: "Drag and drop",
      description: "Click on the item and drag it to the board",
      inicial: select.children[1],
      final: rows[0].children[2],
      hands: ["hand-pointer", "grab", "hand"],
    },
    {
      title: "Drag and drop",
      description: "Click on the item and drag it to the board",
      inicial: select.children[2],
      final: rows[0].children[3],
      hands: ["hand-pointer", "grab", "hand"],
    },
    {
      title: "Drag and drop",
      description: "Click on the item and drag it to the board",
      inicial: select.children[3],
      final: rows[0].children[4],
      hands: ["hand-pointer", "grab", "hand"],
    },
    {
      title: "Send",
      description: "Click on next to see what how was you guess",
      inicial: next,
      final: next,
      hands: ["hand-pointer", "hand-pointer", "hand-pointer"],
    },
    {
      title: "Verify",
      description: `<strong>White</strong>: Some color is
<strong>correct but in the wrong place</strong>.<br />
<strong>Black</strong>: Some color is
<strong>correct and in the right place</strong>.<br />
<strong>Empty</strong>: Some color is <strong>not in the password</strong>.`,
      inicial: rows[0].children[0],
      final: rows[0].children[0],
      hands: ["", "", ""],
    },
  ];

  seeTutorial();
}

function seeTutorial() {
  clearInterval(repeatStepInterval);
  clearTimeout(animationTimeout);

  tutorial__title.innerHTML = "";
  tutorial__description.innerHTML = "";

  let current = steps[currentStep];
  animateStep(current);

  repeatStepInterval = setInterval(() => {
    animateStep(current);
  }, 3500);
}

function animateStep(current) {
  let hands = current.hands;
  tutorial__title.innerHTML = current.title;
  tutorial__description.innerHTML = current.description;

  let inicial = current.inicial.getBoundingClientRect();
  let pos = {
    x: inicial.x + fontSize,
    y: inicial.y + fontSize,
  };
  helpTutorial.style.left = `${pos.x}px`;
  helpTutorial.style.top = `${pos.y + window.scrollY}px`;
  helpTutorial.style.transition = "0.1s ease-out";
  helpTutorial.style.transform = `scale(1)`;
  helpTutorial.setAttribute("data-current-icon", hands[0]);

  animationTimeout = setTimeout(() => {
    helpTutorial.style.transition = "1s ease-out";
    helpTutorial.style.transform = `scale(0.8)`;
  }, 10);

  animationTimeout = setTimeout(() => {
    let final = current.final.getBoundingClientRect();
    pos = {
      x: final.x + fontSize,
      y: final.y + fontSize,
    };
    helpTutorial.style.left = `${pos.x}px`;
    helpTutorial.style.top = `${pos.y + window.scrollY}px`;
    helpTutorial.setAttribute("data-current-icon", hands[1]);

    animationTimeout = setTimeout(() => {
      helpTutorial.style.transform = `scale(1)`;
      helpTutorial.setAttribute("data-current-icon", hands[2]);

      animationTimeout = setTimeout(() => {
        verify(current);
      }, 2500);
    }, 1000);
  }, 1000);
}

function verify(current) {
  console.log(currentStep);
  if (currentStep < 4) {
    if (current.final.dataset.placed != null) {
      console.log("NEXT", currentStep);
      nextTutorialStep();
    }
  } else if (currentStep == 4) {
    console.log("1 near step");
    if (currentLine > 0) {
      nextTutorialStep();
    }
  } else if (currentStep == steps.length - 1) {
    console.warn("you've concluded the tutorial!");
    setTimeout(() => {
      clearInterval(repeatStepInterval);
      clearTimeout(animationTimeout);
      disable(helpTutorial);
    }, 500);
    sawTutorial = true;
    localStorage.setItem("sawTutorial", true);
    return;
  }
}

function nextTutorialStep() {
  currentStep++;
  seeTutorial();
}
