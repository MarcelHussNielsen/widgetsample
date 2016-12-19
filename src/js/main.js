
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

    function createReview(rating) {
        console.log(rating);
        document.getElementById('new-review').style.display = 'block';
    }

    function showReview(number) {
        console.log(number);
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



