var T0 = Date.now();
var C0 = 0;
var cashDeserved = C0;
var globalDrift = 0;
var tradeCount = 0;
var STOP = false;

var data = [];
var HISTORY = [];

$(function() {
    T0 = Date.now();
    $('.stock:not(.template)').html($('.stock.template').html());
    $('.stock').each(function(i, elt) { 
	$(elt).click(function(evt) { trade(evt, i); });
	initStock($(elt), i);
    });
    updateAll()
});

function trade(evt, index) {
    var target = $(evt.target);
    while (!target.is('.stock')) target=target.parent();
    evt.preventDefault();
    if (STOP) return;
    tradeCount ++;
    var button = target.find('.button');
    var pl = target.find('.pl');
    var price = parseFloat(target.find('.price').text());
    var cash = parseFloat($('#cash').text());
    HISTORY.push({action : data[index].hold ? 'sell' : 'buy', 
		  index : index, 
		  time : Date.now() - T0,
		  data : data.map(function(x) { return $.extend({}, x); })
		 });
    data[index].hold = 1- data[index].hold;
    target.toggleClass('hold', data[index].hold);
    if (data[index].hold) {
	button.text('sell');
	target.find('.paid').text(target.find('.price').text());
	target.find('.net').text('-'+target.find('.fee').text());
	$('#cash').text((cash -price).toFixed(2));
	pl.fadeIn(10);
    } else {
	button.text('buy');
	$('#cash').text((cash + price).toFixed(2));
	pl.fadeOut(800);
    }
    cashDeserved += 2;
}

function rnd_snd() {
	return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
}

function trim(x, min, max, f) {
    if (f) {
	x= f(x);
	min = f(min);
	max = f(max);
    }
    x = 100*(x-min)/(max-min);
    return x>0 ? (x<100 ? x : 100) : 0;
}

function initStock(stock, index) {
    data[index] = {
	price : 100.0,
	v : Math.random() * 100,
	a : Math.random() * 100,
	p : 50,
	dv : 0,	da : 0,	dp : 0,
	vdisp: 50, adisp: 50, pdisp: 50,
	hold : 0
    };
    stock.find('.plot').html(emoticon_svg(50,50,50,index));
}

function updateEmotion(data, dt) {
    var decay = 0.1;
    var S = 0.01;
    data.dv += decay * S * rnd_snd() * Math.sqrt(dt);
    data.da += decay * S * rnd_snd() * Math.sqrt(dt);
    data.dp += decay * S * rnd_snd() * Math.sqrt(dt);
    var map = function(x) { return x>100 ? 100 : (x<0 ? 0 : x); }
    dt = 100;
    data.v = map(data.v + data.dv * dt);
    data.a = map(data.a + data.da * dt);
    data.p = map(data.p + data.dp * dt);
    if (data.v <= 0 || data.v >= 100) data.dv = -data.dv;
    if (data.a <= 0 || data.a >= 100) data.da = -data.da;
    if (data.p <= 0 || data.p >= 100) data.dp = -data.dp;
}

function updateStock(stock, index, dt) {

    var SIGMA = 0.5;
    if (Math.random()<dt*0.002) {
	data[index].price = Math.max(0, data[index].price + 
				     + 0.002 * globalDrift * dt
				     + SIGMA * Math.sqrt(dt/1000) * rnd_snd());
	stock.find('.price').text(data[index].price.toFixed(2));

	updateEmotion(data[index], dt);
	var v = data[index].v;
	var a = data[index].a * (data[index].hold ? (100-v) : v)/100;
	var p = 50;
	var dthresh = Math.min(10,0.05*dt-2);
	if (Math.abs(v - data[index].vdisp) > dthresh ||
	    Math.abs(a - data[index].adisp) > dthresh) {
	    data[index].vdisp = v;
	    data[index].adisp = a;
	    var newface= $(emoticon_svg(v,a,p,index));
	    newface.find('path,g').each(function(i, e) {
		var match = stock.find('#'+$(e).attr('id'));
		match.attr('d', $(e).attr('d'));
		match.attr('transform', $(e).attr('transform'));
	    });
	}
    }
}

function updateAll() {
    var time= Date.now();
    var nextStep = function() {
	var dt = Math.min(500, Date.now() - time);
	$('.stock').each(function(i, elt) {
	    updateStock($(elt), i,dt);
	});
	updatePL(dt);
	time = time + dt;
	if (!STOP)
	    window.requestAnimationFrame(nextStep);
    };
    nextStep();
}

function updatePL(dt) {
    var heldStocks = 0;
    var asset = 0.0;
    $('.stock').each(function() {
	if ($(this).is('.hold')) {
	    heldStocks++;
	    var price= parseFloat($(this).find('.price').text());
	    asset += price;
	}
    });
    var cash = parseFloat($('#cash').text());
    globalDrift = Math.max(-1,Math.min(1, cashDeserved - cash - asset));

    $('#asset').text(asset.toFixed(2));
    $('#total').text((cash + asset).toFixed(2));

    if (cash + asset > C0 + 100) {
	$.post('/submit', JSON.stringify(HISTORY));
	$('#youwon').show();
	$('#wintime').text(((Date.now()-T0)/1000).toFixed(0));
	STOP = true;
    }
}

function emoticon_svg(v, a, p, index) {
	return emoticon_svg_raw(v, a, p)
	.replace(/id="/g, 'id="emo' + index + '-')
	.replace(/url\(#/g, 'url(#emo' + index + '-')
	.replace(/href="#/g, 'href="#emo' + index + '-');
}

function analyze() {
    $('body').children().remove();
    for (i in HISTORY) {
	var h = HISTORY[i];
	var c = h.data[HISTORY[i].index];
	var elt=$('<div>'+h.action+'</div>');
	$('body').append(elt);
	elt.css('position','absolute');
	elt.css('left', (5 + 0.8*c.v).toFixed(0)+'vw');
	elt.css('top',(85 - 0.8*c.a).toFixed(0)+'vh');
	elt.css('color', h.action=='buy' ? 'green' : 'red');
	elt.css('font-size','5vh');
    }
}


