var Input = {};

Input.mouseX = 0;
Input.mouseY = 0;

Input.mouseDown = false;

Input.setup = function() {
  Renderer.canvas.addEventListener("mousemove", Input.onMouseMove);
  Renderer.canvas.addEventListener("mousedown", Input.onClickDown);
  Renderer.canvas.addEventListener("mouseup",   Input.onClickUp);
  document.getElementById("restart").addEventListener("click", Input.onClickRestart)
  document.getElementById("nameBox").addEventListener("change", Input.onNameChange)
};

Input.onMouseMove = function(event) {
  Game.hasHovered = true;
  var target = event.target || e.srcElement,
      rect = target.getBoundingClientRect(),
      offsetX = event.clientX - rect.left,
      offsetY = event.clientY - rect.top;
      
  // The mouse position as if the canvas was 900 x 600
  Input.mouseX = Math.round((offsetX / rect.width) * Renderer.canvas.width);
  Input.mouseY = Math.round((offsetY / rect.height) * Renderer.canvas.height);
};

Input.onClickDown = function(event) {
  Input.mouseDown = true;
  UI.hideAbout();
  Game.onClickDown();
};

Input.onClickUp = function(event) {
  Input.mouseDown = false;
  Game.onClickUp();
};

Input.onClickRestart = function(event) {
  location.reload();
}

Input.onNameChange = function(event) {
  Game.entities[0].name = event.target.value;
}