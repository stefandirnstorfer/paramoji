var v, a, p;
$(function () {
    $('input').bind('input', refresh);
    $('input').bind('change', refresh);
    $('#version-2').attr('checked', sessionStorage.getItem('#version-2'));
    $('#version-1').attr('checked', sessionStorage.getItem('#version-2') ? sessionStorage.getItem('#version-1') : 'checked');
    setParam(qparam('v'), qparam('a'), qparam('p'));
});

function qparam(name) {
    var m= location.search.match(RegExp(name + "=([0-9]+)"));
    return m ? parseInt(m[1]) : 50;
}

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

    window.history.replaceState({}, "Emoticons", "?v="+v.toFixed()+"&a="+a.toFixed()+"&p="+p.toFixed());
    drawEmoticon(v, a, p);
}

function drawEmoticon(v, a, p) {
    emoticon = $('#emoticon div').each((i,c) => {
        var key= $(c).attr("data-if");
        if ($(key).is(':checked')) {
            $(c).show();
            sessionStorage.setItem(key, 'checked');
            $(c).html(eval($(c).attr("data-content")))
        } else {
            sessionStorage.removeItem(key);
            $(c).hide();
        }
    });
}

var oldtime = undefined;

function runAnimation(dv, da, dp) {
    var now = new Date().getTime();
    if (!oldtime) oldtime = now;
    var speed = parseFloat($('#slider-speed').val());
    var dt = (now - oldtime) * speed / 200;
    if ($('#animate').is(':checked')) {
        if (dt > 5) {
            oldtime = now;
            var decay = 0.1;
            dv = decay * (Math.random() - .5) * Math.sqrt(dt) + (1 - decay) * dv;
            da = decay * (Math.random() - .5) * Math.sqrt(dt) + (1 - decay) * da;
            dp = decay * (Math.random() - .5) * Math.sqrt(dt) + (1 - decay) * dp;
            var map = function (x) {
                return x > 100 ? 100 : (x < 0 ? 0 : x);
            };
            setParam(map(v + dv * dt), map(a + da * dt), map(p + dp * dt), true);
            if (v <= 0 || v >= 100) dv = 0;
            if (a <= 0 || a >= 100) da = 0;
            if (p <= 0 || p >= 100) dp = 0;

        }
        window.requestAnimationFrame(function () {
            runAnimation(dv, da, dp);
        });
    } else {
        oldtime = undefined;
    }
}
