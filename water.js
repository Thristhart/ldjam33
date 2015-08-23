var Water = {};

Water.nodes = [];

Water.NODECOUNT = 40;
Water.WIDTH = 690;

Water.setup = function() {
    Water.level = Renderer.canvas.height - 100;
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
Water.propagationFactor = 0.6;
Water.attenuationFactor = 0.5;

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
        
        node.vx += (node.startX - node.x);
        node.vy += (Water.level - node.y) / 20;
        
        node.x += node.vx;
        node.y += node.vy;
    });
};

Water.nearestNode = function(x, y) {
  return Water.nodes[Math.round((x - 107) / Water.WIDTH * Water.NODECOUNT)];
};

Water.draw = function() {
    Renderer.context.fillStyle = "blue";
    Water.nodes.forEach(function(node, index) {
       Renderer.context.fillRect(node.x, node.y - 5, 10, 10); 
    });
};