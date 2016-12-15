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