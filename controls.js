
const controls=[];
const updates={}
var i = 0;
while (i < emoticon_data.length) {
    if (typeof emoticon_data[i] == 'string') {
        controls.push([i, emoticon_data[i + 1], emoticon_data[i + 2], emoticon_data[i]]);
        emoticon_data.splice(i, 1);
    } else {
        i++;
    }
}

function controls_svg(X) {
    if (!$('#show-controls').is(':checked')) return '';
    return controls.map((c,i) =>
        '<circle r="3" cx="?" cy="?" fill-opacity="0.1" stroke-width="0.1" stroke="black" onmousedown="dragstart(evt, ?)"/>'
            .replace(/\?/, () => X(emoticon_data[c[0]]))
            .replace(/\?/, () => X(emoticon_data[c[0]+1]))
            .replace(/\?/, () => i))
        .join('');
}

function dragstart(event, index) {
    console.log(controls[index][3])
    const m= event.target.getScreenCTM().inverse();
    const drag= (event) => {
        const x= event.clientX * m.a + m.e;
        const y= event.clientY * m.d + m.f;
        emoticon_data[controls[index][0]]= [x, 0, 0, 0];
        emoticon_data[controls[index][0]+1]= [y, 0, 0, 0];
        refresh()
    };
    const dragend= () => {
        window.removeEventListener('mousemove', drag);
        window.removeEventListener('mouseup', dragend);
        Promise.all([
            $.ajax({
                url: "http://localhost:5555/update",
                type: "POST",
                data: JSON.stringify({
                    current: controls[index][1],
                    position: [v, a, p],
                    target: emoticon_data[controls[index][0]][0]
                }),
                dataType: "json",
                contentType: 'application/json'
            }),
            $.ajax({
                url: "http://localhost:5555/update",
                type: "POST",
                data: JSON.stringify({
                    current: controls[index][2],
                    position: [v, a, p],
                    target: emoticon_data[controls[index][0] + 1][0]
                }),
                dataType: "json",
                contentType: 'application/json'
            })
        ]).then((result) => {
            updates[controls[index][3]]= {x: result[0], y:result[1]};
            controls[index][1] = result[0]
            controls[index][2] = result[1]
        }, (error) => {
            console.log('resetting')
        }).then(() => {
            emoticon_data[controls[index][0]]= controls[index][1]
            emoticon_data[controls[index][0]+1]= controls[index][2]
            refresh()
        })
    };
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', dragend);
}

function save() {
    $.ajax({
        url: "http://localhost:5555/save",
        type: "POST",
        data: JSON.stringify(updates),
        dataType: "json",
        contentType: 'application/json'
    })
}