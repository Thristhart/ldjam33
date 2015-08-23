/* global Images Input Renderer Game */
var Monster = function() {
    this.x = Renderer.canvas.width / 2;
    this.y = Renderer.canvas.height / 2;
    this.radius = 75;
    this.direction = 1;
    this.touched = false;
    this.touchStart = 0;
    this.velocity = 0;
    this.animationFrame = 0;
    this.lastFrameTime = 0;
    this.state = "idle";
    
    this.food = 100;
    this.water = 100;
    this.health = 100;
    this.dead = false;
    
    this.idleStateChangeTime = 0;
    this.timeToNextIdleStateChange = 100;
};

Monster.prototype.draw = function(time) {
    Renderer.drawFrameFromImageWithFlip(Images["monster_" + this.state], 
        this.x - this.radius, 
        this.y - 100 * 2, 
        this.animationFrame, this.frameCount + 1, this.direction > 0);
};

Monster.prototype.think = function(time) {
    this.y += 10;
    
    if(this.y > Renderer.canvas.height - 30) {
        this.y = Renderer.canvas.height - 30;
    }
    
    this.x += this.velocity * this.direction;
    
    if(this.x - this.radius < 107) {
        this.x = 107 + this.radius;
        this.direction *= -1;
    }
    if(this.x + this.radius > 766) {
        this.x = 766 - this.radius;
        this.direction *= -1;
    }
    
    var timePerFrame = 300;
    
    var frameMax = 4;
    if(this.state == "happy" || this.state == "idle") {
        frameMax = 3;
    }
    
    if(this.state == "sad") {
        frameMax = 1;
    }
    if(this.state == "dead") {
        frameMax = 0;
    }
    
    this.frameCount = frameMax;
    
    
    var diff = time - this.lastFrameTime;
    if(diff > timePerFrame) {
        this.animationFrame++;
        if(this.animationFrame > this.frameCount) {
            this.animationFrame = 0;
        }
        this.lastFrameTime = time;
    }
    
    if(this.health<=0 && !this.dead)
    {
        this.die();
        this.dead = true;
    }
    
    if(this.health<100 && this.health>0)
    {
        Game.showHealth(true);
        this.state = "sad";
    }
    else
    {
        Game.showHealth(false);
    }
    
    if(this.state === "idle") {
        // randomly wander around
        
        if(time - this.idleStateChangeTime > this.timeToNextIdleStateChange) {
            this.idleStateChangeTime = time;
            this.timeToNextIdleStateChange = Math.round(Math.random() * 3000);
            if(Math.random() * 100 < 20) {
                this.direction *= -1;
            }
            if(Math.random() * 100 < 50) {
                this.velocity = 1;
            }
            else {
                this.velocity = 0;
            }
        }
    }
    else {
        this.velocity = 0;
    }
    
    if(this.food <= 0)
    {
        this.food = 0;
        this.health -= 0.06;
    }
    
    if(this.water <= 0)
    {
        this.water = 0;
        this.health -= 0.12;
    }
    
    if(this.food > 0 && this.water > 0)
    {
        this.health += 0.06;
        if(this.health>100) {
            this.health=100;
        }
    }
    
    
    this.food -= 0.002;
    this.water -= 0.008;
    Game.setFood(this.food);
    Game.setWater(this.water);
    Game.setHealth(this.health);
};

Monster.prototype.touch = function() {
    if(!this.touched) {
        this.touched = true;
        this.touchStart = performance.now();
        
    }
};

Monster.prototype.endTouch = function() {
    this.touched = false;
}

Monster.prototype.intersects = function(x, y) {
    var diffX = this.x - x;
    var diffY = (this.y - this.radius) - y;
    
    var dist = Math.sqrt(diffX * diffX + diffY * diffY);
    
    return dist < this.radius;
};

Monster.prototype.die = function() {
    var dieBox = document.getElementById("dieBox");
    var canH = document.getElementById("gameContainer").getBoundingClientRect().height;
    var canW = document.getElementById("gameContainer").getBoundingClientRect().width;
    dieBox.style.display = "block";
    dieBox.style.top = (canH/10)*4 + "px";
    dieBox.style.left = (canW/10)*4 + "px";
    
    this.state = "dead";
}