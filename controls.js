
const controls={};
const displacements={};
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
                },
                persist(dx, dy) {
                    let current = displacements[key] ? displacements[key] : [0,0]
                    current[0] += dx
                    current[1] += dy
                    displacements[key] = current
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

$(() => $('#controls-filter:text').val( sessionStorage.getItem('filter')))

function controls_svg(X) {
    var result='';
    if ($('#show-controls').is(':checked')) {
        const filter = $('#controls-filter').val()
        sessionStorage.setItem('filter', filter)
        for (key in controls) {
            var c = controls[key];
            if (c.show && key.includes(filter)) {
                result = result +
                    '<circle r="1" cx="?" cy="?" transform="?" fill="skyblue" fill-opacity="0.5" stroke-width="0.25" stroke="black" onmousedown="dragstart(evt, \'?\')"/>'
                        .replace(/\?/, X(emoticon_data[c.index]))
                        .replace(/\?/, X(emoticon_data[c.index + 1]))
                        .replace(/\?/, displacement(key, X))
                        .replace(/\?/, key);
            }
        }
    }
    return result;
}

function displacement(key, X) {
    const m = key.match(/.*#([^:]+)/)
    if (m) {
        const root = document.getElementsByTagName("svg").item(0)
        const elt = document.getElementById(m[1])
        const ctm = root.getCTM().inverse().multiply(elt.getCTM())
        return('matrix('+ctm.a+','+ctm.b+','+ctm.c+','+ctm.d+','+ctm.e+','+ctm.f+')')
    }
    return ""
}

function dragstart(event, key) {
    console.log(key)
    const m= event.target.getScreenCTM().inverse();
    const x0= event.clientX * m.a + event.clientY * m.c + m.e;
    const y0= event.clientX * m.b + event.clientY * m.d + m.f;
    const drag= (event) => {
        const x= event.clientX * m.a + event.clientY * m.c + m.e;
        const y= event.clientX * m.b + event.clientY * m.d + m.f;
        controls[key].preview(x,y);
        refresh()
    };
    const position = [state.valence/50-1, state.arousal/50-1, state.potency/50-1, state.contempt/100];
    const dragend= async (event) => {
        window.removeEventListener('mousemove', drag);
        window.removeEventListener('mouseup', dragend);
        const x= event.clientX * m.a + event.clientY * m.c + m.e;
        const y= event.clientX * m.b + event.clientY * m.d + m.f;
        controls[key].persist(x-x0, y-y0);
        showDisplacements()
    };
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', dragend);
}

function showDisplacements() {
    console.log(JSON.stringify(displacements,null,2))
    let html=""
    for (key in displacements) {
        html += "<tr><td>" + key
            + "</td><td style='text-align:right'>" + displacements[key][0].toFixed(2)
            + "</td><td style='text-align:right'>" + displacements[key][1].toFixed(2)
            + "</td></tr>"
    }
    $('#moves').html(html)
}
