
var isMobile =/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
var isTouchDevice = isMobile;

$.fn.attach = function(cb, preventBubble) {
	if (preventBubble) {
		attachEvent($(this), cb, true);
	} else {
		attachEvent($(this), cb, false);
	}
};

$.fn.hold = function(cb, t) {
	if (t==null) {
		t = 1200;
	}
	$(this).bind("touchstart", function(ev) {
		$(this).addClass("pressed");
		var tb = $(this);
		setTimeout(function() {
			if (tb!=null && tb.hasClass("pressed")) {
				$(tb).removeClass("pressed");
				$(tb).data("touchon", false);
				cb($(tb));
			}
		}, t);
	});
	
	$(this).bind("touchend", function() {
		$(this).removeClass("pressed");
	});
	$(this).bind("touchmove", function() {
		$(this).removeClass("pressed");
	});
}

function attachEvent(src, cb, preventBubble) {
	$(src).unbind();
	if (isTouchDevice) {
		$(src).bind("touchstart", function(event) {
			if (preventBubble) {
				event.stopPropagation();
			}
			$(this).addClass("pressed");
			$(this).data("touchon", true);
		});
		$(src).bind("touchend",  function() {
			$(this).removeClass("pressed");
			if($(this).data("touchon")) {
				if ($(this).siblings(".sib").length > 0) {
					if ($(this).hasClass("sibon")) {
						return;
					}
					cb($(this));
					$(this).siblings(".sib.sibon").removeClass("sibon");
					$(this).addClass("sibon");
				} else {
					cb($(this));
				}
			}
			$(this).data("touchon", false);
		});
		$(src).on('touchmove',function (e){
			$(this).data("touchon", false);
			$(this).removeClass("pressed");
		});
	} else {
		$(src).bind("mousedown", function() {
			$(this).addClass("pressed");
		});
		
		$(src).bind("mouseup", function() {
			$(this).removeClass("pressed");
			cb($(this));
		});
	}
}
