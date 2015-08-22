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
}

Renderer.draw = function(time) {
    if(!time) {
        time = window.performance.now();
    }
    
    Game.update(time);
    
    var context = Renderer.context;
    
    context.clearRect(0, 0, Renderer.canvas.width, Renderer.canvas.height);
    
    Renderer.drawImageWithAngle(Images["pointing-finger"], 
        Game.handX, Game.handY,
        -5, 40,
        Game.handAngle);
        
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