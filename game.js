/* global Images Input Renderer Game */
var Game = {};

Game.handX = 0;
Game.handY = 0;

Game.handAngle = 0;

Game.handDistance = 0;

Game.setup = function() {
};

Game.update = function(time) {
  Game.handX = Renderer.canvas.width / 2;
  Game.handY = 0;
  
  Game.handY = Input.mouseY - 500;

  var diffX = Game.handX - Input.mouseX;
  var diffY = Game.handY - Input.mouseY;

  Game.handAngle = Math.PI + Math.atan2(diffY, diffX);
  
  var dist = Game.handDistance + Images["pointing-finger"].width;
  
  if(Input.mouseDown) {
    dist -= 100;
  }
  
  var targetDiffX = Math.cos(Game.handAngle) * dist;
  var targetDiffY = Math.sin(Game.handAngle) * dist;
  
  
  Game.handX = Input.mouseX - targetDiffX;
  Game.handY = Input.mouseY - targetDiffY;
  
};

Game.onClickDown = function() {
  
};
Game.onClickUp = function() {
};