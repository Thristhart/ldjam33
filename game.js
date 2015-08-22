/* global Images Input Renderer Game */
var Game = {};

Game.entities = [];

Game.handX = 0;
Game.handY = 0;

Game.lastTargetX = 0;
Game.lastTargetY = 0;

Game.hasHovered = false;

Game.handAngle = 0;

Game.handDistance = 0;

Game.justTouchedJar = false;
Game.justStillOnJar = false;

Game.jarTouchTime = 0;
Game.jarStillTime = 0;

Game.setup = function() {
  Game.entities.push(new Monster());
};

Game.update = function(time) {
  Game.handX = Renderer.canvas.width / 2;
  Game.handY = 0;
  
  var handTargetX = Input.mouseX;
  var handTargetY = Input.mouseY;
  
  var angleOffset = 0;
  
  var diffX = Game.handX - handTargetX;
  var diffY = Game.handY - handTargetY;

  Game.handAngle = Math.PI + Math.atan2(diffY, diffX) + angleOffset;
  
  if(Game.pokeDistance) {
    handTargetX += Math.cos(Game.handAngle) * Game.pokeDistance;
    handTargetY += Math.sin(Game.handAngle) * Game.pokeDistance;
  }
  
  var touching = false;
  if(handTargetX < 107) {
    handTargetX = 107;
    touching = true;
  }
  if(handTargetX < 207) {
    angleOffset = (100 - (handTargetX - 107)) * (Math.PI / 1024);
  }
  if(handTargetX > 766) {
    handTargetX = 766;
    touching = true;
  }
  if(handTargetY > 573) {
    handTargetY = 573;
    touching = true;
  }
  
  Game.handTargetX = handTargetX;
  Game.handTargetY = handTargetY;
  
  Game.entities.forEach(function(ent) {
    if(ent.intersects(handTargetX, handTargetY)) {
      ent.touch();
    }
    else {
      ent.endTouch();
    }
  })
  
  
  if(touching && Game.hasHovered) {
    var stillOnJar = false;
    if((Game.lastTargetX != handTargetX || Game.lastTargetY != handTargetY)) {
      stillOnJar = false;
      Game.justStillOnJar = false;
    }
    else {
      stillOnJar = true;
      if(!Game.justStillOnJar) {
        Game.jarStillTime = time;
      }
      Game.justStillOnJar = true;
    }
    if(!Game.justTouchedJar) {
      Audio["glass-thud"].play();
      Game.jarTouchTime = time;
    }
    else {
      if(time - Game.jarTouchTime > 500 && !(stillOnJar && time - Game.jarStillTime > 200)) {
        Audio["glass-rub"].playOnce();
      }
      else {
        Audio["glass-rub"].stop();
      }
    }
    Game.justTouchedJar = true;
  }
  else {
    Game.justTouchedJar = false;
    Audio["glass-rub"].stop();
  }
  
  
  Game.handY = handTargetY - 500;
  

  diffX = Game.handX - handTargetX;
  diffY = Game.handY - handTargetY;

  Game.handAngle = Math.PI + Math.atan2(diffY, diffX) + angleOffset;
  
  var dist = Game.handDistance + Images["pointing-finger"].width;
  
  
  var targetDiffX = Math.cos(Game.handAngle) * dist;
  var targetDiffY = Math.sin(Game.handAngle) * dist;
  
  
  
  Game.handX = handTargetX - targetDiffX;
  Game.handY = handTargetY - targetDiffY;
  
  Game.lastTargetX = handTargetX;
  Game.lastTargetY = handTargetY;
};

Game.onClickDown = function() {
  Renderer.tween("Game", "pokeDistance", 0, 100, 200, 10);
};
Game.onClickUp = function() {
  Renderer.tween("Game", "pokeDistance", Game.pokeDistance, 0, 200, 10);
};