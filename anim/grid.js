import fs from 'fs'
import { paramoji_svg, dark_mode } from '../web/paramoji.js'

const cols= 6
const rows= 6
const topLeft = [20,70,20,120,20,0,0]
const topRight = [20,20,0,30,20,40,0]
const bottomLeft = [70,50,50,20,0,0,0]
const bottomRight = [100,0,80,70,0,30,0]

function bilin(t, a, b) {
    return a.map((v, i) => v*(1-t) + b[i]*t)
}

const cellHeight = 75, cellWidth = 80
const width = cellWidth * (cols -1) + 100
const height = cellHeight * (rows -1) + 100
let svg = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'">\n'
svg += '<rect width="'+width+'" height="'+height+'" fill="black"/>\n'
for (let row=0; row<rows; ++row) {
    for (let col=0; col<cols; ++col) {
        const t1 = row/(rows-1),
            t2 =col/(cols-1)
        const params = bilin(t1,
            bilin(t2, topLeft, topRight),
            bilin(t2, bottomLeft, bottomRight)
        )
        const id_prefix = row+","+col+":"
        let e = paramoji_svg(...params.map(x => x/100))
            .replace(/<\/?svg[^>]*>/g,'')
            .replace(/href="#/g,"href=\"#id-"+id_prefix+"-")
            .replace(/\(#/g,"(#id-"+id_prefix+"-")
            .replace(/id="/g,"id=\"id-"+id_prefix+"-")
        e = dark_mode(e)
        const x= col * cellWidth, y=row*cellHeight
        svg += '<g transform="translate('+x+','+y+')">\n'
        svg += e + '</g>\n'
    }
}
svg += '</svg>\n'
fs.writeFileSync('emotions.svg', svg)
