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
  
  if(Game.pokeDistance) {
    dist -= Game.pokeDistance;
  }
  
  var targetDiffX = Math.cos(Game.handAngle) * dist;
  var targetDiffY = Math.sin(Game.handAngle) * dist;
  
  
  Game.handX = Input.mouseX - targetDiffX;
  Game.handY = Input.mouseY - targetDiffY;
  
  if(Game.handX < 422) {
    Game.handX = 422;
  }
  if(Game.handX > 503) {
    Game.handX = 503;
  }
  
};

Game.onClickDown = function() {
  Renderer.tween(Game, "pokeDistance", 0, 100, 200, 10);
};
Game.onClickUp = function() {
  Renderer.tween(Game, "pokeDistance", Game.pokeDistance, 0, 200, 10);
};