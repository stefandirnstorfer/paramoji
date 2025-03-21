import fs from 'fs'
import { paramoji_svg, dark_mode, unique_id, unwrap } from '../web/paramoji.js'
import { execSync } from "child_process"

const start = [70,40,10,50,0,0,0,0]

function bilin(t, a, b) {
    return a.map((v, i) => v*(1-t) + b[i]*t)
}

function randomize(x, mean, sigma_f=1, clip) {
    const alpha = 0.3
    const sigma = 70 * sigma_f
    let newX = x * (1-alpha) + mean * alpha
    newX += sigma * Math.random()
    newX -= sigma * Math.random()
    if (clip) newX = Math.max(0, newX)
    return newX
}

function randomizeParams(params, sigma) {
    const means = [50, 40, 10, 50, 0]
    const clip = [false, true, true, false, true, true, true, true]
    return params.map((x,i) => randomize(x, means[i] || 0, sigma, clip[i]))
}

function paramoji_in_view(params) {
    const roundedParams = params.map(x => Math.round(x*64/100)/64)
    console.log('params', ...roundedParams)
    return unwrap(unique_id(paramoji_svg(...roundedParams)))
}

function paramoji_recursive(params, depth) {
    const scale = 0.33
    let svg= ''
    if (depth >0) {
        const childParams= {0: [[],[],[]], 1: [[],[],[]], 2: [[],[],[]]}
        childParams[1][0] = randomizeParams(params)
        childParams[1][2] = randomizeParams(params)
        childParams[0][1] = randomizeParams(params)
        childParams[2][1] = randomizeParams(params)
        childParams[0][0] = randomizeParams(bilin(0.5, childParams[0][1], childParams[1][0]), 0.8)
        childParams[0][2] = randomizeParams(bilin(0.5, childParams[0][1], childParams[1][2]), 0.8)
        childParams[2][0] = randomizeParams(bilin(0.5, childParams[2][1], childParams[1][0]), 0.8)
        childParams[2][2] = randomizeParams(bilin(0.5, childParams[2][1], childParams[1][2]), 0.8)
        for (let i of [0,1,2]) {
            for (let j of [0,1,2]) {
                if (i!=1 || j!=1) {
                    const v=[(i-1)*100, (j-1)*100]
                    const newParams = childParams[i][j]
                    svg += `<g opacity="1" transform="scale(${scale}) translate(${v[0]},${v[1]})">\n`
                    svg += paramoji_recursive(newParams, depth-1)
                    svg += '</g>\n'
                }
            }
        }
    }
    let e = paramoji_in_view(params)
    if (depth==0) {
        const r = Math.floor(10*Math.random()).toString().padStart(2, '0')
        svg += `<image href="./cache/square_${r}.png" opacity="0.7" x="-50" y="-50" width="100" height="100"/>`
    } else {
        svg += `<g transform="scale(0.8) translate(-50,-50)">\n${e}</g>/n`
    }
    return svg
}

const height=100
const width=100

function createSVG(params, depth) {
    let svg = `<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${width} ${height}">\n`
    svg += '<rect width="'+width+'" height="'+height+'" fill="white"/>\n'
    svg += '<g transform="translate('+width/2+','+height/2+')">\n'
    svg += paramoji_recursive(params, depth)
    svg += '</g>\n'
    svg += '</svg>\n'
    return svg
}


function makeLeaves() {
    for (let i=0; i<10; ++i) {
        const istr = i.toString().padStart(2, '0')
        const params= randomizeParams(randomizeParams(start))
        fs.writeFileSync('emotions.svg', createSVG(params, 2))
        execSync('inkscape emotions.svg --export-width=100 --export-filename=cache/square_'+istr+'.png')
    }
}

//makeLeaves()
fs.writeFileSync('emotions.svg', createSVG(start, 2))
