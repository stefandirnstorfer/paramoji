var state= {
    valence: 50,
    arousal: 50,
    potency: 50,
    contempt: 0
};
var realfaces=[];
IMG_BASE= 'http://h2615096.stratoserver.net/emoticon-data/';

$(async function () {
    $('input').bind('input', refresh);
    $('input').bind('change', refresh);
    for (var key in state) {
        var m= location.search.match(RegExp(key.substring(0,1) + "=([0-9]+)"));
        if (m) state[key]= parseInt(m[1]);
    }
    realfaces = await d3.csv('bestrep.csv');
    redrawEmoticon();
});

function refresh() {
    for (var key in state) {
        state[key]=parseFloat($('#slider-' + key).val());
    }
    redrawEmoticon();
}

function setParam(v, a, p) {
    state.valence = v;
    state.arousal = a;
    state.potency = p;
    redrawEmoticon();
}

function redrawEmoticon() {
    var query= [];
    for (var key in state) {
        $('#label-' + key).text(state[key].toFixed());
        $('#slider-' + key).val(state[key]);
        query.push(key.substring(0,1)+"="+state[key].toFixed());
    }
    window.history.replaceState({}, "Emoticons", "?" + query.join("&"));

    var v=state.valence, a=state.arousal, p=state.potency, c=state.contempt;
    emoticon = $('#emoticon .set-emoticon').each((i,elt) => {
        $(elt).html(eval($(elt).attr("data-content")))
    });

    var dists = realfaces.map(row => ({
        file : row.file,
        dist: Math.sqrt(
            Math.pow(row.arousal - state.arousal, 2) +
            Math.pow(row.valence - state.valence, 2) +
            Math.pow(row.potency - state.potency, 2) +
            Math.pow(row.contempt - state.contempt, 2)
        )
    }))
        .sort((a,b) => a.dist - b.dist)
        .slice(0,5)
    console.table(dists)
    d3.selectAll('.realface')
        .data(dists)
        .attr("style", d => 'background-image:url('+IMG_BASE+d.file+')')
}

var oldtime = undefined;
function runAnimation(dstate) {
    var now = new Date().getTime();
    if (!oldtime) oldtime = now;
    var speed = parseFloat($('#slider-speed').val());
    var dt = (now - oldtime) * speed / 200;
    if ($('#animate').is(':checked')) {
        if (dt > 5) {
            oldtime = now;
            var decay = 0.1;
            for (var key in state) {
                if ($('#fix-' + key).is(':checked')) continue;
                x = state[key];
                dx = dstate[key] || 0;
                dx = decay * (Math.random() - .5) * Math.sqrt(dt) + (1 - decay) * dx;
                x = x + dx * dt;
                if (x > 100) {
                    x = 100;
                    dx = 0;
                }
                if (x < 0) {
                    x = 0;
                    dx = 0;
                }
                state[key] = x;
                dstate[key] = dx;
            }
        }
        redrawEmoticon();
        window.requestAnimationFrame(function () {
            runAnimation(dstate);
        });
    } else {
        oldtime = undefined;
    }
}
