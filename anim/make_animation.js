import { paramoji_blink_svg, dark_mode } from "../web/paramoji.js"
import fs from "fs"
import { execSync } from "child_process"

const all_paths= JSON.parse(fs.readFileSync('/tmp/path.json'))

function getArray(a) {
    if (Array.isArray(a.params)) return a.params;
    const state = {
        blink: 0,
        v: 50,
        a1: 50,
        a2: 50,
        d: 50,
        g: 0,
        c: 0,
        b: 0
    }
    a = a.replace(/^[^?]*\?/, '')
    for (let key in state) {
        var m= a.match(RegExp(key + "=([-0-9]+)"));
        if (m) state[key]= parseFloat(m[1]);
    }
    return Object.values(state).map(parseFloat)
}

function getParams(data, t) {
    let index=0
    let params = data[0].params
    let prev = params
    while (data[index].t < t) {
        index++
        prev = params
        if (index >= data.length) {
            break
        }
        params = data[index].params || params
    }
    const t1 = data[index].t
    if (index > 0 && t1 > t) {
        const t0 = data[index-1].t
        const p1 = getArray(params)
        const p2 = getArray(prev)
        params = p1.map((a,i) => Math.round((a*(t-t0) + p2[i]*(t1-t))/(t1-t0)))
    } else {
        params = getArray(params)
    }
    return params
}

const parentFolder = all_paths.folder + "/" + all_paths.name + "_paramojis";
console.log("Creating Paramojis in folder ", parentFolder)
if (!fs.existsSync(parentFolder)) { fs.mkdirSync(parentFolder); }
if (!fs.existsSync('cache')) { fs.mkdirSync('cache'); }

function generateParamoji(paramoji_name, params, no) {
    let svg = paramoji_blink_svg.apply(null, params.map(x => x/100))
    svg = dark_mode(svg).replace("5px", "5")
    let cachename = 'cache/'+params.join('_')+'.png'
    if (!fs.existsSync(cachename)) {
        console.log(paramoji_name, no, params.join('_'))
        svg = svg
            .replace(/width="100%"/,'width="256"')
            .replace(/height="100%"/,'height="256"')
        fs.writeFileSync('frame.svg', svg)
        execSync('inkscape frame.svg --export-filename='+cachename)
        fs.unlinkSync('frame.svg')
    }
    const nos= no.toString()
    const padded = '0000'.substring(nos.length)+nos
    const outname = parentFolder + '/' + paramoji_name + '/frame_'+padded+'-x.png'
    fs.copyFileSync(cachename, outname)
}

for (let paramoji_name in all_paths.paths) {
    console.log("Paramoji", paramoji_name)
    if (!fs.existsSync(parentFolder+'/'+paramoji_name)) { fs.mkdirSync(parentFolder+'/'+paramoji_name); }
    const data= all_paths.paths[paramoji_name]
    const T = data[data.length-1].t
    for(let t of data.map(e => e.t)) {
        const params = getParams(data, t)
        generateParamoji(paramoji_name, params, t)
    }
}
//execSync('convert -delay 5 frames/frame* out.gif')
//execSync('ffmpeg  -r 25 -i frames/frame_%04d.png -c:v libx264 -framerate 24.95 -y out.mp4')
