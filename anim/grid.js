import fs from 'fs'
import { paramoji_svg, dark_mode } from '../web/paramoji.js'

const cols= 6
const rows= 6
const bottomLeft = [20,70,20,120,20,0,0]
const bottomRight = [20,20,0,30,20,40,0]
const topLeft = [70,50,50,20,0,0,0]
const topRight = [100,0,80,70,0,30,0]

function bilin(t, a, b) {
    return a.map((v, i) => v*(1-t) + b[i]*t)
}

const cellHeight = 76, cellWidth = 80
const width = cellWidth * cols
const height = cellHeight * rows
let svg = `<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="100%" heigth="100%" viewBox="0 0 ${width} ${height}">\n`
for (let row=0; row<rows; ++row) {
    for (let col=0; col<cols; ++col) {
        const x= col * cellWidth, y=row*cellHeight
        const color = (row+col)%2 ? 'white' : 'black'
        svg += `<rect x="${x}" y="${y}" width="${cellWidth}" height="${cellHeight}" fill="${color}"/>\n`
        let t1 = row/(rows-1),
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
        if (color=='black') e = dark_mode(e)
        svg += `<g transform="translate(${x-10},${y-17})">\n`
        svg += e + '</g>\n'
    }
}
svg += '</svg>\n'
fs.writeFileSync('checkers.svg', svg)
