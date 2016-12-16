var graph = (function (ratings) {
    var canvas = null,
        context = null,
        width = null,
        height = null,
        ratio = null;
    
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
        width = canvas.width = 273 * ratio;
        height = canvas.height = 180 * ratio;
        canvas.style.width = width / ratio + 'px';
        canvas.style.height = height / ratio + 'px';
    }

    function createParticles(ratings) {

        for (var i = 0; i < ratings.length; i++) {
            particles.push(particle.create(0, 0));
        }
        console.log(particles);
    }
    
    function clearCanvas() {
        context.clearRect(0, 0, width, height);
        render();
        requestAnimationFrame(clearCanvas);
    }

    function render() {
        context.save();

        for (var i = 0; i < particles.length; i++) {
            context.beginPath();
            context.arc(moveDataPoint(), height / 2, 2, Math.PI * 2, 0);
            context.fillStyle = '#000';
            context.fill();


        }

        context.restore();
    }
    var xOffset = 0;
    function moveDataPoint() {
        return xOffset += 4;
    }
});