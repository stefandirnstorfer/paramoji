var v = 50;
var a = 50;
var p = 50;
$(function() {
    redraw();
});

function refresh() {
    v = parseFloat($('#slider-valence').val());
    a = parseFloat($('#slider-arousal').val());
    p = parseFloat($('#slider-potency').val());
    redraw();
}

function setParam(new_v, new_a, new_p) {
    v = new_v;
    a = new_a;
    p = new_p;
    redraw();
}

function redraw() {
    $('#slider-valence').val(v);
    $('#slider-arousal').val(a);
    $('#slider-potency').val(p);

    $('#label-valence').text(v.toFixed());
    $('#label-arousal').text(a.toFixed());
    $('#label-potency').text(p.toFixed());

    drawEmoticon(v, a, p);
}

function drawEmoticon(v,a,p) {
    var sv= Math.abs(v-50)/50;
    var sa= Math.abs(a-50)/50;
    var sp= Math.abs(p-50)/50;
    console.log(sv,sa,sp);
    $('#svg-frame').html(emoticon_svg_raw(function(x) {
      return x[0] + sv*(v>50 ? x[1] : x[2])
	+ sa * (a>50 ? x[3] : x[4])
	+ sp * (p>50 ? x[5] : x[6])
	+ sv*sa * (v > 50 ?
		   (a > 50 ? x[7] : x[8]) :
		   (a > 50 ? x[11] : x[12]))
        + sv*sp * (v > 50 ?
		   (p > 50 ? x[9] : x[10]) :
		   (p > 50 ? x[13] : x[14]))
	+ sa*sp * (a > 50 ?
		   (p > 50 ? x[15] : x[17]) :
		   (p > 50 ? x[16] : x[18]));
    }));
}

var oldtime = undefined;
function animate(dv, da, dp) {
    var now = new Date().getTime();
    var dt = (now - (oldtime || now));
    if ($('#animate').is(':checked')) {
	oldtime = now;
	var decay = 0.1;
	dv = decay * (Math.random()-.5) * Math.sqrt(dt) + (1-decay) * dv;
	da = decay * (Math.random()-.5) * Math.sqrt(dt) + (1-decay) * da;
	dp = decay * (Math.random()-.5) * Math.sqrt(dt) + (1-decay) * dp;
	window.requestAnimationFrame(function() { animate(dv, da, dp); });
	var map = function(x) { return x>100 ? 100 : (x<0 ? 0 : x); }
	setParam(map(v+dv),map(a+da),map(p+dp));
    } else {
	oldtime = undefined;
    }
}