/* global Matter Monster Images Input Renderer Game */
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
  Game.physicsEngine = Matter.Engine.create({});
  var ground = Matter.Bodies.rectangle(107 + 670 / 2, Renderer.canvas.height, 670, 100, {isStatic: true});
  var leftWall = Matter.Bodies.rectangle(77, Renderer.canvas.height / 2, 100, Renderer.canvas.height * 2, {isStatic: true});
  var rightWall = Matter.Bodies.rectangle(137 + 670, Renderer.canvas.height / 2, 100, Renderer.canvas.height * 2, {isStatic: true});
  
  var eggWall = Matter.Bodies.rectangle(687, 450, 100, 20, {isStatic: true, angle: -Math.PI / 4 - 0.4});
  var eggWallRight = Matter.Bodies.rectangle(712, 280, 10, 140, {isStatic: true});
  var eggWallLeft = Matter.Bodies.rectangle(630, 280, 10, 140, {isStatic: true});
  
  Matter.World.add(Game.physicsEngine.world, [ground, leftWall, rightWall, eggWall, eggWallLeft, eggWallRight]);
  
  Game.lastTime = performance.now();
};

Game.update = function(time) {
  var deltaTime = time - Game.lastTime;
  Game.lastTime = time;
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
  if(handTargetY > 553) {
    handTargetY = 553;
    touching = true;
  }
  
  var waterButtonX = 220;
  var waterButtonY = 386;
  
  var foodButtonX = 650;
  var foodButtonY = 403;
  
  var waterDiffX = waterButtonX - handTargetX;
  var waterDiffY = waterButtonY - handTargetY;
  
  var distFromWaterButton = Math.sqrt(waterDiffX * waterDiffX + waterDiffY * waterDiffY);
  
  var foodDiffX = foodButtonX - handTargetX;
  var foodDiffY = foodButtonY - handTargetY;
  
  var distFromFoodButton = Math.sqrt(foodDiffX * foodDiffX + foodDiffY * foodDiffY);
  
  var isAButtonPressed = false;
  if(distFromWaterButton < 32 || (Game.poking && Game.waterButtonDown)) {
    if(Game.poking) {
      if(!Game.waterButtonDown) {
        Audio["clunk-in"].play();
      }
      Game.waterButtonDown = true;
      handTargetX = waterButtonX;
      handTargetY = waterButtonY;
      touching = false;
      Audio["pour-con"].playOnce();
      isAButtonPressed = true;
    }
  }
  else if(distFromFoodButton < 32 || (Game.poking && Game.foodButtonDown)) {
    if(Game.poking) {
      if(!Game.foodButtonDown) {
        Audio["clunk-in"].play();
      }
      Game.foodButtonDown = true;
      handTargetX = foodButtonX;
      handTargetY = foodButtonY;
      touching = false;
      isAButtonPressed = true;
    }
  }
  if(!isAButtonPressed) {
    if(Game.foodButtonDown) {
      Audio["clunk-out"].play();
      if(Food.count < 40) {
        Game.entities.push(new Food(677, 250));
      }
    }
    if(Game.waterButtonDown) {
      Audio["clunk-out"].play();
      Audio["pour-con"].stop();
    }
    Game.waterButtonDown = false;
    Game.foodButtonDown = false;
  }
  
  Game.handTargetX = handTargetX;
  Game.handTargetY = handTargetY;
  
  Game.entities.forEach(function(ent) {
    if(ent.intersects) {
      if(ent.intersects(handTargetX, handTargetY)) {
        ent.touch();
      }
      else {
        ent.endTouch();
      }
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
  
  
  var closestWaterNode = Water.nearestNode(handTargetX, handTargetY);
  if(closestWaterNode && closestWaterNode.y <= handTargetY && handTargetY - Water.level < 40) {
    closestWaterNode.y = handTargetY;
    closestWaterNode.doNotUpdate = true;
  }
  var spoutX = 267;
  var spoutY = 110;
  if(Game.waterButtonDown) {
    var level = Water.getLevel();
    if(level < 420) {
      Water.setLevel(level + 0.3);
      if(level < 83) {
        var fillNode = Water.nearestNode(spoutX, level);
        fillNode.y = Renderer.canvas.height - spoutY;
        fillNode.x = spoutX;
        fillNode.doNotUpdate = true;
      }
    }
  }
  Water.update(time);
  
  Matter.Engine.update(Game.physicsEngine, 16.67);
};

Game.onClickDown = function() {
  Renderer.tween("Game", "pokeDistance", 0, 100, 200, 10);
  Game.poking = true;
};
Game.onClickUp = function() {
  Renderer.tween("Game", "pokeDistance", Game.pokeDistance, 0, 200, 10);
  Game.poking = false;
};

Game.setFood = function(newFood) {
  var state;
  if(newFood > 75) {
    state = "Full";
  }
  else if(newFood > 50) {
    state = "Peckish";
  }
  else if(newFood > 25) {
    state = "Hungry";
  }
  else {
    state = "Starving";
  }
  document.getElementById("foodLabel").innerHTML = state;
  document.getElementById("food").value = newFood;
};
Game.setWater = function(newWater) {
  var state;
  if(newWater > 75) {
    state = "Hydrated";
  }
  else if(newWater > 50) {
    state = "Parched";
  }
  else if(newWater > 25) {
    state = "Thirsty";
  }
  else {
    state = "Dehydrated";
  }
  document.getElementById("waterLabel").innerHTML = state;
  document.getElementById("water").value = newWater;
};
Game.setHealth = function(newHealth) {
  document.getElementById("health").value = newHealth;
};
Game.showHealth = function(show) {
  if(show===true) {
    document.getElementById("healthBox").style.display = "block";
    var canH = document.getElementById("gameContainer").getBoundingClientRect().height;
    var canW = document.getElementById("gameContainer").getBoundingClientRect().width;
    document.getElementById("healthBox").style.top = (canH/10)*4 + "px";
    document.getElementById("healthBox").style.left = (canW/4) + "px";
  }
  if(show===false) {
    document.getElementById("healthBox").style.display = "none";
  }
}