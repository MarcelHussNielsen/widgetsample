window.onload = function() {

    var dataPoints = [];

    init();

    function init() {
        var averageRating = createReviews();
        rating(averageRating);
        graph(dataPoints);
        arrows();
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









};