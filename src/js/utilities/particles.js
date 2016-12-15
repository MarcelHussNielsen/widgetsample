var particle = {
    x: 0,
    y: 0,

    create: function(x, y) {
        var obj = Object.create(this);
        obj.x = x;
        obj.y = y;
        return obj;
    }
};

function createParticlesArray(amount, width, height, arcRadius, customAngle){
    var angle =  customAngle ? customAngle : 0;
    var particles = [];
    for (var i = 0; i < amount; i++) {
        var myParticle = particle.create(width / 2 + Math.cos(angle) * arcRadius, height / 2 + Math.sin(angle) * arcRadius, 0, 0, 0);
        myParticle.angleStart = angle;
        angle += Math.PI / (amount / 2);
        myParticle.angleStop = angle;
        myParticle.arcX = myParticle.x;
        myParticle.arcY = myParticle.y;
        particles.push(myParticle);
    }
    return particles;
}


