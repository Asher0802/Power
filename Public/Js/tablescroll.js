/*$("#TableScroll").tableScroll( {
	window: 890,
	step: {
		min: 1,
		max: 10
	},
	timer: 30,
	ctrl: {
		able: true,
		left: ".moveLeft",
		right: ".moveRight",
		faster: true
	},
	stop: true,
	auto: {
		able: true,
		foward: "left"
	}
} );*/
$.fn.tableScroll = function(data) {
	var $this = this,scrollMar;
	if ( this.outerWidth(true) <= data.window ) {
		return this;
	}
	this.wrap("<div style='width:" + data.window + "px;overflow-x:hidden;'></div>");
	var box = this.parent();
	data.step.now = data.step.min;
	this.find("tr:first > td").each( function() {
		$(this).clone(true).insertAfter( $this.find("tr:first > td:last") );
	} );
	function move() {
		var middle = $this.find("tr:first > td:eq(" + ( $this.find("tr:first > td").length / 2 ) + ")").offset().left;
		var first = $this.find("tr:first > td:first").offset().left;
		if ( data.auto.foward == "left" || data.auto.foward == 0 ) {
			if ( middle - data.step.now > box.offset().left ) {
				box.scrollLeft( box.scrollLeft() + data.step.now );
			}
			else {
				box.scrollLeft( Math.abs(middle - box.offset().left - data.step.now) );
			}
		}
		else if ( data.auto.foward == "right" || data.auto.foward == 1 ) {
			if ( first + data.step.now < box.offset().left ) {
				box.scrollLeft( box.scrollLeft() - data.step.now );
			}
			else {
				box.scrollLeft( $this.outerWidth(true) / 2 - ( data.step.now - ( box.offset().left - first ) ) );
			}
		}
	}
	function start() {
		scrollMar = setInterval( function() {
			move();
		} , data.timer );
	}
	function end() {
		clearInterval(scrollMar);
	}
	if ( data.auto.able ) {
		start();
	}
	if ( data.stop ) {
		box.hover( function() {
			end();
		},function() {
			start();
		} );
	}
	if ( data.ctrl.able ) {
		$(data.ctrl.left).mouseover( function() {
			data.auto.foward = 0;
		} );
		$(data.ctrl.right).mouseover( function() {
			data.auto.foward = 1;
		} );
		$(data.ctrl.left + "," + data.ctrl.right).mousedown( function() {
			data.step.now = data.step.max;
		} ).css("cursor","pointer");
		$(document).mouseup( function() {
			data.step.now = data.step.min;
		} );
	}
	return this;
};