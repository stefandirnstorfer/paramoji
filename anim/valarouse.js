const fs = require('fs')
const emoji = require('../doc/emoticon.js')

const cols=3, path=[
    { params: [0, 100, 100, 50, 0], text: '0ff' },
    { params: [50, 100, 100, 50, 0], text: '8ff'},
    { params: [100, 100, 100, 50, 0], text: 'fff'},
    { params: [0, 50, 50, 50, 0], text: '088'},
    { params: [50, 50, 50, 50, 0], text: '888'},
    { params: [100, 50, 50, 50, 0], text: 'f88'},
    { params: [0, 0, 0, 50, 0], text: '000'},
    { params: [50, 0, 0, 50, 0], text: '800'},
    { params: [100, 0, 0, 50, 0], text: 'f00'},
]

const width = 100*cols
const height = 100 * Math.ceil(path.length/cols)
let svg = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'">\n'
for (let i=0; i<path.length; ++i) {
    const params = path[i].params
    const id_prefix = path[i].text.toLowerCase()
    const e = emoji.emoticon_svg(params[0],params[1],params[2], params[3],params[4],1)
        .replace(/<\/?svg[^>]*>/g,'')
        .replace(/href="#/g,"href=\"#id-"+id_prefix+"-")
        .replace(/\(#/g,"(#id-"+id_prefix+"-")
        .replace(/id="/g,"id=\"id-"+id_prefix+"-")
    const x= (i % cols) * 100, y=Math.floor(i / cols)*100
    svg += '<g transform="translate('+x+','+y+')">\n'
    svg += e+'</g>\n'
}
svg += '</svg>\n'
fs.writeFileSync('emotions.svg', svg)
