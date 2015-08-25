/* global Images Input Renderer Game Water */
var Monster = function() {
    this.x = Renderer.canvas.width / 2;
    this.y = Renderer.canvas.height / 2 + 200;
    this.radius = 75;
    this.direction = 1;
    this.touched = false;
    this.touchStart = 0;
    this.velocity = 0;
    this.animationFrame = 0;
    this.lastFrameTime = 0;
    this.state = "idle";
    this.framesInCurrentState = 0;
    this.lastFrameState = "idle";
    
    this.food = 100;
    this.water = 100;
    this.health = 100;
    this.dead = false;
    
    this.drinkPerFrame = 0.1;
    this.drinkHeight = 75;
    
    this.idleStateChangeTime = 0;
    this.timeToNextIdleStateChange = 100;
    this.lastWhineTime = 0;
    this.whineInterval = 0;
    this.name = "small blob friend";
    
    this.bubble = false;
    this.bubbleFrame = 0;
};

Monster.prototype.draw = function(time) {
    var animation = this.state;
    if(this.state === "drinking" || this.state === "eating") {
        animation = "bend";
        if(this.framesInCurrentState > 2) {
            animation = "eating";
            this.frameCount = 1;
        }
        this.radius = 150;
    }
    else if(this.state == "bend") {
        if(this.framesInCurrentState > 2) {
            this.animationFrame = 0;
            this.frameCount = 0;
            animation = "sad_bend";
        }
    }
    else if(this.state === "wantfood") {
        if(this.foodOutofReach) {
            animation = "sad";
            this.frameCount = 1;
        }
        else {
            animation = "idle";
        }
    }
    else {
        this.radius = 100;
    }
    if(animation === "sad_bend" || animation === "sad") {
        if(time - this.lastWhineTime > this.whineInterval) {
            Audio["monster_thirsty"].playOnce();
            this.whineInterval = 3200 + Math.random() * 1200;
            this.lastWhineTime = time;
        }
    }
    if(this.animationFrame > this.frameCount) {
        this.animationFrame = 0;
    }
    Renderer.drawFrameFromImageWithFlip(Images["monster_" + animation], 
        this.x - this.radius, 
        this.y - 100 * 2, 
        this.animationFrame, this.frameCount + 1, this.direction > 0);
        
    
    if(this.bubble) {
        var modifier = Math.sin(time/200) * 20;
        Renderer.drawFrameFromImage(Images["bubbles"],
            this.bubbleX + modifier,
            this.bubbleY - 35,
            this.bubbleFrame,
            2
        );
    }
};

Monster.prototype.think = function(time) {
    this.updateAnimation(time);
    
    if(this.bubble) {
        this.bubbleY -= 0.8;
        if(this.bubbleY < Water.level) {
            this.bubble = false;
        }
        this.health -= 0.06;
    }
    
    if(this.state === "dead") {
        return;
    }
    this.y += 10;
    
    if(this.y > Renderer.canvas.height - 20) {
        this.y = Renderer.canvas.height - 20;
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
    
    if(this.state === "happy") {
        if(this.framesInCurrentState > 3) {
            this.state = "idle";
        }
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
    else if(this.state === "wantfood") {
        var foodTarget = Game.entities[1];
        var distX = foodTarget.x - this.x;
        var distY = foodTarget.y - (this.y - this.radius + 20);
        var distance = Math.sqrt(distX * distX + distY * distY);
        if(distance < 50) {
            this.state = "eating";
            this.framesInCurrentState = 0;
            this.animationFrame = 0;
        }
        else {
            if(Math.abs(distX) < 10) {
                this.foodOutofReach = true;
            }
            else {
                this.foodOutofReach = false;
                if(distX < 0) {
                    this.direction = -1;
                }
                else {
                    this.direction = 1;
                }
                this.velocity = 1;
            }
        }
    }
    else {
        this.velocity = 0;
    }
    
    if(this.state === "drinking") {
        if(this.framesInCurrentState > 2) {
            this.drink();
        }
        if(this.water >= 100 || Water.getLevel() < this.drinkHeight) {
            this.state = "idle";
        }
    }
    else if(this.water < 95) {
        if(Water.getLevel() > this.drinkHeight) {
            this.state = "drinking";
        }
        else {
            if(this.state != "sad" && Water.getLevel() > 0 && this.water < 50) {
                this.state = "bend";
            }
        }
    }
    else {
        if(this.state === "eating") {
            Game.entities[1].body.velocity.x = 0;
            Game.entities[1].body.angularVelocity = 0;
            if(this.framesInCurrentState > 8) {
                this.eat();
            }
            if(this.food >= 100 || Food.count === 0) {
                this.state = "idle";
            }
        }
        else if(this.food < 75 && Food.count > 0) {
            this.state = "wantfood";
        }
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
    
    if(this.food > 0 && this.water > 0 && !this.bubble)
    {
        this.health += 0.06;
        if(this.health>100) {
            this.health=100;
        }
    }
    
    if(this.health<=0 && !this.dead)
    {
        this.die();
        this.dead = true;
    }
    
    if(this.health<100 && this.health>0 && !(this.state === "drinking" || this.state === "eating"))
    {
        this.state = "sad";
    }
    
    
    
    if(this.health < 100) {
        UI.showBox("healthBox");
    }
    else {
        if(this.state === "sad") {
            this.state = "idle";
        }
        UI.hideBox("healthBox");
    }
    if(Water.getLevel() >= 190 && this.state != "dead" && this.state != "drinking") {
        if(!this.bubble) {
            this.bubble = true;
            this.bubbleX = this.x - (this.direction < 0 ? 90 : 0);
            this.bubbleY = this.y - 190;
        }
        this.state = "sad";
    }
    
    
    this.food -= 0.004;
    this.water -= 0.008;
    Game.setFood(this.food);
    Game.setWater(this.water);
    Game.setHealth(this.health);
    
    this.lastFrameState = this.state;
};

Monster.prototype.updateAnimation = function(time) {
    var timePerFrame = 600;
    
    var frameMax = 3;
    if(this.state == "happy" || this.state == "idle" ) {
        frameMax = 3;
    }
    if(this.state == "drinking" || this.state == "eating" || this.state == "bend") {
        frameMax = 3;
        timePerFrame = 200;
    }
    if(this.state == "sad") {
        frameMax = 1;
    }
    if(this.state == "dead") {
        frameMax = 0;
    }
    
    this.frameCount = frameMax;
    
    if(this.lastFrameState != this.state) {
        this.framesInCurrentState = 0;
        this.animationFrame = 0;
    }
    
    var diff = time - this.lastFrameTime;
    if(diff > timePerFrame) {
        this.animationFrame++;
        this.framesInCurrentState++;
        this.lastFrameTime = time;
    }
};

Monster.prototype.touch = function() {
    if(Game.poking) {
        if(!this.poked && !this.state === "dead") {
            this.poked = true;
            this.touchStart = performance.now();
            console.log("touched", Game.poking);
            var pokeSound = this.lastPokeSound;
            while(pokeSound == this.lastPokeSound) {
                pokeSound = "monster_poke_" + Math.ceil(Math.random() * 3);
            }
            Audio[pokeSound].play();
            this.lastPokeSound = pokeSound;
            if(this.state != "drinking" && this.state != "eating") {
                this.state = "happy";
            }
        }
    }
};

Monster.prototype.endTouch = function() {
    this.poked = false;
}

Monster.prototype.intersects = function(x, y) {
    var diffX = this.x - x;
    var diffY = (this.y - (this.radius - 20)) - y;
    
    var dist = Math.sqrt(diffX * diffX + diffY * diffY);
    
    return dist < this.radius;
};

Monster.prototype.die = function() {
    localStorage.setItem("monster_name", this.name);
    document.getElementById("dieLabel").innerHTML = "You let " + this.name + " die! :( Are you the monster?";
    UI.showBox("dieBox");
    this.state = "dead";
}

Monster.prototype.drink = function() {
    Water.setLevel(Water.getLevel() - this.drinkPerFrame);
    this.water += this.drinkPerFrame;
    Audio["monster_drink"].playOnce();
};

Monster.prototype.eat = function() {
    Game.entities[1].destroy();
    this.food += 25;
    Audio["monster_eat"].playOnce();
};