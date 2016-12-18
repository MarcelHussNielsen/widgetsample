var arrows = (function(dataPoints){
    var canvas = null,
        context = null,
        width = null,
        height = null,
        ratio = null,
        mousePoint = {
            x: 0,
            y: 0
        },
        strokewidth = 2,
        hover = false,
        speed = 0.1,
        direction = 'up',
        expanded = false,
        wing = 9,
        center = 12,
        retina = false;

    init();

    function init() {
        setEnviroment();
        clearCanvas();
    }

    function setEnviroment() {
        canvas = document.createElement("canvas");
        canvas.id = "slide-arrow";
        document.getElementById('slide-arrow-container').appendChild(canvas);
        context = canvas.getContext('2d');
        retinaDimensions();
    }

    function retinaDimensions() {
        var devicePixelRatio = window.devicePixelRatio || 1,
            backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
        ratio = devicePixelRatio / backingStoreRatio;
        if (ratio > 1) {
            retina = true;
            addRetinaClass();
        }
        width = canvas.width = 20 * ratio;
        height = canvas.height = 20 * ratio;
        canvas.style.width = width / ratio + 'px';
        canvas.style.height = height / ratio + 'px';
        context.scale(ratio, ratio);
    }

    function addRetinaClass () {
        var arrow = document.getElementsByClassName('arrow-container');
        arrow[0].className += ' arrow-container-retina';
    }

    document.body.addEventListener("mousemove", function(event) {
        mousePoint.x = event.clientX ;
        mousePoint.y = event.clientY;
        checkForMouseContact(mousePoint);
    });

    document.body.addEventListener("click", function(event){
        mousePoint.x = event.clientX ;
        mousePoint.y = event.clientY;

        if (checkForMouseContact(mousePoint)){
            var graphcontainer = document.getElementsByClassName('graph-container');
            if (!expanded) {
                expanded = true;
                graphcontainer[0].className += " graph-container-expand";
                setTimeout(function () {
                    main.showGraphs(dataPoints);
                }, 500);
            } else {
                expanded = false;
                document.getElementById('graph').innerHTML = '';
                document.getElementById('caption').style.display = 'none';
                graphcontainer[0].classList.remove('graph-container-expand');
            }
        }
    });

    function checkForMouseContact(mousePoint) {
        var arrow = document.getElementById('slide-arrow-container').getBoundingClientRect();
        if (mousePoint.x > arrow.left && mousePoint.x < arrow.right && mousePoint.y > arrow.top && mousePoint.y < arrow.bottom) {
            hover = true;
            return true;
        } else {
            hover = false;
        }
    }

    function clearCanvas() {
        context.clearRect(0, 0, width, height);
        render();
        hoverState();
        expand();
        requestAnimationFrame(clearCanvas);
    }

    function render() {
        context.save();

        context.beginPath();
        context.moveTo(ajdustCoordX() - 5, wing);
        context.lineTo(ajdustCoordX(), center);
        context.lineTo(ajdustCoordX() + 5, wing);
        context.strokeStyle = '#adadad';
        context.lineWidth = strokewidth;
        context.lineCap = 'round';
        context.stroke();

        context.restore();
    }
    
    function ajdustCoordX() {
        if (retina) {
            return width / 4;
        } else {
            return width / 2;
        }
    }

    function expand() {
        if (expanded) {
            setTimeout(function(){
                if (wing < 12) {
                    wing += 0.3;
                    center -= 0.3;
                }
            },500);
        } else {
            setTimeout(function(){
                if (wing > 9) {
                    wing -= 0.3;
                    center += 0.3;
                }
            },500)
        }
    }

    function hoverState() {
        if (hover) {
            if (direction === 'up') {
                strokewidth += speed;
                if (strokewidth >= 3.5) {
                    direction = 'down';
                }
            }
            if (direction === 'down') {
                strokewidth -= speed;
                if (strokewidth < 1) {
                    direction = 'up';
                }
            }
        } else {
            if (strokewidth >  2) {
                strokewidth -= speed;
            } else {
                strokewidth += speed;
            }
        }
    }

});