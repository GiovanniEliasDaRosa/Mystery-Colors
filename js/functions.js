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

function animate(element, typePin = false) {
  element.classList.add("willDropPin");
  setTimeout(() => {
    if (typePin) {
      element.classList.add("droppedPin");
    } else {
      element.classList.add("dropped");
    }
    element.classList.remove("willDropPin");
    setTimeout(() => {
      if (typePin) {
        element.classList.remove("droppedPin");
      } else {
        element.classList.remove("dropped");
      }
    }, 1000);
  }, 10 * delay + 100);

  delay += delayIncrement;
  delayIncrement -= delayIncrement * 0.01;
}
