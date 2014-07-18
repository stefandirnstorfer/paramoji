$(function() {
    setParam(50,50,50);
});

function refresh() {
    var v= $('#slider-valence').val();
    var a= $('#slider-arousal').val();
    var p= $('#slider-potency').val();
    setParam(v,a,p);
}

function setParam(v,a,p) {
    $('#slider-valence').val(v);
    $('#slider-arousal').val(a);
    $('#slider-potency').val(p);

    $('#label-valence').text(v);
    $('#label-arousal').text(a);
    $('#label-potency').text(p);

    drawEmoticon(v,a,p);
}

function drawEmoticon(v,a,p) {
    var sv= Math.abs(v-50)/50;
    var sa= Math.abs(a-50)/50;
    var sp= Math.abs(p-50)/50;
    $('#svg-frame').html(emoticon_svg_raw(function(x) {
      return x[0] + sv*(v>50 ? x[1] : x[2])
	+ sa * (a>50 ? x[3] : x[4])
	+ sp * (p>50 ? x[5] : x[6])
	+ sv*sa * (sv > 50 ?
		   (sa > 50 ? x[7] : x[8]) :
		   (sa > 50 ? x[11] : x[12]))
        + sv*sp * (sv > 50 ?
		   (sp > 50 ? x[9] : x[10]) :
		   (sp > 50 ? x[13] : x[14]))
	+ sa*sp * (sa > 50 ?
		   (sp > 50 ? x[15] : x[17]) :
		   (sp > 50 ? x[16] : x[18]));
    }));
}
