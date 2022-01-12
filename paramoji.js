let current_expressability = -1
const emoticon_data=[
    // eyes vertical
    [ 51, -2,-10,  0],
    // right eye
    [  0, 25,  0,-25],
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
    "#right-lid-shadow:2", [  5,  1, -4,  8], [  2,-10,-17,  5],
    // left-eye-outline
    [  0, -25,  0, 25, -10, 0, 20],
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
    "#left-lid-shadow:2", [2,  1,-10, -6,  3], [  2, -9,-17,  2, 20],
    // left-eye-brow
    "#right-eye-brow:1", [ 61,  2,  -1, -4], [ 40, -9,-18,  11],
    "#right-eye-brow:2", [ 72,  0,  , -4], [ 40, -12,-18,  3],
    "#right-eye-brow:3", [ 80,  0,  6, -2], [ 40, -5,-18, -3],
    [  2, -.5,  1,  .5], // stroke-width
    // wrinkle-left-brow
    "#wrinkle-right-brow:1", [ 62, -1, -4, -3], [ 36, -5,-18,  7],
    "#wrinkle-right-brow:2", [ 56,  1,  0, -4], [ 42, -7,-24,  9],
    "#wrinkle-right-brow:3", [ 56,  0,  0, -2], [ 45, -8,-22, 10],
    "left-brow", [  0,  0,  0,  0,  2, 2],
    // nose-path
    "nose",
    [  0,  0,  0,  0, .5],
    [  70, -2, -10, -1], // nose height
    "#nose:5", /* 6 */           [ -3,  0, 1,  0],
    "#nose:8", /*  4 */          [ -14, -2, 6,  2],
    // teeth
    "mouth:y",     [ 80,  0,  0, -2,  2,  -2,  -2],
    "lower-teeth", [  0,  4,  6, -4],
    "upper-teeth", [-15,  1, -5,  1,  0, -4],
    // mouth
    "#mouth:1",         [ 63,  0,  9, -2],     [  0,-11,  -2],
    "#mouth:2",         [ 60,  0, 11, -3],     [  0,  0,  11],
    "#mouth:3",         [ 56,  0,  6, -3],     [  0,  2,  12],
    /* 50 */                                   [  0,  2,  12],
    "mirror:2#mouth:2", [ 40,  0,-11,  3,  3], [  0,  0,  11],
    "mirror:1#mouth:1", [ 37,  0, -9,  2],     [  0,-11,  -2],
    "#mouth:6",         [ 40,  0,-11,  3, -3], [  0,  0, -11,  0,-22],
    "#mouth:7",         [ 44,  0, -6,  3],     [  0,  2, -12,  0, -7, -1],
    /* 50 */                                   [  0,  2, -12,  0, -3, 0],
    "mirror#mouth:6",   [ 60,  0, 11, -3],     [  0,  0, -11,  0,  0],
    "#mouth:1copy",     [ 63,  0,  9, -2],     [  0,-11,  -2],
    // wrinkle-cheek
    "#wrinkle-left-cheek:1",  [ 26, -2, -6,  2, -2], [ -2, -9, -2,  0,  -1],
    "#wrinkle-left-cheek:2",  [ 32,  0, -6,  4, -8], [ -4, -3, -9,  1,-16, -3, 3],
    "#wrinkle-left-cheek:3",  [ 37, -3, -2,  1,  3], [-12, -3, -5,  0, -7, -4, 2],
    "#wrinkle-right-cheek:1", [ 74,  3,  6, -2],     [ -2, -9, -2,  0,  0],
    "#wrinkle-right-cheek:2", [ 68,  0,  6, -4],     [ -4, -3, -9,  1,  0],
    "#wrinkle-right-cheek:3", [ 63,  2,  2, -1],     [-12, -3, -5,  0],
].filter(entry => {
    if (typeof(entry)=="string") {
        if (entry=="#lips:1") current_expressability = 1
        if (entry=="lower-teeth") current_expressability = 1
        if (entry=="#mouth:1") current_expressability = 1
        if (entry=="nose") current_expressability = 0.5
        return false
    } else {
        const a = entry[2]
        entry[2] = (1 - current_expressability)/2 * a
        entry.splice(3, 0, (1 + current_expressability)/2 * a)
        return true
    }
})

console.log(("const data=["+emoticon_data.map(x => '[' +x.join(',') + ']').join(',') +"]")
    .replace(/\[0/g, '[' )
    .replace(/,0/g, ',' )
    .replace(/(,)+\]/g,']')
    .replace(/(.{75}[^,]*,)/g, '$1\n'))

function paramoji_svg(v, a1, a2, p, c, color="gold") {
    v = v * 100
    a1 = a1 * 100
    a2 = a2 * 100
    p = p * 100
    c = c * 100
    const a= (a1+a2)/2
    const e = (a2-a1)/2 + 50
    return emoticon_svg(v, a, p, c, e, color)
}

function emoticon_svg(v, a, p, c, e, color="gold") {
    a = a/100
    c = c/100
    v = v/50-1
    const dotprod = (X,Y) => X.reduce((a, b, i) => a + b*(Y[i] || 0), 0)
    const e2 = (e/50-1)/2
    const a1 = Math.min(1,Math.max(0,a - e2))
    const a2 = Math.min(1,Math.max(0,a + e2))
    const v1 = v/2+.5
    let data = emoticon_data
        .filter(x => typeof(x) != 'string')
        .map((C, i)=> {
            V= [1, v, a1, a2, p/50-1, c, c*a1, c*v1]
            return dotprod(V, C)
        })
    const template= [
        '<svg height="100%" viewBox="0 0 100 100" width="100%" xmlns="http://www.w3.org/2000/svg">',
        '  <defs id="defs">',
        '    <clipPath id="clip-right-eye"><use href="#right-eye-outline"/></clipPath>',
        '    <clipPath id="clip-left-eye"><use href="#left-eye-outline"/></clipPath>',
        '    <clipPath id="clip-mouth"><use href="#lips"/></clipPath>',
        '  </defs>',
        '  <ellipse id="head" cx="50" cy="50" rx="48" ry="50" fill="' + color.replace(/"/g,'') + '"/>',
        '  <g id="eyes" transform="translate(68,?)">',
        '    <g id="right-eye">',
        '      <path transform="rotate(?)" d="M -8,? C ?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? -8,? Z" id="right-eye-outline" fill="white" stroke="black"/>',
        '      <g clip-path="url(#clip-right-eye)" id="right-eyeball">',
        '        <g id="right-lens" transform="translate(?,?)">',
        '          <circle r="5" fill="#9d4922" id="iris"/>',
        '          <circle r="?" fill="black" id="pupil"/>',
        '          <circle r="1" cx="-2.5" cy="-1.5" fill="white" id="glare"/>',
        '        </g>',
        '        <path d="M -15,-20 H 20 V0 Q ?,? -15,0 Z" id="right-lid-shadow" opacity="0.25" fill="black"/>',
        '      </g>',
        '    </g>',
        '    <g id="left-eye" transform="translate(-36,0)">',
        '      <path transform="rotate(?)" d="M 8,? C ?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? 8,? Z" id="left-eye-outline" fill="white" stroke="black"/>',
        '      <g clip-path="url(#clip-left-eye)" id="left-eyeball">',
        '        <use id="right-lens" x="?" href="#right-lens"/>',
        '        <path d="M -15,-20 H 15 V -2 Q ?,? -20,0 Z" id="left-lid-shadow" opacity="0.25" fill="black"/>',
        '      </g>',
        '    </g>',
        '  </g>',
        '  <g id="right-eye-top">',
        '    <path d="M ?,? Q ?,? ?,?" id="right-eye-brow" stroke-width="?" stroke="black" fill="none"/>' +
        '    <path d="M ?,? Q ?,? ?,?" id="wrinkle-right-brow" fill="none" stroke="black"/>',
        '  </g>',
        '  <use id="left-eye-brow" transform="matrix(-1,0,0,1,100,?)" href="#right-eye-top"/>',
        '  <path transform="matrix(1,?,0,1,53,?)" d="M -4,0 q -2,-2 -4,0 M -1,0 Q 3,-2 4,-1 T 6,? 4,?" id="nose" fill="none" stroke="black"/>',
        '  <g id="mouth" transform="translate(0,?)">',
        '    <g clip-path="url(#clip-mouth)" id="throat">',
        '      <rect height="45" fill="black" id="mouth-background" width="60" x="20" y="-25"/>',
        '      <ellipse cx="50" cy="10" rx="15" ry="10" id="tongue" fill="#800f08"/>/',
        '      <g id="lower-teeth" transform="translate(0,?)">',
        '        <use x="-14" href="#tooth"/>',
        '        <use x="-7" href="#tooth"/>',
        '        <use x="0" href="#tooth"/>',
        '        <use x="7" href="#tooth"/>',
        '      </g>',
        '      <g id="upper-teeth" transform="translate(0,?)">',
        '        <use transform="matrix(1,0.14,0,1,-14,-8)" href="#tooth"/>',
        '        <use x="-7" href="#tooth"/>',
        '        <rect height="15" id="tooth" rx="2" ry="1" fill="white" stroke="black" width="6" x="50"/>',
        '        <use transform="matrix(1,-0.14,0,1,7,7)" href="#tooth"/>',
        '      </g>',
        '    </g>',
        '    <path d="M ?,? C ?,? ?,? 50,? S ?,? ?,? C ?,? ?,? 50,? S ?,? ?,? Z" id="lips" fill="none" stroke="black"/>',
        '    <path d="M ?,? Q ?,? ?,?" id="wrinkle-left-cheek" fill="none" stroke="black"/>',
        '    <path d="M ?,? Q ?,? ?,?" id="wrinkle-right-cheek" fill="none" stroke="black"/>',
        '  </g>',
        '</svg>'
    ]
    let index=0;
    return template.join("\n").replace(/\?/g, () => data[index++]);
}
