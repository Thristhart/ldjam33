function onReady() {
  Renderer.setup();
  Input.setup();
  Audio.loadAudio();
  Game.setup();
  Water.setup();
  
  Renderer.draw();
}


window.addEventListener("load", onReady)