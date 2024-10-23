function enable(element) {
  element.removeAttribute("aria-disabled");
  element.removeAttribute("disabled");
  element.style.display = "";
}

function disable(element, hide = true) {
  element.setAttribute("aria-disabled", "true");
  element.setAttribute("disabled", "true");
  if (hide) {
    element.style.display = "none";
  }
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
