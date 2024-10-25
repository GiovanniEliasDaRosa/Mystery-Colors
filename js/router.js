const menu = document.querySelector("#menu");
const game = document.querySelector("#game");
let hash = "";

window.addEventListener(
  "hashchange",
  () => {
    updateScreen();
  },
  false
);

function updateScreen() {
  updates = 0;
  let loadedhash = window.location.hash;
  if (loadedhash == "" || loadedhash == "#") {
    goToMenu();
    return;
  }

  hash = loadedhash.replace("#", "");
  try {
    hash = decodeURI(hash);
  } catch (e) {
    goToMenu();
    return;
  }

  if (hash == "menu") {
    goToMenu();
  } else if (hash == "game") {
    disable(menu);
    enable(game);
    generateMap();
  } else {
    goToMenu();
    return;
  }
}

function goToMenu() {
  clearInterval(repeatStepInterval);
  disable(helpTutorial);

  enable(menu);
  disable(game);
  window.location.hash = "";
}

if (window.location.hash != "") {
  hash = window.location.hash.replace("#", "");
}

updateScreen();
