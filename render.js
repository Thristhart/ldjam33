/* global Images Input Renderer Game */
var Renderer = {};

var Images = {};



Renderer.setup = function() {
    Renderer.canvas = document.getElementById("display");
    Renderer.context = Renderer.canvas.getContext("2d");
    
    Renderer.loadImages();
};

Renderer.loadImages = function() {
    var imageElements = [].slice.apply(document.querySelectorAll("#images img"));
    imageElements.forEach(function(image) {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext("2d").drawImage(image, 0, 0);
        Images[image.id] = canvas;
    })
};

Renderer.tweenList = {};

Renderer.tween = function(objectName, key, from, to, duration, interval) {
    // pure evil
    var object = eval(objectName);
    interval = interval || 100;
    var current = 0;
    object[key] = from;
    Renderer.tweenList[objectName] = Renderer.tweenList[objectName] || {};
    if(Renderer.tweenList[objectName][key]) {
        clearInterval(Renderer.tweenList[objectName][key]);
        delete Renderer.tweenList[objectName][key];
    }
    var intervalID = setInterval(function() {
        var diff = (to - from) * (current / duration);
        object[key] = from + diff;
        if(current >= duration) {
            object[key] = to;
            clearInterval(intervalID);
        }
        current += interval;
    }, interval);
    Renderer.tweenList[objectName][key] = intervalID;
};

Renderer.draw = function(time) {
    if(!time) {
        time = window.performance.now();
    }
    
    Game.update(time);
    
    var context = Renderer.context;
    
    context.clearRect(0, 0, Renderer.canvas.width, Renderer.canvas.height);
    context.drawImage(Images["jar_back"], 0, 0);
    
    Game.entities.forEach(function(entity, index) {
        if(index == 0) {
            return;
        }
        entity.think(time);
        entity.draw(time);
    });
    
    context.drawImage(Images["water_dispenser"], 0, 0);
    context.drawImage(Images["feeder"], 0, 0);
    
    Game.entities[0].think(time);
    Game.entities[0].draw(time);
    
    Renderer.drawImageWithAngle(Images["pointing-finger"], 
        Game.handX, Game.handY,
        -3, 20,
        Game.handAngle);
        
    
    Water.draw();
    
    context.drawImage(Images["jar"], 0, 0);
    
    window.requestAnimationFrame(Renderer.draw);
}

Renderer.drawImageWithAngle = function(image, x, y, centerX, centerY, angle) {
    Renderer.context.translate(x, y);
    Renderer.context.rotate(angle);
    Renderer.context.drawImage(image, -centerX, -centerY);
    Renderer.context.rotate(-angle);
    Renderer.context.translate(-x, -y);
}

Renderer.drawFrameFromImage = function(image, x, y, frameNum, totalFrames) {
    var frameWidth = image.width / totalFrames;
    var frameX = frameWidth * frameNum;
    Renderer.context.drawImage(image, frameX, 0, frameWidth, image.height, x, y, frameWidth, image.height);
};

Renderer.drawFrameFromImageWithFlip = function(image, x, y, frameNum, totalFrames, flip) {
    var frameWidth = image.width / totalFrames;
    var frameX = frameWidth * frameNum;
    
    var scale = 1;
    if(flip) {
        scale = -1;
        x += frameWidth;
    }
    Renderer.context.translate(x, y);
    Renderer.context.scale(scale, 1);
    
    Renderer.context.drawImage(image, frameX, 0, frameWidth, image.height, 0, 0, frameWidth, image.height);
    Renderer.context.scale(scale, 1);
    Renderer.context.translate(-x, -y);
};