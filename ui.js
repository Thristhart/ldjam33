UI = {}

UI.setup = function() {
  document.getElementById("about").addEventListener("click", UI.toggleAbout);
  document.getElementById("aboutClose").addEventListener("click", UI.hideAbout);
}

UI.toggleAbout = function(event) {
  console.log("toggling about box");
  var aboutBox = document.getElementById("aboutBox");
  aboutBox.style.display = (aboutBox.style.display == 'none' ? 'block' : 'none');
  
  // Set the about box's width/height
  var canH = document.getElementById("gameContainer").getBoundingClientRect().height;
  var canW = document.getElementById("gameContainer").getBoundingClientRect().width;
  document.getElementById("aboutBox").style.top = (canH/10)*4 + "px";
  document.getElementById("aboutBox").style.left = (canW/4) + "px";

  // Cancel the default click event 
  event.preventDefault();
  return false;
}

UI.hideAbout = function(event) {
  document.getElementById("aboutBox").style.display = 'none';
  if (event) {
    // Cancel the default click event 
    event.preventDefault();
  }
  return false;
}