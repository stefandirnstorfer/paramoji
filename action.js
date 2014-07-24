var v, a, p;
$(function() {
    setParam(50, 50, 50);
});

function refresh() {
    v = parseFloat($('#slider-valence').val());
    a = parseFloat($('#slider-arousal').val());
    p = parseFloat($('#slider-potency').val());
    setParam(v, a, p);
}

function setParam(new_v, new_a, new_p, isanimated) {
    if (!isanimated || !$('#fix-v').is(':checked')) {
	v = new_v;
	$('#slider-valence').val(v);
    }
    if (!isanimated || !$('#fix-a').is(':checked')) {
	a = new_a;
	$('#slider-arousal').val(a);
    }
    if (!isanimated || !$('#fix-p').is(':checked')) {
	p = new_p;
	$('#slider-potency').val(p);
    }

    $('#label-valence').text(v.toFixed());
    $('#label-arousal').text(a.toFixed());
    $('#label-potency').text(p.toFixed());

    drawEmoticon(v, a, p);
}

function drawEmoticon(v,a,p) {
    $('#emoticon').html(emoticon_svg_raw(v,a,p));
}

var oldtime = undefined;
function animate(dv, da, dp) {
    var now = new Date().getTime();
    if (!oldtime) oldtime = now;
    var speed = parseFloat($('#slider-speed').val());
    var dt = (now - oldtime) * speed/100;
    if ($('#animate').is(':checked')) {
	if (dt > 5) {
	    oldtime = now;
	    var decay = 0.1;
	    dv = decay * (Math.random()-.5) * Math.sqrt(dt) + (1-decay) * dv;
	    da = decay * (Math.random()-.5) * Math.sqrt(dt) + (1-decay) * da;
	    dp = decay * (Math.random()-.5) * Math.sqrt(dt) + (1-decay) * dp;
	    var map = function(x) { return x>100 ? 100 : (x<0 ? 0 : x); }
	    setParam(map(v+dv*dt),map(a+da*dt),map(p+dp*dt), true);
	}
	window.requestAnimationFrame(function() { animate(dv, da, dp); });
    } else {
	oldtime = undefined;
    }
}
