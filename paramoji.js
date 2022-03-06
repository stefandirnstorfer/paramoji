let x=1, y=1, z=-1
let emoticon_data=[
    // eyes vertical
    [ 51, -2,-10,  0, 0, 0, 0, 0],
    // right eye
    [  0, 22,  0,-26],
    "#right-eye-outline:6a", /* -8 */       [  0,  0,-11],
    "#right-eye-outline:1a", [ -8,  0, -8], [  0,  0, -4],
    "#right-eye-outline:1b", [ -8,  0, -8], [  0,  0,  2],
    "#right-eye-outline:2",  [ -8,  0, -3], [  0,  0,  9],
    "#right-eye-outline:3a", [ -4,  0,  1], [  0, -6, 13],
    "#right-eye-outline:3b", [  5,  0, 12], [  0, -9,  11],
    "#right-eye-outline:4",  [ 11,  0,  8], /* 0 */
    "#right-eye-outline:5a", [  5,  0, 12], [  0, -9, -11],
    "#right-eye-outline:5b", [ -4,  0,  5], [  0, -6,-13],
    "#right-eye-outline:6",  /* -8 */       [  0,  0,-11],
    // left-lens
    [  0,  0,  0, -1], [  0, -2,  0, -1],// #left-lens
    [0.5,  0,  4], // #pupil[radius]
    // right-lid-shadow
    "#right-lid-shadow:2", [  5,  1, -4,  8], [  2,-9,-17,  5],
    // left-eye-outline
    [  0, -22,  0, 26, -10, 0, 20],
    "#left-eye-outline:6a", /*  8  */       [  0,  0, -11, 0, 0, 10],
    "#left-eye-outline:1a", [  8,  0,  8,  0, 0, -6], [  0,  0,  -4, 0, 0, 4],
    "#left-eye-outline:1b", [  8,  0,  8,  0, 0, -6], [  0,  0,   2, 0, 0, -2],
    "#left-eye-outline:2",  [  8,  0,  3,  0, 0, -2], [  0,  0,   9, 0, 0, -9],
    "#left-eye-outline:3a", [  4,  0,  -1], [  0, -6, 13, 0, -3, -12, 6],
    "#left-eye-outline:3b", [ -5,  0, -12], [  0, -9, 11, 0, -5, -8, 10],
    "#left-eye-outline:4",  [-11,  0,  -8],
    "#left-eye-outline:5a", [ -5,  0, -12], [  0, -9,-11, 0, -5, 9, 10],
    "#left-eye-outline:5b", [  4,  0,  -5], [  0, -6, -13, 0,-3, 12, 6],
    "#left-eye-outline:6b", /*  8  */       [  0,  0, -11, 0, 0, 10],
    // right-eye
    [0,  0,  0,  2],
    // left-lid-shadow
    "#left-lid-shadow:2", [2,  1,-10, -6,  3], [  2, -9,-17,  4, 20],
    // nose-path
    "nose",
    [  0,  0,  0,  0, .4],
    [  70, -2, -10, -1, 0, 0, 0, 1], // nose height
    "#nose:5", /* 6 */           [ -3,  0, 1,  0],
    "#nose:8", /*  4 */          [ -14, -2, 6,  2],
    // wrinkle-cheek
    "#wrinkle-left-cheek:1",  [ 25, -2, -6,  4, -7, 0, 0], [ 77, -10, -2,  0,  -1],
    "#wrinkle-left-cheek:2",  [ 29,  0, -3,  4, -9, 0, 0], [ 76, -4, -8, -1, -17, -1, 1, 1],
    "#wrinkle-left-cheek:3",  [ 37, -2, -2,  4,  3],       [ 68, -3, -9, -4,  -5,  -1, 2, 0, 2],
    "#wrinkle-right-cheek:1", [ 75,  2,  6, -4],           [ 77, -10, -2,  0,  0],
    "#wrinkle-right-cheek:2", [ 71,  0,  3, -3],           [ 76, -4, -8, -1,  0],
    "#wrinkle-right-cheek:3", [ 63,  2,  2, -2],           [ 68, -3, -9, -4],
    // teeth
    "lower-teeth", [ 80,  4,  6, -6,  0, 0, 0, -2],
    "upper-teeth", [ 65,  1, -5, -1,  0, 0, 0, -2],
    // mouth
    "#mouth:1",         [14,0,  9,-2],  [0,-12, -2,  0, -3,   0, 6, -2],
    "#mouth:2",         [10,0, 11,-3],  [0, -2, 11,  0,  0,   0, 0, -9],
    "#mouth:3",         [ 6,0,  6,-3],   [0,  2, 12,  0,  0,   0, 0, -5],
    "mouth:center-dwn", /*50*/,         [0,  2, 12,  0,  0,   0, 0, -4],
    "mirror:2#mouth:2", [-10,0,-11, 3], [0, -2, 11,  0,  0,   0, 0, -2],
    "mirror:1#mouth:1", [-14,0, -9, 2], [0,-12, -2,  0, -3,   0, 6,  2],
    "#mouth:6",         [-10,0,-11, 3], [0, -2,-11,  0,  0,   0, 0, -5],
    "#mouth:7",         [-6,0, -6, 3],  [0,  2,-12,  0,  0,   0, 0, -3],
    "mouth:center-up",  /*50*/          [0,  2,-12,  0,  0,   0, 0, -1],
    "mirror#mouth:6",   [10,0, 11,-3],  [0, -2,-11,  0,  0,   0, 0, -2],
    "#mouth:1copy",     [14,0,  9,-2],  [0,-12, -2,  0, -3,   0, 6, -2],
    "lips-sheer", [0, 0, 0, 0, 0.4, 0, 0.15, -0.25],
    "lips-pos", [50,0,  0, 0,-12,0,0,6], [ 80,  0,  0, -2,  -2,   0, 0, 1],
    // left-eye-brow
    "#right-eye-brow:1", [ 60+z,  1+x,  1, -7+y], [ 42, -8,-21, 12],
    "#right-eye-brow:2", [ 72+z,  1+x,  3, -6+y], [ 42,-11,-23,  3],
    "#right-eye-brow:3", [ 80+z,  0+x,  6, -5+y], [ 42, -3,-20, -3],
    "weight", [  2, -.5,  1,  .5], // stroke-width
    // wrinkle-left-brow
    "#wrinkle-right-brow:1", [ 62, -1+x, -4, -3+y], [ 35, -5,-18,  7],
    "#wrinkle-right-brow:2", [ 56,  1+x,  0, -4+y], [ 41, -7,-24,  9],
    "#wrinkle-right-brow:3", [ 56,  0+x,  0, -2+y], [ 43, -8,-22, 10],
    "left-brow", [  0,  0,  0,  0,  1,  3, 2]
    ]

let current_expressability = -1
emoticon_data = emoticon_data.filter(entry => {
    if (typeof(entry)=="string") {
        if (entry=="#right-eye-brow:1") current_expressability= -1
        if (entry.match(/#wrinkle-(left|right)-cheek:3/)) current_expressability = 0.6
        if (entry.match(/#wrinkle-(left|right)-cheek:1/)) current_expressability = 1
        if (entry=="#lips:1") current_expressability = 1
        if (entry=="lower-teeth") current_expressability = 1
        if (entry=="#mouth:1") current_expressability = 1
        if (entry=="nose") current_expressability = 0.5
        return false
    } else {
        const a = entry[2]
        entry[2] = (1 - current_expressability) / 2 * a
        entry.splice(3, 0, (1 + current_expressability) / 2 * a)
        return true
    }
})

function formatRow(row) {
    if (row[1] == -0.5) {
        return "1+w," + row.slice(1).join(',')
    } else {
        return row.join(',')
    }
}
console.log(("const data=["+emoticon_data.map(x => '[' +formatRow(x) + ']').join(',') +"]")
    .replace(/(.{75}[^,]*,)/g, '$1\n'))


function emoticon_svg(v, a, p, c, e) {
    return paramoji_svg(v / 100,
        Math.min(1.0, Math.max(0.0, (a - 2 * e + 100) / 100)),
        Math.min(1.0, Math.max(0.0, (a + 2 * e - 100) / 100)),
        p / 100, c / 100)
}

function paramoji_svg(v, a1, a2, p, c) {
    const dotprod = (X,Y) => X.reduce((a, b, i) => a + b*(Y[i] || 0), 0)
    let data = emoticon_data
        .filter(x => typeof(x) != 'string')
        .map((C, i)=> {
            V= [1, 2*v-1, a1, a2, 2*p-1, c, c*a1, c*v, c*a2, c*p]
            return dotprod(V, C)
        })
    const template= [
        '<svg width="100%" height="100%" viewBox="0 0 100 100">',
        '  <defs>',
        '    <clipPath id="c-eye-r"><use href="#eye-r"/></clipPath>',
        '    <clipPath id="c-eye-l"><use href="#eye-l"/></clipPath>',
        '    <clipPath id="c-lips"><use href="#lips"/></clipPath>',
        '  </defs>',
        '  <g transform="translate(68,?)">',
        '    <path id="eye-r" transform="rotate(?)" d="M -8,? C ?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? -8,? Z" fill="white" stroke="black"/>',
        '    <g clip-path="url(#c-eye-r)">',
        '      <g id="lens" transform="translate(?,?)">',
        '      <circle r="5" fill="#9d4922"/>',
        '      <circle r="?"/>',
        '      <circle r="1" cx="-2.5" cy="-1.5" fill="white"/>',
        '      </g>',
        '      <path d="M -15,-20 H 20 V0 Q ?,? -15,-2 Z" opacity=".25"/>',
        '    </g>',
        '    <g transform="translate(-36,0)">',
        '      <path id="eye-l" transform="rotate(?)" d="M 8,? C ?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? 8,? Z" fill="white" stroke="black"/>',
        '      <g clip-path="url(#c-eye-l)">',
        '        <use href="#lens" x="?"/>',
        '        <path d="M -15,-20 H 15 V-2 Q ?,? -20,0 Z" opacity=".25"/>',
        '      </g>',
        '    </g>',
        '  </g>',
        '  <path transform="matrix(1,?,0,1,53,?)" d="M -4,0 q -2,-2 -4,0 M -1,0 Q 3,-2 4,-1 T 6,? 4,?" fill="none" stroke="black"/>',
        '  <path d="M ?,? Q ?,? ?,?" fill="none" stroke="black"/>',
        '  <path d="M ?,? Q ?,? ?,?" fill="none" stroke="black"/>',
        '  <g clip-path="url(#c-lips)">',
        '    <rect height="100" width="100"/>',
        '    <ellipse cx="50" cy="91" rx="15" ry="10" fill="#800f08"/>',
        '    <g transform="translate(0,?)">',
        '      <use href="#tooth" x="-14"/>',
        '      <use href="#tooth" x="-7"/>',
        '      <use href="#tooth"/>',
        '      <use href="#tooth" x="7"/>',
        '    </g>',
        '    <g transform="translate(0,?)">',
        '      <use href="#tooth" transform="matrix(1,.14,0,1,-14,-8)"/>',
        '      <use href="#tooth" x="-7"/>',
        '      <rect id="tooth" x="50.5" rx="2" ry="1" height="15" fill="white" width="6" stroke="black" stroke-width=".5"/>',
        '      <use href="#tooth" transform="matrix(1,-.14,0,1,7,7)"/>',
        '    </g>',
        '  </g>',
        '  <path id="lips" d="M ?,? C ?,? ?,? 0,? S ?,? ?,? C ?,? ?,? 0,? S ?,? ?,? Z" transform="matrix(1,?,0,1,?,?)" fill="none" stroke="black"/>',
        '  <g id="brow-r">',
        '    <path d="M ?,? Q ?,? ?,?" stroke-width="?" stroke="black" fill="none"/>',
        '    <path d="M ?,? Q ?,? ?,?" fill="none" stroke="black"/>',
        '  </g>',
        '  <use href="#brow-r" transform="matrix(-1,0,0,1,100,?)"/>',
        '</svg>'
    ]
    let index=0;
    return template.join("\n").replace(/\?/g, () => data[index++]);
}
