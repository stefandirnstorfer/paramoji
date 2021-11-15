var state= {
    valence: 50,
    arousal: 50,
    potency: 50,
    contempt: 0,
    expression: 50
};
$(async function () {
    $('input').bind('input', refresh);
    $('input').bind('change', refresh);

    for (var key in state) {
        var m= location.search.match(RegExp(key.substring(0,1) + "=([0-9]+)"));
        if (m) state[key]= parseInt(m[1]);
    }
    redrawEmoticon();
});

function refresh() {
    for (var key in state) {
        state[key]=parseFloat($('#slider-' + key).val());
    }
    redrawEmoticon();
}

function setParam(v, a, p, c, e) {
    state.valence = v;
    state.arousal = a;
    state.potency = p;
    state.contempt = c == undefined ? 0 : c;
    state.expression = e == undefined ? 50 : e;
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

    var v=state.valence, a=state.arousal, p=state.potency, c=state.contempt, e=state.expression;
    $('#emoticon-svg').html(emoticon_svg(v, a, p, c, e));
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
                    if (key!="contempt") {
                        dx = 0;
                    }
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
