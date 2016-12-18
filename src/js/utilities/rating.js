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