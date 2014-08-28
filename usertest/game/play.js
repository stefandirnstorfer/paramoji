
$(function() {
    $('.stock:not(.template)').html($('.stock.template').html());
    $('.stock').click(trade);
    $('.stock').each(function(evt) { update($(this)); });
});

function trade(evt) {
    evt.preventDefault();
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

function trim(x) {
    return x>0 ? (x<100 ? x : 100) : 0;
}

function update(stock) {
    var price= 1000.0;
    var lambda= 1000;
    var sigma= 1
    var mu= 0;

    var updateStep = function() {
	var r = mu + sigma * rnd_snd();
	var dt = -lambda * Math.log(Math.random());
	price = price + r;
	
	lambda = 1000* 1e-4 + (1-1e-4)*(0.1*dt + 0.9*lambda);
	mu = 0.01*r + 0.98 * mu;

	sigma = Math.sqrt(0.001 + 0.009*Math.pow((r - mu),2) + 0.99*Math.pow(sigma,2));
	stock.find('.price').text(price.toFixed(2));

	var visual = $('input[name="visual"]:checked').attr('value');
	if (visual=="text") {
	    stock.find('.plot').html('m='+mu.toFixed(2)+'<br/>s='+
				     sigma.toFixed(2)+'<br/>l='+
				     lambda.toFixed(0));
	} else {
	    
	    var v = trim(mu/0.15 * 100 + 50);
	    var a = trim(50 - 50*Math.log(lambda/1000));
	    
	    stock.find('.plot').html(emoticon_svg(v,a,50,Math.random()));
	}

	if (stock.find('.button').is('.hold')) {
	    var fee = parseFloat(stock.find('.fee').text());
	    var paid = parseFloat(stock.find('.paid').text());
	    stock.find('.net').text(
		(price - fee- paid).toFixed(2))
	    updatePL();
	}
	setTimeout(updateStep, dt);
    }
    updateStep();
}

function updatePL() {
    var asset = 0.0;
    $('.stock').each(function() {
	if ($(this).find('.button').is('.hold')) {
	    var price= parseFloat($(this).find('.price').text());
	    asset += price;
	}
    });
    $('#asset').text(asset.toFixed(2));
    $('#total').text(
	(parseFloat($('#cash').text()) + asset).toFixed(2));
}

function emoticon_svg(v, a, p, index) {
	return emoticon_svg_raw(v, a, p)
	.replace(/id="/g, 'id="emo' + index + '-')
	.replace(/url\(#/g, 'url(#emo' + index + '-')
	.replace(/href="#/g, 'href="#emo' + index + '-');
}
