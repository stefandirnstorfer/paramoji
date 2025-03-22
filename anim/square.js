import fs from 'fs'
import { paramoji_svg, dark_mode, unique_id, unwrap } from '../web/paramoji.js'
import { pointsToSmoothSvgPath, pngToDataUrl } from './utils.js'
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
    return unwrap(unique_id(paramoji_svg(...roundedParams)))
}

function paramoji_recursive(params, sequence) {
    const scale = 0.33
    let svg= ''
    const [x0,y0] = offset(sequence)
    if (sequence.length >0) {
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
                const isActive = (i + 3*j) + 1 == sequence[0]
                const tailSeq = isActive || sequence[0] == 0 ? sequence.slice(1) : [0,0]
                if (i!=1 && j!=1) {
                    const v=isActive ? [0,0] : [i-1-x0, j-1-y0]
                    const newParams = childParams[i][j]
                    svg += `<g opacity="1" transform="scale(${scale}) translate(${v[0]*100},${v[1]*100})">\n`
                    svg += paramoji_recursive(newParams, tailSeq)
                    svg += '</g>\n'
                }
            }
        }
    }
    let e = paramoji_in_view(params)
    const [x1,y1] = [-100/3*x0, -100/3*y0]
    if (sequence.length == 0) {
        const r = Math.floor(10*Math.random())
        svg += `<use href="#png-${r}" x="${x1-50}" y="${y1-50}"/>`
    } else {
        svg += `<g transform="translate(${x1},${y1}) scale(0.8) translate(-50, -50)">\n${e}</g>\n`
        // + `<text x="-15" y="15" fill="red">${sequence[0]}</text>\n`
    }
    return svg
}

function offset(tailSeq) {
    let zoom = 1
    let [x,y] = [0,0]
    for (let i in tailSeq) {
        if (tailSeq[i]>0) {
            x += (((tailSeq[i]-1) % 3)-1)/zoom
            y += (Math.floor((tailSeq[i] -1) / 3) -1)/zoom
        }
        zoom *= 3
    }
    return [x,y]
}

function zoomPath(svg, sequence) {
    const timePerFrame= 1
    let [x0,y0] = offset(sequence)
    return `<g transform="translate(${x0*100/3},${y0*100/3})">\n`
      + `<animateMotion\n`
      + `  path="${pointsToSmoothSvgPath(sequence.map((_,i) => {
            const tail = sequence.slice(i)
          const [x,y] = offset(tail)
          return {x: 100*(x-x0)/3, y: 100*(y-y0)/3}
        }))}"\n` +
      `  dur="${timePerFrame * sequence.length}s" repeatCount="indefinite"/>\n`
    + `<animateTransform\n` +
      `  attributeName="transform"\n` +
      `  type="scale"\n` +
      `  values="${sequence.map((_,i) => Math.pow(3,i)).join(';')}"\n` +
      `  dur="${timePerFrame * sequence.length}s" repeatCount="indefinite"\n` +
      `  calcMode="spline"\n` +
      `  keySplines="${sequence.slice(1).map(_ => '.3 .2 .7 .45').join(';')}"`+
      `  fill="freeze" additive="sum"/>\n`
      + svg + `</g>\n`
}


function createSVG(params, sequence) {
    let svg = `<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="-50 -50 100 100">\n`
    svg += '<defs>\n'
    for (let i=0; i<10; ++i) {
        const r= i.toString().padStart(2,'0')
        const data=pngToDataUrl('./cache/square_'+ r + '.png')
        svg += `<image id="png-${i}" href="${data}" opacity="1" width="100" height="100"/>\n`
    }
    svg += '</defs>\n'
    let e = paramoji_recursive(params, sequence)
    e = zoomPath(e, sequence)
    svg += e
    svg += '</svg>\n'
    return svg
}

function makeLeaves() {
    for (let i=0; i<10; ++i) {
        const istr = i.toString().padStart(2, '0')
        const params= randomizeParams(randomizeParams(start))
        fs.writeFileSync('emotions.svg', createSVG(params, [0,0]))
        execSync('inkscape emotions.svg --export-width=100 --export-filename=cache/square_'+istr+'.png')
    }
}

function wrapHTML(svg) {
    return `<!DOCTYPE html><html><head><style>body { margin: 0 } svg { height: 100vh } </style></head><body>${svg}</body></html>`
}

makeLeaves()
const seq = []
for (let i=0; i<30; ++i) seq.push([1,3,7,9][Math.floor(Math.random()*4)])
seq.push(5)
fs.writeFileSync('fraktal.svg', createSVG(start, seq))
