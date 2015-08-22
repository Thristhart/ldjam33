var Game = {};

Game.handX = 0;
Game.handY = 0;

Game.handAngle = 0;

Game.setup = function() {
};

Game.update = function(time) {
  Game.handX = Renderer.canvas.width / 2;
  Game.handY = 0;

  var diffX = Game.handX - Input.mouseX;
  var diffY = Game.handY - Input.mouseY;

  Game.handAngle = Math.atan2(diffY, diffX);
};
