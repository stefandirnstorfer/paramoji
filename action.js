var state= {
    v: 50,
    a1: 40,
    a2: 0,
    p: 50,
    c: 0
};
$(async function () {
    $('input').bind('input', x => refresh(false));
    $('input').bind('change', x => refresh(false));
    $('input, select').bind('change', refresh);
    for (let key in state) {
        $('#clear-'+key).bind('click', function() {
            state[key]= (["c"].includes(key) ? 0 : 50)
            redrawEmoticon(true)
        })
    }

    for (let key in state) {
        var m= location.search.match(RegExp(key + "=([0-9]+)"));
        if (m) state[key]= parseInt(m[1]);
    }
    redrawEmoticon();
});

function refresh(storeUrl) {
    for (var key in state) {
        state[key]=parseFloat($('#slider-' + key).val());
    }
    redrawEmoticon(storeUrl);
}

function setParam(v, a1, a2, p, c) {
    state.v = v;
    state.a1 = a1;
    state.a2 = a2;
    state.c = c || 0;
    state.p = p || 0;
    redrawEmoticon(true);
}

function redrawEmoticon(storeUrl) {
    var query= [];
    for (var key in state) {
        console.log(state, key)
        $('#label-' + key).text(state[key].toFixed());
        $('#slider-' + key).val(state[key]);
        query.push(key+"="+state[key].toFixed());
    }
    if (storeUrl)
        window.history.replaceState({}, "Emoticons", "?" + query.join("&"));

    const v=state.v/100, a1=state.a1/100, a2= state.a2/100, p=state.p/100, c=state.c/100;
    const color = $('#color').val()
    $('#emoticon-svg').html(paramoji_svg(v, a1, a2, p, c, color));
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
                    if (!["c"].includes(key)) {
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
