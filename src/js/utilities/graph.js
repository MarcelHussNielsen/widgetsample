var graph = (function (ratings) {
    var canvas = null,
        context = null,
        width = null,
        height = null,
        ratio = null,
        retina = false,
        center = 0,
        mousePoint = {
        x: 0,
        y: 0
        },
        hover = false,
        thisDataPoint = null,
        hoverRadius = 0,
        hoverStrokeWidth = 0;
    
    var particles = [];

    init(ratings);

    function init(ratings) {
        setEnviroment();
        clearCanvas();
        createParticles(ratings);
    }

    function setEnviroment() {
        canvas = document.createElement("canvas");
        canvas.id = "graph_canvas";
        document.getElementById('graph').appendChild(canvas);
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
        width = canvas.width = 290 * ratio;
        height = canvas.height = 100 * ratio;
        canvas.style.width = width / ratio + 'px';
        canvas.style.height = height / ratio + 'px';
        context.scale(ratio, ratio);
    }

    function createParticles(ratings) {
        var xPos =  20;
        for (var i = 0; i < ratings.length; i++) {
            xPos += 5;
            particles.push(particle.create(xPos, yMultiplier(ratings[i])));
            particles[i].rating = ratings[i];
        }
    }

    function yMultiplier(yPos) {
        if (retina) {
            center = height / 4;
        } else {
            center = height / 2;
        }
        switch (yPos) {
            case 0 :
                return center + 40;
                break;
            case 1 :
                return center + 20;
                break;
            case 2 :
                return center;
                break;
            case 3 :
                return center - 20;
                break;
            case 4 :
                return center - 40;
                break;
        }
    }

    document.body.addEventListener("mousemove", function(event) {
        mousePoint.x = event.clientX;
        mousePoint.y = event.clientY;
        var baseCoords = document.getElementById('graph_canvas');
        if (baseCoords) {
            baseCoords = baseCoords.getBoundingClientRect();
            checkForMouseContactWithCanvas(mousePoint, baseCoords);
        }
    });

    document.body.addEventListener('click', function(event){
        mousePoint.x = event.clientX;
        mousePoint.y = event.clientY;
        var baseCoords = document.getElementById('graph_canvas');
        if (baseCoords) {
            baseCoords = baseCoords.getBoundingClientRect();
            main.showReview(checkForMouseContactWithDatapoint(mousePoint, baseCoords));
        }

    });

    function checkForMouseContactWithCanvas(mousePoint, baseCoords) {
        if (mousePoint.x > baseCoords.left && mousePoint.x < baseCoords.right && mousePoint.y > baseCoords.top && mousePoint.y < baseCoords.bottom) {
            checkForMouseContactWithDatapoint(mousePoint, baseCoords);
        } else {

        }
    }

    function checkForMouseContactWithDatapoint(mousePoint, baseCoords) {
        var modifier = 6;
        for (var i = 0; i < particles.length; i++) {
            if (mousePoint.x > baseCoords.left + particles[i].x - modifier && mousePoint.x < baseCoords.left + particles[i].x + modifier && mousePoint.y > baseCoords.top + particles[i].y - modifier && mousePoint.y < baseCoords.top + particles[i].y + modifier) {
                hover = true;
                thisDataPoint = i;
                return i;

            } else {
                hover = false;
            }
        }
    }

    function clearCanvas() {
        context.clearRect(0, 0, width, height);
        render();
        requestAnimationFrame(clearCanvas);
    }
    function render() {

        context.save();

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(width, 0);
        context.lineTo(width, height);
        context.lineTo(0, height);
        context.lineTo(0, 0);
        context.fillStyle = '#ffffff';
        context.strokeStyle = '#000000';
        context.lineWidth = 0.5;
        context.fill();
        context.stroke();

        for (var i = 0; i < particles.length; i++) {
            var gradient = context.createLinearGradient(particles[i].x, particles[i].y, particles[previousParticle(i)].x, particles[previousParticle(i)].y);
            gradient.addColorStop(0,'rgb('+ getColor(particles[i]) +')');
            gradient.addColorStop(1,'rgb('+ getColor(particles[previousParticle(i)]) +')');

            if (hover) {
                if (thisDataPoint === i) {
                    context.beginPath();
                    context.moveTo(particles[i].x, particles[i].y);
                    context.arc(particles[i].x, particles[i].y, 5, Math.PI * 2, 0);
                    if (i === 0) {
                        context.strokeStyle = 'rgb('+ getColor(particles[i]) +')';
                    } else {
                        context.strokeStyle = gradient;
                    }
                    context.lineWidth = 5;
                    context.globalAlpha = 0.5;
                    context.stroke();
                }
            }

            context.globalAlpha = 1;
            context.beginPath();
            context.moveTo(particles[i].x, particles[i].y);
            context.lineTo(particles[previousParticle(i)].x, particles[previousParticle(i)].y);
            context.strokeStyle = gradient;
            context.lineWidth = 2.5;
            context.lineCap = 'round';
            context.stroke();
        }
        context.restore();
    }

    var speed = 0.5;
    function animateHoverRadius() {
        if (hoverRadius >= 5) {
            return hoverRadius;
        } else {
            return hoverRadius += speed;
        }
    }

    function animatHoverStroke() {
        if (hoverStrokeWidth >= 5) {
            return hoverStrokeWidth;
        } else {
            return hoverStrokeWidth += speed;
        }
    }

    function getColor(particle) {
        switch (particle.rating) {
            case 0 :
                    return '229, 30, 37';
                break;
            case 1 :
                    return '244, 115, 36';
                break;
            case 2 :
                    return '252, 209, 22';
                break;
            case 3 :
                    return '115, 179, 67';
                break;
            case 4 :
                    return '34, 178, 76';
                break;
        }
    }

    function previousParticle(i) {
        if (i > 0) {
            return i - 1;
        }
        return i;
    }

});