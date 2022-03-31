const cols=4, path=[
    { params: [55,47,0,45,0], text: "Normal"},
    { params: [100,31,50,55,0], text: "Happy"},
    { params: [3,27,0,13,0], text: "Sad"},
    { params: [84,90,94,8,0], text: "Surprised"},
    { params: [31,70,40,0,0], text: "Fearful"},
    { params: [0,34,64,94,70], text: "Disgusted"},
    { params: [27,78,0,77,0], text: "Angry"},
    { params: [60, 51,0,69,100], text: "Contemptuous"},
]

const fs = require('fs')
const emoji = require('../doc/emoticon.js')
const width = 100*cols
const height = 120 * Math.ceil(path.length/cols)
let svg = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'">\n'
for (let i=0; i<path.length; ++i) {
    const params = path[i].params
    const id_prefix = path[i].text.toLowerCase()
    const e = emoji.emoticon_svg(params[0],params[1],params[2], params[3],params[4],1)
        .replace(/<\/?svg[^>]*>/g,'')
        .replace(/href="#/g,"href=\"#id-"+id_prefix+"-")
        .replace(/\(#/g,"(#id-"+id_prefix+"-")
        .replace(/id="/g,"id=\"id-"+id_prefix+"-")
    const x= (i % cols) * 100, y=Math.floor(i / cols)*120
    svg += '<g transform="translate('+x+','+y+')">\n'
    svg += '  <text x="50" y="112" style="text-anchor:middle;font-size:10px;font-family:Arial;fill:black"><tspan>' + id_prefix + '</tspan></text>'
    svg += e+'</g>\n'
}
svg += '</svg>\n'
fs.writeFileSync('emotions.svg', svg)
