function onReady() {
  UI.setup();
  Renderer.setup();
  Input.setup();
  Audio.loadAudio();
  Game.setup();
  Water.setup();
  
  Renderer.draw();
  
  var lastPetName = localStorage.getItem("monster_name");
  if(lastPetName) {
    document.getElementById("gravestone").display = "block";
    document.getElementById("deadMonster").innerHTML = lastPetName;
  }
}

window.addEventListener("load", onReady)