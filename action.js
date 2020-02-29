const state= {
    valence: 50,
    arousal: 50,
    potency: 50,
    contempt: 0,
    expression: 50
};

$(async function () {
    $('input')
        .bind('input', refresh)
        .bind('change', refresh);

    for (const key in state) {
        const m= location.search.match(RegExp(key.substring(0,1) + "=([0-9]+)"));
        if (m) state[key]= parseInt(m[1]);
    }
    if (location.search.match(/nocontrols/)) {
        $('#control').remove()
    }
    redrawEmoticon();
});

function refresh() {
    for (const key in state) {
        state[key]=parseFloat($('#slider-' + key).val());
    }
    requestAnimationFrame(redrawEmoticon);
}

function setParam(v, a, p, c, e) {
    state.valence = v;
    state.arousal = a;
    state.potency = p;
    state.contempt = c;
    state.expression = e;
    redrawEmoticon();
}

function setRandomParams(v) {
    state.valence = Math.round(100 * Math.random());
    state.arousal = Math.round(100 * Math.random());
    state.potency = Math.round(100 * Math.random());
    state.contempt = Math.max(0, Math.round(200 * Math.random()) - 100);
    state.expression = Math.round(100 * Math.random());
    redrawEmoticon();
}

function redrawEmoticon() {
    const query= [];
    for (const key in state) {
        $('#label-' + key).text(state[key].toFixed());
        $('#slider-' + key).val(state[key]);
        query.push(key.substring(0,1)+"="+state[key].toFixed());
    }
    window.history.replaceState({}, "Emoticons", "?" + query.join("&"));

    const v=state.valence, a=state.arousal, p=state.potency, c=state.contempt, e=state.expression;
    $('#emoticon-svg').html(emoticon_svg(v, a, p, c, e));
}
