var star = (function(int, status){
    var canvas = null,
        context = null,
        width = null,
        height = null,
        retina = false;

    var radius = 13,
        numberOfPaticles = 5,
        angle = -1.58,
        counter = 0;

    var left1 = 2,
        left2 = 5,
        right1 = 31,
        right2 = 34,
        top1 = 31,
        top2 = 34,
        bottom1 = 2,
        bottom2 = 5;

    var colors = [
        {
            light : [229, 30, 37],
            dark : [181, 31, 36]
        },
        {
            light : [244, 115, 36],
            dark : [231, 95, 37]
        },
        {
            light : [252, 209, 22],
            dark : [229, 185, 33]
        },
        {
            light : [115, 179, 67],
            dark : [87, 132, 59]
        },
        {
            light : [34, 178, 76],
            dark : [12, 129, 64]
        },
        {
            light : [220, 220, 220],
            dark : [190, 190, 190]
        }
    ];

    var ratio = null;
    var particles = [];

    init(int, status);

    function init(int, status) {
        setEnviroment(int);
        createParticles();
        counter = status;
        clearCanvas();
    }

    function setEnviroment(int) {
        canvas = document.createElement("canvas");
        canvas.id = "star_" + int;
        document.getElementById('rating').appendChild(canvas);
        context = canvas.getContext('2d');
        retinaDimensions();
    }

    function retinaDimensions() {
        var devicePixelRatio = window.devicePixelRatio || 1,
            backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
        ratio = devicePixelRatio / backingStoreRatio;
        if (ratio > 1) {
            retina = true;
        }
        width = canvas.width = 35 * ratio;
        height = canvas.height = 35 * ratio;
        canvas.style.width = width / ratio + 'px';
        canvas.style.height = height / ratio + 'px';
        context.scale(ratio,ratio);
    }

    function createParticles() {
        particles = createParticlesArray(numberOfPaticles, width, height, radius, angle);
    }

    function clearCanvas() {
        context.clearRect(0, 0, width, height);
        render();
    }

    function render() {
        context.save();

        var gr = context.createLinearGradient(0, 0, 0, 35);
        gr.addColorStop(0,'rgb('+ colors[counter].light[0] +','+ colors[counter].light[1] +','+ colors[counter].light[2] +')');
        gr.addColorStop(1,'rgb('+ colors[counter].dark[0] +','+ colors[counter].dark[1] +','+ colors[counter].dark[2]  +')');

        context.beginPath();
        context.moveTo(left2, bottom1);
        context.lineTo(right1, bottom1);
        context.quadraticCurveTo(right1, bottom1, right2, bottom2);
        context.lineTo(right2, top1);
        context.quadraticCurveTo(right2, top1, right1, top2);
        context.lineTo(left2, top2);
        context.quadraticCurveTo(left2, top2, left1, top1);
        context.lineTo(left1, bottom2);
        context.quadraticCurveTo(left1, bottom2, left2, bottom1);
        context.fillStyle = gr;
        context.fill();

        context.beginPath();
        for (var i = 0; i < numberOfPaticles; i++) {
            context.moveTo(particles[i].x = coordX(particles[i]), particles[i].y = coordY(particles[i]));
            if (i === 4) {
                context.moveTo(particles[0].x, particles[0].y);
                context.lineTo(particles[2].x, particles[2].y);
                context.lineTo(particles[4].x, particles[4].y);
                context.lineTo(particles[1].x, particles[1].y);
                context.lineTo(particles[3].x, particles[3].y);
                context.lineTo(particles[0].x, particles[0].y);
            }
        }
        context.fillStyle = '#fff';
        context.fill();

        context.restore();
    }

    function coordX(particle) {
        return particle.x = adjustCoordX() + Math.cos(particle.angleStart) * radius;
    }
    function coordY(particle) {
        return particle.y = adjustCoordY() + Math.sin(particle.angleStart) * radius;
    }

    function adjustCoordX() {
        if (retina) {
            return (width + 2) / 4;
        } else {
            return width / 2;
        }
    }

    function adjustCoordY() {
        if (retina) {
            return (height + 2) / 4;
        } else {
            return height / 2;
        }
    }
});