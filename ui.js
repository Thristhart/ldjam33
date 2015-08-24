UI = {};

UI.setup = function() {
  document.getElementById("about").addEventListener("click", UI.toggleAbout);
  document.getElementById("soundToggle").addEventListener("click", UI.toggleSound);
  document.getElementById("aboutClose").addEventListener("click", UI.hideAbout);
  
  // Check for a bunch of HTML5 features we use in the game, alerting the user
  // if their browser isn't supported
  if (!Modernizr.audio.ogg ||
      !Modernizr.fontface ||
      !Modernizr.canvas ||
      !Modernizr.svg ||
      !Modernizr.borderradius ||
      !Modernizr.textshadow ||
      !Modernizr.opacity ||
      !Modernizr.cssgradients) {
    UI.toggleBox("browserAlert");
  }
}

UI.toggleBox = function(elementId) {
  var elementBox = document.getElementById(elementId);
  if (elementBox.style.display === 'none') {
    UI.showBox(elementId);
  } else {
    UI.hideBox(elementId);
  }
}

UI.showBox = function(elementId) {
  var elementBox = document.getElementById(elementId);
  if (element.style.display === 'none') {
  }
  elementBox.style.display = 'block';
  // Set the about box's width/height
  var canH = document.getElementById("gameContainer").getBoundingClientRect().height;
  var canW = document.getElementById("gameContainer").getBoundingClientRect().width;
  elementBox.style.top = (canH/10)*4 + "px";
  elementBox.style.left = (canW/4) + "px";
}

UI.hideBox = function(elementId) {
  element = document.getElementById(elementId)
  if (element.style.display !== 'none') {
    document.getElementById(elementId).style.display = 'none';
  }
}

UI.toggleAbout = function(event) {
  UI.toggleBox("aboutBox")

  // Cancel the default click event 
  event.preventDefault();
  return false;
}

UI.toggleSound = function(event) {
  if(Audio.enabled) {
    Audio.enabled = false;
    document.getElementById("soundToggle").innerHTML = "<i class='fa fa-volume-off fa-fw'></i>Sound: Disabled"
  }
  else {
    Audio.enabled = true;
    document.getElementById("soundToggle").innerHTML = "<i class='fa fa-volume-up fa-fw'></i>Sound: Enabled"
  }

  // Cancel the default click event 
  event.preventDefault();
  return false;
}
UI.hideAbout = function(event) {
  UI.hideBox("aboutBox")
  
  if (event) {
    // Cancel the default click event 
    event.preventDefault();
  }
  return false;
}