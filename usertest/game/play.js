var updateFun=[];
var STOP = false;
var tradeCount = 0;
var t0;

$(function() {
    t0 = Date.now();
    $('.stock:not(.template)').html($('.stock.template').html());
    $('.stock').click(trade);
    $('.stock').each(function(i, elt) { update(i, $(elt)); });
    refreshAll()
});

function trade(evt) {
    evt.preventDefault();
    tradeCount ++;
    var button = $(this).find('.button');
    var pl = $(this).find('.pl');
    button.toggleClass('hold');
    if (button.is('.hold')) {
	button.text('sell');
	$(this).find('.paid').text($(this).find('.price').text());
	$(this).find('.net').text('-'+$(this).find('.fee').text());
	var price = parseFloat($(this).find('.price').text());
	var fee = parseFloat($(this).find('.fee').text());
	$('#cash').text(
	    (parseFloat($('#cash').text()) -fee -price).toFixed(2));
	pl.show();
    } else {
	button.text('buy');
	var price = parseFloat($(this).find('.price').text());
	$('#cash').text(
	    (parseFloat($('#cash').text()) + price).toFixed(2));
	pl.hide();
    }
    updatePL();
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

function update(index, stock) {
    var SIGMA0 = 0.4;
    var LAMBDA0 = 1000;
    var price= 100.0;
    var lambda= LAMBDA0;
    var sigma= SIGMA0;
    var mu= Math.random()/2-0.25;
    var xData = [];
    var yData = [];

    var updateStep = function() {
	var r = mu + sigma * 3.6*(Math.random()-0.5);
	var dt = -lambda * Math.log(Math.random());
	price = Math.max(0,price + r);
	
	lambda = 1000* 1e-4 + (1-1e-4)*(0.1*dt + 0.9*lambda);
	mu = 0.022*r + 0.97 * mu;
	if (tradeCount>50) mu= mu + 0.015;

	sigma = Math.min(2,
			 Math.sqrt(0.01*SIGMA0 + 0.4*Math.pow((r),2) 
				   + 0.59*Math.pow(sigma,2)));
	updateFun[index] = function(visual) {
	    stock.find('.price').text(price.toFixed(2));

	    if (visual=="text") {
	    stock.find('.plot').html('m='+mu.toFixed(2)+'<br/>s='+
				     sigma.toFixed(2)+'<br/>l='+
				     lambda.toFixed(0));
	    } 
	    else if (visual=="emoticon") {
		var v = trim(mu, -0.15, 0.15);
		var a = trim(lambda, 3000, 100, Math.log);
		var p = trim(sigma, 0.64, 0.25, Math.log);
		stock.find('.plot').html(emoticon_svg(v,a,p,Math.random()));
	    } else {
		xData.push(Date.now()-t0);
		xData.push(Date.now()-t0+dt);
		yData.push(price);
		yData.push(price);
		drawChart(stock.find('.plot')[0], xData, yData);
	    }

	    if (stock.find('.button').is('.hold')) {
		var fee = parseFloat(stock.find('.fee').text());
		var paid = parseFloat(stock.find('.paid').text());
		stock.find('.net').text(
		    (price - fee- paid).toFixed(2))
	    }
	};
	setTimeout(updateStep, dt);
    }
    updateStep();
}

function refreshAll() {
    if (STOP) return;
    updatePL();
    var visual = $('input[name="visual"]:checked').attr('value');
    $('.stock').each(function(i, elt) {
	if (updateFun[i]) {
	    updateFun[i](visual);
	    updateFun[i] = undefined;
	} 
	else if (visual=="chart") {
	    $(elt).find('g[data-now]').each(function(i,elt) {
		var dt = Date.now() - parseInt($(elt).attr('data-now'));
		var v = parseFloat($(elt).attr('data-shift-ms'));
		$(elt).attr('transform','translate(-'+dt*v+',0)');
	    });
	}
    });
    window.requestAnimationFrame(refreshAll);
}

function updatePL() {
    var asset = 0.0;
    $('.stock').each(function() {
	if ($(this).find('.button').is('.hold')) {
	    var price= parseFloat($(this).find('.price').text());
	    asset += price;
	}
    });
    var cash = parseFloat($('#cash').text());
    $('#asset').text(asset.toFixed(2));
    $('#total').text((cash + asset).toFixed(2));
    if (cash + asset > 100) {
	$('#youwon').show();
	$('#wintime').text(((Date.now()-t0)/1000).toFixed(0));
	STOP = true;
    }
}

function emoticon_svg(v, a, p, index) {
	return emoticon_svg_raw(v, a, p)
	.replace(/id="/g, 'id="emo' + index + '-')
	.replace(/url\(#/g, 'url(#emo' + index + '-')
	.replace(/href="#/g, 'href="#emo' + index + '-');
}

function drawChart(elt, xData, yData) {
    var width = parseInt(d3.select(elt).style('width'));
    var height = parseInt(d3.select(elt).style('height'));
    var WINDOW = 10000;


    var maxx = xData[xData.length-2];
    while (xData[1] < maxx-WINDOW) {
	xData.shift();
	yData.shift();
    }
    var x = d3.scale.linear()
	.range([0, width])
	.domain([maxx-WINDOW, maxx]);

    var domain = d3.extent(yData);
    var y = d3.scale.linear()
	.range([height, 0])
	.domain([domain[0]-1, domain[1]+1]);


    var xAxis = d3.svg.axis()
	.scale(x)
	.orient("top")
	.tickFormat("");

    var yAxis = d3.svg.axis()
	.scale(y)
	.orient("right");

    var line = d3.svg.line()
	.x(function(d,i) {return x(xData[i])})
	.y(function(d,i) {return y(yData[i])});

    d3.select(elt).select('svg').remove();
    var svg = d3.select(elt).append("svg")
	.attr("width", "100%")
	.attr("height", "100%")
	.attr("viewBox", "0 0 "+width+" "+(height+1))
	.append("g")


    svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + (height) + ")")
	.call(xAxis);

    svg.append("g")
	.attr("class", "y axis")
	.call(yAxis);

    svg.append("g")
       .attr('transform','translate(0,0)')
       .attr('data-shift-ms',x(1)-x(0))
       .attr('data-now',Date.now())
	.append("path")
	.datum(xData)
	.attr("class", "line")
	.attr("d", line);
}
