const fs = require('fs')
const emoji = require('../doc/emoticon.js')

center = [50,50,50,50,0]

cols= 6
rows= 4
dim1 = [100, 0, 0, 0, 0]
dim2 = [0, 0, 0, 100, 0]

function lin(x, y, z, cy, cz) {
    return x.map((a,i) => a + y[i]*(cy) + z[i]*(cz))
}

const width = 100 * cols
const height = 100 * rows
let svg = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'">\n'
for (let row=0; row<rows; ++row) {
    for (let col=0; col<cols; ++col) {
        const params = lin(
            center, dim1, dim2,row/(rows-1)-.5,col/(cols-1)-.5
        )
        const id_prefix = row+","+col+":"
        const e = emoji.emoticon_svg(params[0],params[1],params[2], params[3],params[4],1)
            .replace(/<\/?svg[^>]*>/g,'')
            .replace(/href="#/g,"href=\"#id-"+id_prefix+"-")
            .replace(/\(#/g,"(#id-"+id_prefix+"-")
            .replace(/id="/g,"id=\"id-"+id_prefix+"-")
            //.replace(/(<(?!rect id="tooth")[^>]*) stroke="black"/g, '$1 stroke="white"')
        const x= col * 100, y=row*100
        svg += '<g transform="translate('+x+','+y+')">\n'
        svg += e+'</g>\n'
    }
}
svg += '</svg>\n'
fs.writeFileSync('emotions.svg', svg)
