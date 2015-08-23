/* global Matter Monster Images Input Renderer Game */
var Food = function(x, y) {
    this.x = x;
    this.y = y;
    this.color = "pink";

    
    this.body = Matter.Bodies.circle(this.x, this.y, 30);
    Matter.World.add(Game.physicsEngine.world, [this.body]);
    
    Food.count++;
    var oldnum = Food.newnum;
    var colors = ["blue", "green", "pink", "white", "yellow"];
    while(Food.newnum === oldnum) {
        Food.newnum = Math.floor(Math.random()*colors.length);
    }
    this.color = colors[Food.newnum];
}


Food.prototype.draw = function() {
    Renderer.drawImageWithAngle(Images["food_" + this.color], this.x, this.y, 50, 50, this.body.angle);
};

Food.prototype.think = function() {
    this.x = this.body.position.x;
    this.y = this.body.position.y;
    
    var force = 1;
    if(this.y > Water.level) {
        if(Water.level - this.y) {
            force = 0.1;
        }
        Matter.Body.setVelocity(this.body, {x:0, y:-1});
    }
};

Food.prototype.destroy = function() {
    Matter.World.remove(Game.physicsEngine.world, [this.body]);
    Food.count--;
}


Food.count = 0;
Food.newnum = -1;