/* global Images Input Renderer Game */
var Water = {};

Water.nodes = [];

Water.NODECOUNT = 40;
Water.WIDTH = 690;

Water.setup = function() {
    Water.setLevel(0);
    for(var i = 0; i < Water.NODECOUNT; i++) {
        var startX = (Water.WIDTH / Water.NODECOUNT) * i + 107;
        Water.nodes[i] = {
            x: startX, y: Water.level,
            vx: 0, vy: 0,
            startX: startX,
            doNotUpdate: false
        };
    }
};
Water.propagationFactor = 0.7;
Water.attenuationFactor = 0.5;

Water.setLevel = function(newLevel) {
    var base = Renderer.canvas.height - 30;
    return Water.level = base - newLevel;
};
Water.getLevel = function() {
    var base = Renderer.canvas.height - 30;
    return -(Water.level - base);
};

Water.update = function(time) {
    Water.nodes.forEach(function(node, index) {
        if(node.doNotUpdate) {
            node.doNotUpdate = false;
            node.vx = 0;
            node.vy = 0;
            return;
        }
        var prev = Water.nodes[index - 1] || node;
        var next = Water.nodes[index + 1] || node;
        var dx = (prev.x + next.x) - 2 * node.x;
        var dy = (prev.y + next.y) - 2 * node.y;
        
        dx *= Water.propagationFactor;
        dy *= Water.propagationFactor;
        
        node.vx += dx;
        node.vy += dy;
        
        node.vx *= Water.attenuationFactor;
        node.vy *= Water.attenuationFactor;
        
        node.vx += (node.startX - node.x) / 2;
        node.vy += (Water.level - node.y) / 25;
        
        node.x += node.vx;
        node.y += node.vy;
    });
};

Water.nearestNode = function(x, y) {
  return Water.nodes[Math.round((x - 107) / Water.WIDTH * Water.NODECOUNT)];
};

Water.draw = function() {
    if(Water.getLevel() < 1) {
        return;
    }
    var bottomHeight = 33;
    var gradient = Renderer.context.createLinearGradient(107 + Water.WIDTH / 2, Water.level, 107 + Water.WIDTH / 2, Renderer.canvas.height);
    
    gradient.addColorStop(0, 'rgba(0, 97, 255, 1.000)');
    gradient.addColorStop(1, 'rgba(0, 174, 255, 0.349)');
    Renderer.context.fillStyle = gradient;
    Renderer.context.beginPath();
    Renderer.context.moveTo(107, Renderer.canvas.height - bottomHeight);
    Renderer.context.lineTo(107, Water.nodes[0].y);
    Water.nodes.forEach(function(node, index) {
       Renderer.context.lineTo(node.x, node.y);
    });
    Renderer.context.lineTo(107 + Water.WIDTH - 16, Water.nodes[Water.nodes.length - 1].y);
    Renderer.context.lineTo(107 + Water.WIDTH - 16, Renderer.canvas.height - bottomHeight);
    Renderer.context.arc(107 + Water.WIDTH - 30, Renderer.canvas.height - bottomHeight + 3, 10, 0, Math.PI/2);
    Renderer.context.arc(107 + 15, Renderer.canvas.height - bottomHeight + 3, 10, Math.PI/2, Math.PI);
    Renderer.context.closePath();
    Renderer.context.fill();
    
};
