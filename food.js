/* global Matter Monster Images Input Renderer Game Water */
var Food = function(x, y) {
    this.x = x;
    this.y = y;
    this.color = "pink";

    
    this.body = Matter.Bodies.circle(this.x, this.y, 20);
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
    var y = this.y;
    if(Math.abs(y - Water.level) < 2 && Math.abs(this.lastY - this.y) < 2) {
        y = this.lastY;
    }
    Renderer.drawImageWithAngle(Images["food_" + this.color], this.x, y, 30, 30, this.body.angle);
    this.lastY = y;
};

Food.prototype.think = function() {
    this.x = Math.round(this.body.position.x);
    this.y = Math.round(this.body.position.y);
    
    var nearest =  Water.nearestNode(this.x, this.y);
    if(this.y > nearest.y) {
        Matter.Body.setVelocity(this.body, {x:this.body.velocity.x, y:-0.7});
    }
};

Food.prototype.destroy = function() {
    Matter.World.remove(Game.physicsEngine.world, [this.body]);
    Game.entities.splice(Game.entities.indexOf(this), 1);
    Food.count--;
}


Food.count = 0;
Food.newnum = -1;