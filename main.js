function onReady() {
  UI.setup();
  Renderer.setup();
  Input.setup();
  Audio.loadAudio();
  Game.setup();
  Water.setup();
  
  Renderer.draw();
}

window.addEventListener("load", onReady)