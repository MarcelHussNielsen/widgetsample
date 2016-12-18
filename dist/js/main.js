
window.onload = function() {
    main.init();
};

var main = (function(){
    var dataPoints = [];

    function init() {
        var averageRating = createReviews();
        rating(averageRating);
        arrows(dataPoints);
    }

    function showGraphs(dataPoints) {
        document.getElementById('caption').style.display = 'block';
        graph(dataPoints);
    }

    function createReview() {
        document.getElementById('new-review').style.display = 'block';
    }

    function showReview(number) {

    }

    function createReviews() {
        badReviews();
        mediumReviews();
        goodReviews();
        return evalutateReviews();
    }


    function badReviews() {
        for (var i = 0; i < 5; i++) {
            dataPoints.push(utils.randomInt(0, 3))
        }
    }

    function mediumReviews() {
        for (var i = 0; i < 25; i++) {
            dataPoints.push(utils.randomInt(2, 4))
        }
    }

    function goodReviews() {
        for (var i = 0; i < 20; i++) {
            dataPoints.push(utils.randomInt(3, 4))
        }
    }

    function evalutateReviews() {
        var totalSum = 0;
        for (var k = 0; k < dataPoints.length; k++) {
            totalSum += dataPoints[k];

        }
        return totalSum;
    }

    return {
        init : init,
        showGraphs : showGraphs,
        createReview : createReview,
        showReview : showReview
    }


}(window));




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
        thisDataPoint = null;
    
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
            hover = false;
        }
    }

    function checkForMouseContactWithDatapoint(mousePoint, baseCoords) {
        var modifier = 3;
        for (var i = 0; i < particles.length; i++) {
            if (mousePoint.x > baseCoords.left + particles[i].x - modifier && mousePoint.x < baseCoords.left + particles[i].x + modifier && mousePoint.y > baseCoords.top + particles[i].y - modifier && mousePoint.y < baseCoords.top + particles[i].y + modifier) {
                hover = true;
                thisDataPoint = i;
                return i;
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
                    context.strokeStyle = gradient;
                    context.lineWidth = 1.5;
                    context.stroke();
                }
            }

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
var reviews = [
    {
        "firstName":"Simon",
        "lastName":"Lock",
        "fullName":"Simon Lock",
        "location":"Kolding",
        "reviewTitle":"Super quality.. I will show here again!",
        "reviewBody":"Super nice quality, fast devilery, good prices. I will shop here again!",
        "starRating": 5
    },
    {
        "firstName":"Gav",
        "lastName":"",
        "fullName":"Gav",
        "location":"",
        "reviewTitle":"Princely Sum",
        "reviewBody":"A decent local curry house in Faversham, Kent known for its Elvis nights.",
        "starRating": 4
    },
    {
        "firstName":"Justin",
        "lastName":"Wright",
        "fullName":"Justin Wright",
        "location":"London, GB",
        "reviewTitle":"Good Services",
        "reviewBody":"A decent place to introduce your taste buds to fiery Indian fare",
        "starRating": 3
    },
    {
        "firstName":"Erika",
        "lastName":"Wolfe",
        "fullName":"Erika Wolfe",
        "location":"Gothenburg, SE",
        "reviewTitle":"Nightmare experience - no product, no communication, no refund; improved by rapid resolution",
        "reviewBody":"In early 2012, I ordered a set of chairs from Infurn. I thought that by ordering in March, I would have what I needed by November, certainly. I wanted the perfect chairs for my house, and really did not NEED them before the annual Thanksgiving dinner (the only time of year I have a need for a whole lot of chairs at one time). I played it safe, I thought, by ordering so far in advance." +
        "Week after week, month after month, Infurn's website kept updating the status of the order so that the chairs' arrival would be further and further in the distant future. Finally when the week of Thanksgiving arrived, and I had had contact with their customer service in early November (and their only clueless reply was to say, 'We had manufacturing problems; let's hope the chairs arrive this week as scheduled.'), I still had no chairs, had to go out and buy some other chairs and still had no clue when the Infurn chairs might arrive. " +
        "At some point I finally just requested a refund because Infurn could neither deliver my chairs nor give me a solid date about when I might receive them when I inquired about a delivery date. They finally offered me a refund - which I accepted on 14 December 2012.",
        "starRating": 2
    },
    {
        "firstName":"Hugo",
        "lastName":"Beja",
        "fullName":"Hugo Beja",
        "location":"Praia Da Barra, PT",
        "reviewTitle":"FRAUD",
        "reviewBody":"I've been patiently waiting for a miracle to happen with our order AU-316084, 12 Chairs!! First the delays, lots and lots of delays with no apparent reason... after they send just 1/2 of the order and say it's all... So we bought 'Pairs' of chairs... we paid for 5 PAIRS and received 5 chairs!!! The other 2, the rocket chairs we never receive...." +
        "Communication ZERO, they simply ignore the e-mails... when they did respond they asked us to prove our order to be pairs!!! LOL and just stopped communicating... their website is constantly down... probably to make lose interest and rest your forces to recover what you paid for!!",
        "starRating": 1
    }
];
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



var rating = (function(reviewsRatings){
    var  mousePoint = {
        x: 0,
        y: 0
    };
    var stars = [];
    var colorMatrix =[];
    var theRatings = null;

    init(reviewsRatings);

    function init(reviewsRatings) {
        theRatings = reviewsRatings;
        starChangeColor(utils.roundNearest(reviewsRatings / 50, 1));
        averageRatingIntoDOM(reviewsRatings);
    }

    function averageRatingIntoDOM(reviewsRatings) {
        document.getElementById('average-rating').innerHTML = reviewsRatings / 50;
    }

    function ratings() {
        document.getElementById('rating').innerHTML = '';
        for (var i = 0; i < 5; i++) {
            var status = colorMatrix[i];
            new star(i, status)
        }
    }

    document.body.addEventListener("mousemove", function(event) {
        mousePoint.x = event.clientX;
        mousePoint.y = event.clientY;
        stars = [];

        for (var i = 0; i < 5; i++) {
            var starPosition = {
                coords : document.getElementById('star_' + i).getBoundingClientRect(),
                id : 'star_' + i
            };
            stars.push(starPosition);
        }
        checkForMouseContact(mousePoint);
    });

    document.body.addEventListener('click', function (event) {
        mousePoint.x = event.clientX;
        mousePoint.y = event.clientY;
        var rating = checkForMouseContact(mousePoint);
        if (rating) {

            main.createReview(rating);
        }
    });

    function checkForMouseContact(mousePoint) {
        for (var i = 0; i < 5; i++) {
            if (mousePoint.x > stars[i].coords.left && mousePoint.x < stars[i].coords.right && mousePoint.y > stars[i].coords.top && mousePoint.y < stars[i].coords.bottom) {
                starChangeColor(i+1);
                return 'rating' + i;
            }
        }
    }

    function starChangeColor(int) {
        switch (int) {
            case 1 :
                colorMatrix = [0 , 5, 5, 5, 5];
                break;
            case 2 :
                colorMatrix = [1 , 1, 5, 5, 5];
                break;
            case 3 :
                colorMatrix = [2 , 2, 2, 5, 5];
                break;
            case 4 :
                colorMatrix = [3 , 3, 3, 3, 5];
                break;
            case 5 :
                colorMatrix = [4 , 4, 4, 4, 4];
                break;
        }
        ratings();
    }

});
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
var utils = {

	trianglePointCollision: function(px, py, ax, ay, bx, by, cx, cy){
		var v0 = [cx - ax, cy - ay],
		    v1 = [bx - ax, by - ay],
			v2 = [px - ax, py - ay];
		var dot00 = (v0[0] * v0[0]) + (v0[1] * v0[1]),
			dot01 = (v0[0] * v1[0]) + (v0[1] * v1[1]),
			dot02 = (v0[0] * v2[0]) + (v0[1] * v2[1]),
			dot11 = (v1[0] * v1[0]) + (v1[1] * v1[1]),
			dot12 = (v1[0] * v2[0]) + (v1[1] * v2[1]);
		var invDenom = 1 / (dot00 * dot11 - dot01 * dot01),
			u = (dot11 * dot02 - dot01 * dot12) * invDenom,
			v = (dot00 * dot12 - dot01 * dot02) * invDenom;
		return((u >= 0) && (v >= 0) && (u + v < 1));
	},

	randomRange: function(min, max) {
		return min + Math.random() * (max - min);
	},

	randomInt: function(min, max) {
		return Math.floor(min + Math.random() * (max - min + 1));
	},

	roundToPlaces: function(value, places) {
		var mult = Math.pow(10, places);
		return Math.round(value * mult) / mult;
	},

	roundNearest: function(value, nearest) {
		return Math.round(value / nearest) * nearest;
	},

	quadraticBezier: function(p0, p1, p2, t, pFinal) {
		pFinal = pFinal || {};
		pFinal.x = Math.pow(1 - t, 2) * p0.x + 
				   (1 - t) * 2 * t * p1.x + 
				   t * t * p2.x;
		pFinal.y = Math.pow(1 - t, 2) * p0.y + 
				   (1 - t) * 2 * t * p1.y + 
				   t * t * p2.y;
		return pFinal;
	},

	cubicBezier: function(p0, p1, p2, p3, t, pFinal) {
		pFinal = pFinal || {};
		pFinal.x = Math.pow(1 - t, 3) * p0.x + 
				   Math.pow(1 - t, 2) * 3 * t * p1.x + 
				   (1 - t) * 3 * t * t * p2.x + 
				   t * t * t * p3.x;
		pFinal.y = Math.pow(1 - t, 3) * p0.y + 
				   Math.pow(1 - t, 2) * 3 * t * p1.y + 
				   (1 - t) * 3 * t * t * p2.y + 
				   t * t * t * p3.y;
		return pFinal;
	},

	multicurve: function(points, context) {
		var p0, p1, midx, midy;
		context.moveTo(points[0].x, points[0].y);
		for(var i = 1; i < points.length - 2; i += 1) {
			p0 = points[i];
			p1 = points[i + 1];
			midx = (p0.x + p1.x) / 2;
			midy = (p0.y + p1.y) / 2;
			context.quadraticCurveTo(p0.x, p0.y, midx, midy);
		}
		p0 = points[points.length - 2];
		p1 = points[points.length - 1];
		context.quadraticCurveTo(p0.x, p0.y, p1.x, p1.y);
	}
};