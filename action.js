var v, a, p;
$(function() {
    setParam(50, 50, 50);
    var toosmall = $('#control > div')
	.is(function(i, elt) { return elt.offsetHeight < elt.scrollHeight; })
    if (toosmall) {
	$('#control h1:not(:first)').addClass('inactive');
	$('#control h1').addClass('clickable');
	$('#control h1').click(function(evt) {
	    $('#control h1').addClass('inactive');
	    $(evt.target).removeClass('inactive');
	})
    }
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
    var sv= Math.abs(v-50)/50;
    var sa= Math.abs(a-50)/50;
    var sp= Math.abs(p-50)/50;
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
		   (p > 50 ? x[16] : x[18]))
	+ sv*sa*sp * (v > 50 ?
		      (a > 50 ?
		       (p > 50 ? x[19] : x[20]) :
		       (p > 50 ? x[21] : x[22])) :
		      (a > 50 ?
		       (p > 50 ? x[23] : x[24]) :
		       (p > 50 ? x[25] : x[26])))
    }));
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
