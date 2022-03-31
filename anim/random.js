const fs = require('fs')
const emoji = require('../doc/emoticon.js')

const cols = 4

const width = 100*cols
const height = 100 * Math.ceil(16/cols)
let svg = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'">\n'
for (let i=0; i < 16; ++i) {
    const params = [
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.max(0, Math.random()*2-1) * 100,
    ]
    const id_prefix = i.toString(16)
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
