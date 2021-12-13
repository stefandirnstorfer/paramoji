const range = len => len>0 ? range(len-1).concat(len-1) : [];
const copyX = (di, len) => (data,i) => range(len).map(offset => data[i+di+offset]);
//let controls_svg

const emoticon_data=[
    [  1,  0,  0,  0,-.5], // eye-squeeze
    // left-eye-outline
    [135, -4,-20,  0, 2],
    [  0, 20,  0,-20],
    copyX(26, 2), // M
    "#right-eye-outline:1a", [-16,  0,-16], [  0,  0, -8],
    "#right-eye-outline:1b", [-16,  0,-16], [  0,  0,  5],
    "#right-eye-outline:2",  [-16,  0, -6], [  0,  0, 18],
    "#right-eye-outline:3a", [ -8,  0,  2], [  0,-12, 26],
    "#right-eye-outline:3b", [ 10,  4, 22], [  0,-18, 18],
    "#right-eye-outline:4",  [ 22,  0, 12], [  0,  0,  0],
    "#right-eye-outline:5a", [ 10,  4, 26], [  0,-18,-18],
    "#right-eye-outline:5b", [ -8,  0, 10], [  0,-12,-26],
    "#right-eye-outline:6",  [-16,  0,  0], [  0,  0,-22],
    // left-lens
    [  0,  0,  0, -2], [  0, -4,  0,  -2],// #left-lens
    [  1,  0,  8], // #pupil[radius]
    [  2,  1,  0], // #glare[radius]
    // right-lid-shadow
    "#right-lid-shadow:2", [ 10,  2, -8, 16], [  4,-20,-34,  10],
    // right-eye
    [-70,  0,  0,  4],
    // left-lid-shadow
    "#left-lid-shadow:2", [-66,  2,-20,-12,  6], [  4,-18,-34,  4, 26],
    // left-eye-brow
    "#right-eye-brow:1", [151,  4, -6,-10], [117,-12,-36, 16],
    "#right-eye-brow:2", [169,  0,  0, -8], [117,-16,-36,  8],
    "#right-eye-brow:3", [185,  0,  7, -6], [117, -4,-36, -4],
    [  3.0, -1,  2,  1], // stroke-width
    // wrinkle-left-brow
    "#wrinkle-right-brow:1", [148, -2, -7, -6], [109, -6,-37, 14],
    "#wrinkle-right-brow:2", [136,  2,  0, -8], [120,-10,-47, 18],
    "#wrinkle-right-brow:3", [137,  0,  0, -5], [126,-11,-45, 19],
    "left-brow", [  0,  0,  0,  0,  6],
    // nose-path
    "nose",
    [  0,  0,  0,  0,0.3],
    [173, -5,-20,  0], // nose left
    [ -4, -2,  0,  0],
    [ -8, -3, -2, -2],
    [173, -5,-20,  0], // nose right
    [169, -7,-20,  0],
    "#nose:6", [139,  1,  0,  0], [171, -6,-20,  0],
    "#nose:5", [143,  0,  0,  0], [167, -5,-17,  0],
    "#nose:8", [137,  0, -2,  0], [145,-10,-10,  4],
    // mouth-sqeeze
    "mouth-squeeze", [1, 0, "-l/200"],
    // lips
    "#lips:1", [151,  2, 22,   ], [191,-12, -6, -2],
    "#lips:2", [145,  2, 22, -6], [191, -2,  6, -2,  0,  8],
    "#lips:3", [137,  2, 12, -4], [191,  2, 12, -2,  0, 15],
    /* 125 */             copyX(-1,1),
    "mirror:2#lips:2", [105, -2,-22,  6], [191, -2,  6, -2,  0,  8],
    "mirror:1#lips:1", [ 99, -2,-22,   ], [191,-12, -6, -2],
    "#lips:6",         [105, -2,-22,  6], [191, -2,-14, -2,-26,  -8],
    "#lips:7",         [113, -2,-12,  4], [191,  2,-16, -2, -8, -18],
    /* 125 */                             [191,  2,-16, -2, -4, -12],
    "#lips:x7",        [137,  2, 12, -4], [191,  2,-16, -2,  0, -18],
    "mirror#lips:6",   [145,  2, 22, -6], [191, -2,-14, -2,  0,  -8],
    copyX(-28, 2),
    // teeth
    "lower-teeth", [ 22,  2,  4,  -2,  0, 2],
    "upper-teeth", [  2,  2, -10,  0,  0,-4],
    // mouth
    "#mouth:1", [151,  2, 22,   ], [191,-12, -6, -2],
    "#mouth:2", [145,  2, 22, -6], [191, -2,  6, -2],
    "#mouth:3", [137,  2, 12, -4], [191,  2, 12, -2],
    /* 125 */             copyX(-1,1),
    "mirror:2#mouth:2", [105, -2,-22,  6], [191, -2,  6, -2],
    "mirror:1#mouth:1", [ 99, -2,-22,   ], [191,-12, -6, -2],
    "#mouth:6",         [105, -2,-22,  6], [191, -2,-14, -2,-26],
    "#mouth:7",         [113, -2,-12,  4], [191,  2,-16, -2, -8],
    /* 125 */                              [191,  2,-16, -2, -4],
    "mirror#mouth:6",   [145,  2, 22, -6], [191, -2,-14, -2],
    copyX(-25, 2),
    // wrinkle-left-cheek
    "#wrinkle-left-cheek:1", [ 77, -6,-12,  1,  0,  0], [188,-15, -2,  0,  0, 16],
    "#wrinkle-left-cheek:2", [ 89, -1,-12,  2, -9, 14], [185, -4,-16,  2,-25, 10],
    "#wrinkle-left-cheek:3", [ 99, -6, -5,  1,  6], [168, -6,-10,  0, -5],
    "mirror:1#wrinkle-left-cheek:1", [173,  6, 12, -1        ], [188,-15, -2,  0, 0, 16],
    "mirror:2#wrinkle-left-cheek:2", [161,  1, 12, -2, 0, -14], [185, -4,-16,  2, 0, 10],
    "mirror:3#wrinkle-left-cheek:3", [151,  6,  5, -1], [168, -6,-10,  0],
];
var i=0;
while (i< emoticon_data.length) {
    if (typeof emoticon_data[i] == 'function') {
        var inserted= emoticon_data[i](emoticon_data,i);
        emoticon_data.splice.apply(emoticon_data, [i, 1].concat(inserted));
    }
    i++;
}
const expressable=[]
let current_expressability = -1
for (entry of emoticon_data) {
    if (typeof(entry)=="string") {
        if (entry=="mouth-squeeze") current_expressability = 1
        if (entry=="#lips:1") current_expressability = 1
        if (entry=="lower-teeth") current_expressability = 2
        if (entry=="#mouth:1") current_expressability = 1
        if (entry=="nose") current_expressability = 0.2
    } else {
        expressable.push(current_expressability)
    }
}

console.log(("const data="+JSON.stringify(emoticon_data.filter(x => typeof x != 'string')))
    .replace(/\[0/g, '[' )
    .replace(/,0/g, ',' )
    .replace(/(,)+\]/g,']')
    .replace(/(.{75}[^,]*,)/g, '$1\n'))
console.log(("const expressable="+JSON.stringify(expressable))
    .replace(/(.{75}[^,]*,)/g, '$1\n'))


function emoticon_svg(v, a, p, c, e, l) {
    const a2=a/100
    const dotprod = (X,Y) => X.reduce((a, b, i) => a + b*(Y[i] || 0), 0)
    const X = C => dotprod([1, v/50-0.1, a2, p/50-1, c/100], C)//.reduce((a,b,i) => a + b*(C[i] || 0), 0)
    const e2 = (e/50-1)/2
    var data = emoticon_data
        .filter(x => typeof(x) != 'string')
        .map((C, i)=> {
            C= C.map(x => typeof(x)=="string" ? eval(x) : x)
            V= [1, v/50-1, Math.min(1,Math.max(0,a2 + expressable[i]*e2)), p/50-1, c/100, l/100]
            return dotprod(V, C)
        })
    var index=0;
    const template= [
        '<svg height="100%" viewBox="0 0 250 250" width="100%" xmlns="http://www.w3.org/2000/svg">',
        '  <defs id="defs">',
        '    <clipPath id="clip-right-eye">',
        '      <use href="#right-eye-outline"/>',
        '    </clipPath>',
        '    <clipPath id="clip-left-eye">',
        '      <use id="left-eye-outline" transform="matrix(-1,0,0,?,-70,0)" href="#right-eye-outline"/>',
        '    </clipPath>',
        '    <clipPath id="clip-mouth">',
        '      <use href="#inner-mouth"/>',
        '    </clipPath>',
        '  </defs>',
        '  <path id="head" d="M 125,230 C 175,230 215,200 215,130 S 175,30 125,30 S 35,65 35,130 S 75,230 125,230 Z" fill="#e9c6afa0"/>',
        '  <g id="eyes" transform="translate(160,?)">',
        '    <g id="right-eye">',
        '      <path transform="rotate(?)" d="M ?,? C ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? Z" id="right-eye-outline" fill="white" stroke="black"/>',
        '      <g clip-path="url(#clip-right-eye)" id="right-eyeball">',
        '        <g id="right-lens" transform="translate(?,?)">',
        '          <circle r="9" fill="#9d4922" id="iris"/>',
        '          <circle r="?" fill="black" id="pupil"/>',
        '          <circle r="?" cx="-5" cy="-3" fill="white" id="glare"/>',
        '        </g>',
        '        <path d="M -35,-40 H 40 V-5 Q ?,? -35,0 Z" id="right-lid-shadow" opacity="0.25" fill="black"/>',
        '      </g>',
        '    </g>',
        '    <g id="left-eye">',
        '      <use href="#left-eye-outline"/>',
        '      <g clip-path="url(#clip-left-eye)" id="left-eyeball">',
        '        <use id="right-lens" x="?" href="#right-lens"/>',
        '        <path d="M -110,-40 H -40 V -5 Q ?,? -110,0 Z" id="left-lid-shadow" opacity="0.25" fill="black"/>',
        '      </g>',
        '    </g>',
        '  </g>',
        '  <g id="right-eye-top">',
        '    <path d="M ?,? Q ?,? ?,?" id="right-eye-brow" stroke-width="?" stroke="#292929" fill="none"/>' +
        '    <path d="M ?,? Q ?,? ?,?" id="wrinkle-right-brow" fill="none" stroke="black"/>',
        '  </g>',
        '  <use id="left-eye-brow" transform="matrix(-1,0,0,1,250,?)" href="#right-eye-top"/>',
        '  <g id="nose" transform="matrix(1,?,0,1,132,0) translate(-132,0)">',
        '    <path d="M 123,? q -3,? ?,0 M 132,? Q 137,? ?,? T ?,? ?,?" id="nose-path" fill="none" stroke="black"/>',
        '  </g>',
        '  <g id="mouth" transform="translate(125,0) scale(?,1) translate(-125, 0)">',
        '    <path d="M ?,? C ?,? ?,? 125,? S ?,? ?,? C ?,? ?,? 125,? C ?,? ?,? ?,? Z" id="lips" fill="gray" stroke="black"/>',
        '    <g clip-path="url(#clip-mouth)" id="mouth-interior">',
        '      <rect height="90" fill="black" id="mouth-background" width="120" x="65" y="140"/>',
        '      <ellipse cx="124" cy="200", rx="32" ry="12" id="tongue" fill="#800f08"/>/',
        '      <g id="lower-teeth" transform="translate(0,?)">',
        '        <use x="-24" href="#tooth"/>',
        '        <use x="-12" href="#tooth"/>',
        '        <use x="0" href="#tooth"/>',
        '        <use x="12" href="#tooth"/>',
        '        <use x="24" href="#tooth"/>',
        '      </g>',
        '      <g id="upper-teeth" transform="translate(0,?)">',
        '        <use transform="matrix(1,0.14,0,1,-24,-18)" href="#tooth"/>',
        '        <use transform="matrix(1,0.05,0,1,-12,-6)" href="#tooth"/>',
        '        <rect height="20" id="tooth" rx="2" ry="2" fill="white" stroke="black" width="10" x="118" y="169"/>',
        '        <use transform="matrix(1,-0.05,0,1,12,6)" href="#tooth"/>',
        '        <use transform="matrix(1,-0.14,0,1,24,16)" href="#tooth"/>',
        '      </g>',
        '    </g>',
        '    <path d="M ?,? C ?,? ?,? 125,? S ?,? ?,? C ?,? ?,? 125,? S ?,? ?,? Z" id="inner-mouth" fill="none" stroke="black"/>',
        '  </g>',
        '    <path d="M ?,? Q ?,? ?,?" id="wrinkle-left-cheek" fill="none" stroke="black"/>',
        '    <path d="M ?,? Q ?,? ?,?" id="wrinkle-right-cheek" fill="none" stroke="black"/>',
        controls_svg && controls_svg(X) || '',
        '</svg>'
    ]
    result = template.join("\n").replace(/\?/g, () => data[index++]);
    return result
}
