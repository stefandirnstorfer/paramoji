
const controls={};
var i = 0;
while (i < emoticon_data.length) {
    let key= emoticon_data[i];
    if (typeof key == 'string') {
        let m= key.match(/([^:]*)(:.*)?(#.*)/);
        if (m) {
            controls[key] = {
                index: i,
                x: emoticon_data[i + 1],
                y: emoticon_data[i + 2],
                show: m[1] == "",
                dirty: false,
                preview(x, y) {
                    this.dirty = true;
                    emoticon_data[this.index] = [x, 0, 0, 0];
                    emoticon_data[this.index + 1] = [y, 0, 0, 0];
                    this.mirrors.forEach(mirror => mirror.preview(50 - x, y))
                },
                persist(x, y) {
                    this.x = x;
                    this.y = y;
                    this.mirrors.forEach(mirror => mirror.persist([50 - x[0], -x[1], -x[2], -x[3]], [y[0], y[1], y[2], y[3]]))
                },
                commit() {
                    emoticon_data[this.index] = this.x;
                    emoticon_data[this.index + 1] = this.y;
                    this.mirrors.forEach(mirror => mirror.commit())
                },
                mirrors: []
            };
            if (m[1] == "mirror") {
                controls[m[3]].mirrors.push(controls[key])
            }
        }
        emoticon_data.splice(i, 1);
    } else {
        i++;
    }
}

function controls_svg(X) {
    var result='';
    if ($('#show-controls').is(':checked')) {
        var filter = $('#controls-filter').val()
        console.log(filter)
        for (key in controls) {
            var c = controls[key];
            if (c.show && key.includes(filter)) {
                result = result +
                    '<circle r="1" cx="?" cy="?" transform="translate(?) rotate(?)" fill="skyblue" fill-opacity="0.5" stroke-width="0.25" stroke="black" onmousedown="dragstart(evt, \'?\')"/>'
                        .replace(/\?/, X(emoticon_data[c.index]))
                        .replace(/\?/, X(emoticon_data[c.index + 1]))
                        .replace(/\?/, key.match(/right-eye-outline|lid-shadow/) ? "160," + X(emoticon_data[1]) : "0,0")
                        .replace(/\?/, key.match(/right-eye-outline/) ? X(emoticon_data[2]) : 0)
                        .replace(/\?/, key);
            }
        }
    }
    return result;
}

function dragstart(event, key) {
    console.log(key)
    const m= event.target.getScreenCTM().inverse();
    const drag= (event) => {
        const x= event.clientX * m.a + event.clientY * m.c + m.e;
        const y= event.clientX * m.b + event.clientY * m.d + m.f;
        controls[key].preview(x,y);
        refresh()
    };
    const position = [state.valence/50-1, state.arousal/50-1, state.potency/50-1, state.contempt/100];
    const dragend= async () => {
        window.removeEventListener('mousemove', drag);
        window.removeEventListener('mouseup', dragend);
        try {
            const result= await Promise.all([
                $.ajax({
                    url: "http://localhost:5555/update",
                    type: "POST",
                    data: JSON.stringify({
                        current: controls[key].x,
                        position: position,
                        target: emoticon_data[controls[key].index][0]
                    }),
                    dataType: "json",
                    contentType: 'application/json'
                }),
                $.ajax({
                    url: "http://localhost:5555/update",
                    type: "POST",
                    data: JSON.stringify({
                        current: controls[key].y,
                        position: position,
                        target: emoticon_data[controls[key].index + 1][0]
                    }),
                    dataType: "json",
                    contentType: 'application/json'
                })]);
            controls[key].persist(result[0], result[1])
        } catch(e) {
            console.log('resetting')
        }
        controls[key].commit();
        await normalize();
    };
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', dragend);
}

async function normalize() {
    console.log("Normalizing")
    const data= await $.ajax({
        url: "http://localhost:5555/normalize",
        type: "POST",
        data: JSON.stringify(controls),
        dataType: "json",
        contentType: 'application/json'
    });
    for (key in data) {
        if (key.match(/^#/)) {
            controls[key].persist(data[key].x, data[key].y);
            controls[key].commit()
        }
    }
    refresh()
}

function save() {
    $.ajax({
        url: "http://localhost:5555/save",
        type: "POST",
        data: JSON.stringify(controls),
        dataType: "json",
        contentType: 'application/json'
    })
}
