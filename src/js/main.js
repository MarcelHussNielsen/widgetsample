window.onload = function() {

    var  mousePoint = {
        x: 0,
        y: 0
    };
    var stars = [];

    var colorMatrix =[];

    switch (utils.randomInt(0, 4)) {
        case 0 :
            colorMatrix = [0 , 5, 5, 5, 5];
            break;
        case 1 :
            colorMatrix = [1 , 1, 5, 5, 5];
            break;
        case 2 :
            colorMatrix = [2 , 2, 2, 5, 5];
            break;
        case 3 :
            colorMatrix = [3 , 3, 3, 3, 5];
            break;
        case 4 :
            colorMatrix = [4 , 4, 4, 4, 4];
            break;
    }

    ratings();
    function ratings() {
        for (var i = 0; i < 5; i++) {
            var status = colorMatrix[i];
            new star(i, status)
        }
    }

    document.body.addEventListener("mousemove", function(event) {
        mousePoint.x = event.clientX ;
        mousePoint.y = event.clientY;
        stars = [];

        for (var i = 0; i < 5; i++) {
            var starPosition = {
                coords : document.getElementById('star_' + i).getBoundingClientRect(),
                id : 'star_' + i
            };
            stars.push(starPosition);
        }
        checkForMouseContact(stars, mousePoint);
    });

    function checkForMouseContact(stars, mousePoint) {
        for (var i = 0; i < 5; i++) {
            if (mousePoint.x > stars[i].coords.left && mousePoint.x < stars[i].coords.right && mousePoint.y > stars[i].coords.top && mousePoint.y < stars[i].coords.bottom) {
                starChangeColor('star_' + i, i);
            } else {
                // showAverageRating();
            }
        }
    }

    function starChangeColor(star, int) {
        document.getElementById('rating').innerHTML = '';
        switch (int) {
            case 0 :
                colorMatrix = [0 , 5, 5, 5, 5];
                break;
            case 1 :
                colorMatrix = [1 , 1, 5, 5, 5];
                break;
            case 2 :
                colorMatrix = [2 , 2, 2, 5, 5];
                break;
            case 3 :
                colorMatrix = [3 , 3, 3, 3, 5];
                break;
            case 4 :
                colorMatrix = [4 , 4, 4, 4, 4];
                break;
        }
        ratings();
    }

};