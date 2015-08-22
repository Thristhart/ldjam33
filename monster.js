var Monster = function() {
    this.x = Renderer.canvas.width / 2;
    this.y = Renderer.canvas.height / 2;
    this.radius = 100;
    this.direction = 1;
    this.touched = false;
    this.touchStart = 0;
};

Monster.prototype.draw = function(time) {
    Renderer.context.fillStyle = "cornflowerblue";
    Renderer.context.beginPath();
    Renderer.context.arc(this.x, this.y - this.radius, this.radius, 0, Math.PI * 2);
    Renderer.context.closePath();
    Renderer.context.fill();
}

Monster.prototype.think = function() {
    this.y += 10;
    
    if(this.y > Renderer.canvas.height - 30) {
        this.y = Renderer.canvas.height - 30;
    }
    
    this.x += 5 * this.direction;
    
    if(this.x - this.radius < 107) {
        this.x = 107 + this.radius;
        this.direction *= -1;
    }
    if(this.x + this.radius > 766) {
        this.x = 766 - this.radius;
        this.direction *= -1;
    }
    
    
};

Monster.prototype.touch = function() {
    if(!this.touched) {
        this.touched = true;
        this.touchStart = performance.now();
        
        var diffX = Game.handTargetX - this.x;
        var diffY = Game.handTargetY - this.y;
        if(diffX > 0) {
            this.direction = -1;
        }
        else {
            this.direction = 1;
        }
    }
};

Monster.prototype.endTouch = function() {
    this.touched = false;
}

Monster.prototype.intersects = function(x, y) {
    var diffX = this.x - x;
    var diffY = (this.y - 100) - y;
    
    var dist = Math.sqrt(diffX * diffX + diffY * diffY);
    
    return dist < 100;    
};