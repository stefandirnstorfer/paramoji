const range = len => len>0 ? range(len-1).concat(len-1) : [];
const copyX = (di, len) => (data,i) => range(len).map(offset => data[i+di+offset]);
//let controls_svg

const emoticon_data=[
    [  1,  0,  0,  0,-.5], // eye-squeeze
    // left-eye-outline
    [ 55, -2,-10,  0],
    [  0, 20,  0,-20],
    copyX(26, 2), // M
    "#right-eye-outline:1a", [ -8,  0, -8], [  0,  0, -4],
    "#right-eye-outline:1b", [ -8,  0, -8], [  0,  0,  2],
    "#right-eye-outline:2",  [ -8,  0, -3], [  0,  0,  9],
    "#right-eye-outline:3a", [ -4,  0,  1], [  0, -6, 13],
    "#right-eye-outline:3b", [  5,  2, 11], [  0, -9,  9],
    "#right-eye-outline:4",  [ 11,  0,  6], [  0,  0,  0],
    "#right-eye-outline:5a", [  5,  2, 13], [  0, -9, -9],
    "#right-eye-outline:5b", [ -4,  0,  5], [  0, -6,-13],
    "#right-eye-outline:6",  [ -8,  0,  0], [  0,  0,-11],
    // left-lens
    [  0,  0,  0, -1], [  0, -2,  0, -1],// #left-lens
    [0.5,  0,  4], // #pupil[radius]
    [  1,0.5,  0], // #glare[radius]
    // right-lid-shadow
    "#right-lid-shadow:2", [  5,  1, -4,  8], [  2,-10,-17,  5],
    // right-eye
    [-35,  0,  0,  2],
    // left-lid-shadow
    "#left-lid-shadow:2", [-33,  1,-10, -6,  3], [  2, -9,-17,  2, 13],
    // left-eye-brow
    "#right-eye-brow:1", [ 63,  2, -3, -5], [ 44, -7,-18,  8],
    "#right-eye-brow:2", [ 72,  0,  0, -4], [ 44, -9,-18,  4],
    "#right-eye-brow:3", [ 80,  0,  4, -3], [ 44, -3,-18, -2],
    [  2, -.5,  1,  .5], // stroke-width
    // wrinkle-left-brow
    "#wrinkle-right-brow:1", [ 62, -1, -4, -3], [ 40, -5,-18,  7],
    "#wrinkle-right-brow:2", [ 56,  1,  0, -4], [ 46, -7,-24,  9],
    "#wrinkle-right-brow:3", [ 56,  0,  0, -2], [ 49, -8,-22, 10],
    "left-brow", [  0,  0,  0,  0,  3],
    // nose-path
    "nose",
    [  0,  0,  0,  0,0.4],
    [ 74, -2,-10,  0], // nose left
    [ -2, -1,  0,  0],
    [ -4, -1, -1, -1],
    [ 74, -2,-10,  0], // nose right
    [ 72, -2,-10,  0],
    "#nose:6", [ 57,  0,  0,  0], [ 73, -2,-10,  0],
    "#nose:5", [ 59,  0,  0,  0], [ 71, -2, -9,  0],
    "#nose:8", [ 56,  0, -1,  0], [ 60, -4, -5,  2],
    // mouth-sqeeze
    "mouth-squeeze", [1, 0, "-l/2"],
    // lips
    "#lips:1", [ 63,  1, 11,  0], [  0, -6, -3, -1],
    "#lips:2", [ 60,  1, 11, -3], [  0, -1,  3, -1,  0,  4],
    "#lips:3", [ 56,  1,  6, -2], [  0,  1,  6, -1,  0,  8],
    /* 125 */             copyX(-1,1),
    "mirror:2#lips:2", [ 40, -1,-11,  3], [  0, -1,  3, -1,  0,  4],
    "mirror:1#lips:1", [ 37, -1,-11,  0], [  0, -6, -3, -1],
    "#lips:6",         [ 40, -1,-11,  3], [  0, -1, -7, -1,-18, -4],
    "#lips:7",         [ 44, -1, -6,  2], [  0,  1, -8, -1, -7, -9],
    /* 125 */                             [  0,  1, -8, -1, -3, -6],
    "#lips:x7",        [ 56,  1,  6, -2], [  0,  1, -8, -1,  1, -9],
    "mirror#lips:6",   [ 60,  1, 11, -3], [  0, -1, -7, -1,  0, -4],
    copyX(-28, 2),
    // teeth
    "lower-teeth", [  0,  1,  2, -1,  0,  1],
    "upper-teeth", [-10,  1, -5,  0,  0, -2],
    // mouth
    "#mouth:1", [ 63,  1, 11,  0], [  0, -6, -3, -1],
    "#mouth:2", [ 60,  1, 11, -3], [  0, -1,  3, -1],
    "#mouth:3", [ 56,  1,  6, -2], [  0,  1,  6, -1],
    /* 125 */             copyX(-1,1),
    "mirror:2#mouth:2", [ 40, -1,-11,  3], [  0, -1,  3, -1],
    "mirror:1#mouth:1", [ 37, -1,-11,  0], [  0, -6, -3, -1],
    "#mouth:6",         [ 40, -1,-11,  3], [  0, -1, -7, -1,-18],
    "#mouth:7",         [ 44, -1, -6,  2], [  0,  1, -8, -1, -7],
    /* 125 */                              [  0,  1, -8, -1, -3],
    "mirror#mouth:6",   [ 60,  1, 11, -3], [  0, -1, -7, -1],
    copyX(-25, 2),
    // wrinkle-cheek
    "#wrinkle-left-cheek:1", [ 26, -3, -6,  0,  0,  0], [ 82, -8, -1,  0,  0,  3],
    "#wrinkle-left-cheek:2", [ 32,  0, -6,  1, -4,  7], [ 80, -2, -8,  1,-12,  2],
    "#wrinkle-left-cheek:3", [ 37, -3, -2,  0,  3], [ 72, -3, -5,  0, -6],
    "mirror:1#wrinkle-left-cheek:1", [ 74,  3,  6,  0], [ 82, -8, -1,  0,  0,  3],
    "mirror:2#wrinkle-left-cheek:2", [ 68,  0,  6, -1,  0, -7], [ 80, -2, -8,  1,  0,  2],
    "mirror:3#wrinkle-left-cheek:3", [ 63,  3,  2,  0], [ 72, -3, -5,  0],
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

console.log(("const data=["+
        emoticon_data.filter(x => typeof x != 'string')
            .map(x => '[' +x.join(',') + ']')
            .join(',')
    +"]")
    .replace(/\[0/g, '[' )
    .replace(/,0/g, ',' )
    .replace(/(,)+\]/g,']')
    .replace(/(.{75}[^,]*,)/g, '$1\n'))
console.log(("const expressable="+JSON.stringify(expressable))
    .replace(/(.{75}[^,]*,)/g, '$1\n'))


function emoticon_svg(v, a, p, c, e, l) {
    l = l /100
    const a2=a/100
    const dotprod = (X,Y) => X.reduce((a, b, i) => a + b*(Y[i] || 0), 0)
    const X = C => dotprod([1, v/50-0.1, a2, p/50-1, c/100], C)//.reduce((a,b,i) => a + b*(C[i] || 0), 0)
    const e2 = (e/50-1)/2
    var data = emoticon_data
        .filter(x => typeof(x) != 'string')
        .map((C, i)=> {
            C= C.map(x => typeof(x)=="string" ? eval(x) : x)
            V= [1, v/50-1, Math.min(1,Math.max(0,a2 + expressable[i]*e2)), p/50-1, c/100, l]
            return dotprod(V, C)
        })
    var index=0;
    const template= [
        '<svg height="100%" viewBox="0 0 100 110" width="100%" xmlns="http://www.w3.org/2000/svg">',
        '  <defs id="defs">',
        '    <clipPath id="clip-right-eye">',
        '      <use href="#right-eye-outline"/>',
        '    </clipPath>',
        '    <clipPath id="clip-left-eye">',
        '      <use id="left-eye-outline" transform="matrix(-1,0,0,?,-35,0)" href="#right-eye-outline"/>',
        '    </clipPath>',
        '    <clipPath id="clip-mouth">',
        '      <use href="#inner-mouth"/>',
        '    </clipPath>',
        '  </defs>',
        '  <ellipse cx="50" cy="54" rx="48" ry="52" fill="#e9c6af" opacity="0.5"/>',
        '  <g id="eyes" transform="translate(67.5,?)">',
        '    <g id="right-eye">',
        '      <path transform="rotate(?)" d="M ?,? C ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? Z" id="right-eye-outline" fill="white" stroke="black"/>',
        '      <g clip-path="url(#clip-right-eye)" id="right-eyeball">',
        '        <g id="right-lens" transform="translate(?,?)">',
        '          <circle r="5" fill="#9d4922" id="iris"/>',
        '          <circle r="?" fill="black" id="pupil"/>',
        '          <circle r="?" cx="-2.5" cy="-1.3" fill="white" id="glare"/>',
        '        </g>',
        '        <path d="M -15,-20 H 20 V0 Q ?,? -15,0 Z" id="right-lid-shadow" opacity="0.25" fill="black"/>',
        '      </g>',
        '    </g>',
        '    <g id="left-eye">',
        '      <use href="#left-eye-outline"/>',
        '      <g clip-path="url(#clip-left-eye)" id="left-eyeball">',
        '        <use id="right-lens" x="?" href="#right-lens"/>',
        '        <path d="M -50,-20 H -20 V -2 Q ?,? -55,0 Z" id="left-lid-shadow" opacity="0.25" fill="black"/>',
        '      </g>',
        '    </g>',
        '  </g>',
        '  <g id="right-eye-top">',
        '    <path d="M ?,? Q ?,? ?,?" id="right-eye-brow" stroke-width="?" stroke="#292929" fill="none"/>' +
        '    <path d="M ?,? Q ?,? ?,?" id="wrinkle-right-brow" fill="none" stroke="black"/>',
        '  </g>',
        '  <use id="left-eye-brow" transform="matrix(-1,0,0,1,100,?)" href="#right-eye-top"/>',
        '  <g id="nose" transform="matrix(1,?,0,1,53,0) translate(-53,0)">',
        '    <path d="M 49,? q -2,? ?,0 M 52,? Q 56,? ?,? T ?,? ?,?" id="nose-path" fill="none" stroke="black"/>',
        '  </g>',
        '  <g id="mouth" transform="translate(50,83) scale(?,1) translate(-50, 0)">',
        '    <path d="M ?,? C ?,? ?,? 50,? S ?,? ?,? C ?,? ?,? 50,? C ?,? ?,? ?,? Z" id="lips" fill="gray" stroke="black"/>',
        '    <g clip-path="url(#clip-mouth)" id="mouth-interior">',
        '      <rect height="45" fill="black" id="mouth-background" width="60" x="20" y="-25"/>',
        '      <ellipse cx="50" cy="5" rx="16" ry="6" id="tongue" fill="#800f08"/>/',
        '      <g id="lower-teeth" transform="translate(0,?)">',
        '        <use x="-14" href="#tooth"/>',
        '        <use x="-7" href="#tooth"/>',
        '        <use x="0" href="#tooth"/>',
        '        <use x="7" href="#tooth"/>',
        '      </g>',
        '      <g id="upper-teeth" transform="translate(0,?)">',
        '        <use transform="matrix(1,0.14,0,1,-14,-8)" href="#tooth"/>',
        '        <use x="-7" href="#tooth"/>',
        '        <rect height="10" id="tooth" rx="2" ry="1" fill="white" stroke="black" width="6" x="50"/>',
        '        <use transform="matrix(1,-0.14,0,1,7,7)" href="#tooth"/>',
        '      </g>',
        '    </g>',
        '    <path d="M ?,? C ?,? ?,? 50,? S ?,? ?,? C ?,? ?,? 50,? S ?,? ?,? Z" id="inner-mouth" fill="none" stroke="black"/>',
        '  </g>',
        '  <path d="M ?,? Q ?,? ?,?" id="wrinkle-left-cheek" fill="none" stroke="black"/>',
        '  <path d="M ?,? Q ?,? ?,?" id="wrinkle-right-cheek" fill="none" stroke="black"/>',
        controls_svg && controls_svg(X) || '',
        '</svg>'
    ]
    result = template.join("\n").replace(/\?/g, () => data[index++]);
    return result
}
