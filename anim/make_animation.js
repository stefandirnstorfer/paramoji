const fs = require('fs')
const emoji = require('../doc/emoticon.js')
const execSync = require('child_process').execSync

const path=[
    { t:    0, params: [55,47,0,45,0], text: "Normal"},
    { t:    0.5+1.5},
    { t:    1.5+1.5, params: [100,31,50,55,0], text: "Happy"},
    { t:    2+1.5 },
    { t:    3+1.5, params: [3,27,0,13,0], text: "Sad"},
    { t:    4+1.5},
    { t:    4.5+1.5, params: [84,90,94,8,0], text: "Surprised"},
    { t:    5+1.5 },
    { t:    6+1.5, params: [31,70,40,0,0], text: "Fearful"},
    { t:    6.5+1.5},
    { t:    7.5+1.5, params: [0,34,64,94,70], text: "Disgusted"},
    { t:    8+1.5},
    { t:    9+1.5, params: [27,78,0,77,0], text: "Angry"},
    { t:    9.5+1.5 },
    { t:    10.5+1.5, params: [60, 51,0,69,100], text: "Contemptuous"},
    { t:    11+1.5},
    { t:    12+1.5, params: [55,47,0,45,0]}
]

function getParams(t) {
    let index=0
    let params = path[0].params
    let prev = params
    let text = path[0].text
    while (path[index].t < t) {
        index++
        prev = params
        params = path[index].params || params
        if (path[index].t <= t)
            text = path[index].text || text
    }
    const t1 = path[index].t
    if (t1 > t) {
        const t0 = path[index-1].t
        params = params.map((a,i) =>
            (a*(t-t0) + prev[i]*(t1-t))/(t1-t0))
    }
    return {text, params}
}

if (!fs.existsSync('frames')) {
    fs.mkdirSync('frames');
}
const T = path[path.length-1].t
const fps = 10
for(let t=0; t < T*fps; ++t) {
    console.log('time:', t/fps)
    const {text, params} = getParams(t/fps)
    let svg = emoji.emoticon_svg(params[0],params[1],params[2], params[3],params[4],1)
    svg = svg
        .replace(/width="100%"/,'width="256"')
        .replace(/height="100%"/,'height="256"')
        .replace(/viewBox="[^"]*"/,'viewBox="0 0 100 110"')
        .replace(/<\/svg>/,'')
        + '<text x="50" y="107" text-anchor="middle">' + text + '</text>'
        + '</svg>'
    fs.writeFileSync('frame.svg', svg)
    let no=t.toString()
    no = '0000'.substr(no.length)+no
    execSync('inkscape frame.svg -b FFFFFF --export-filename=frames/frame_'+no+'.png')
}
fs.unlinkSync('frame.svg')
execSync('convert -delay 5 frames/frame* anim.gif')