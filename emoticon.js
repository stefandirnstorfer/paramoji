const range = len => len>0 ? range(len-1).concat(len-1) : [];
const copyX = (di, len) => (data,i) => range(len).map(offset => data[i+di+offset]);

const emoticon_data=[
    // left-eye-outline
    [127, -50, -80,  20],
    [0, -200, 0, 200],
    copyX(26, 2), // M
    "#left-eye-outline:1a", [  23,  -1,  68,   0], [  -3,  24, -25,  34],
    "#left-eye-outline:1b", [  22,  -1,  63,   0], [   2,  17,  27,  16],
    "#left-eye-outline:2", [  18,  -1,  24,   0], [   7,  19,  77,  13],
    "#left-eye-outline:3a", [   6,   7, -13, -16], [  10,-112, 107,  32],
    "#left-eye-outline:3b", [ -21,  34, -98,  -6], [   7,-170,  79,  10],
    "#left-eye-outline:4", [ -27,   6, -51,  -2], [   0, -67,   9, -11],
    "#left-eye-outline:5a", [ -21,  30,-104,  -4], [  -6,-160, -55,   8],
    "#left-eye-outline:5b", [   3,   7, -48, -20], [ -11,-125,-105,  27],
    "#left-eye-outline:6", [  18,  -1,  17,   0], [  -7,   2, -65,  24],
    // left-lens
    [  0,   0,   0,  20], [  0,   -30,   0,  0],// #left-lens
    [  4,   0,  30,   0], // #pupil[radius]
    [  2,   15,  5,   0], // #glare[radius]
    // left-lid-shadow
    /* 35 */              [ -15,-100,   0,   0],
    "#left-lid-shadow:2", [  -3,  28, -25, -10], [ -11, -79, -63,  40],
    /* -40 */             [   5, -50,   0,   0],
    // right-eye
    [70, 0, 0, -40],
    // right-lid-shadow
    /* 200 */             copyX(-6, 1),
    "#right-lid-shadow:2", [  52, -35, -74, 106], [ -16, -86, -82,  86],
    /* 125 */             copyX(-6,1 ),
    // left-eye-brow
    "#left-eye-brow:1", [ 104,   2,  26, 115], [ 103,-128,-159, 211],
    "#left-eye-brow:2", [  84,  21,  -9,  82], [ 102,-158,-151,  87],
    "#left-eye-brow:3", [  62,  21, -39,  58], [ 103, -58, -84, -49],
    [  4, -10,  10, 10],
    // teeth
    [ 27,   50,  20,   0],
    [ -2,    20, -60,   0],
    // lips
    "#lips:1", [ 160,  25,  94,  -3], [ 188,-116, -27, -42],
    "#lips:2", [ 154,  26,  92, -59], [ 194, -10,  33, -28],
    "#lips:3", [ 142,  15,  56, -42], [ 196,  20,  53, -27],
    /* 125 */             copyX(-1,1),
    "mirror:2#lips:2", [  96, -26, -92,  59], [ 194, -10,  33, -28],
    "mirror:1#lips:1", [  90, -25, -94,   3], [ 188,-116, -27, -42],
    "#lips:6", [  97, -26, -92,  59], [ 184, -26, -67, -25,-254],
    "#lips:7", [ 108, -15, -56,  42], [ 182,  12, -78, -16, -74],
    /* 125 */             [  182,  12, -78, -16, -35],
    "mirror#lips:6", [ 153,  26,  92, -59], [ 184, -26, -67, -25],
    copyX(-25, 2),
    // wrinkle-left-brow
    "#wrinkle-left-brow:1", [ 105,  12,  31,  64], [  94, -64,-157, 131],
    "#wrinkle-left-brow:2", [ 114, -17,  -1,  82], [ 101,-104,-193, 182],
    "#wrinkle-left-brow:3", [ 113,   1,  -8,  52], [ 108,-117,-181, 197],
    // wrinkle-left-cheek
    "#wrinkle-left-cheek:1", [  72, -61, -52,  16,  -9], [ 187,-158, -18,   1,   6],
    "#wrinkle-left-cheek:2", [  84, -17, -39,  25, -95], [ 179, -47, -47,  22,-256],
    "#wrinkle-left-cheek:3", [  97, -69, -20,  15,  64], [ 164, -68, -49,  -1, -51],
    "mirror:1#wrinkle-left-cheek:1", [ 178,  61,  52, -16], [ 187,-158, -18,   1],
    "mirror:2#wrinkle-left-cheek:2", [ 166,  17,  39, -25], [ 179, -47, -47,  22],
    "mirror:3#wrinkle-left-cheek:3", [ 153,  69,  20, -15], [ 164, -68, -49,  -1],
    // nose-path
    [0, 0, 0, 0, 3],
    [165,  -50, -80,   0], // nose left
    [ -4,  -20,  -5,   0],
    [ -9,  -30, -10, -20],
    [165,  -50, -80,   0], // nose right
    [161,  -70, -80,  -0],
    "#nose:6", [ 140,  10,   0,   0], [ 163, -60, -80,   0],
    "#nose:5", [ 143,   1,  -3,  -3], [ 159, -58, -78,   9],
    "#nose:8", [ 136,   9, -10,  -2], [ 141, -39, -67,  91],
];
var i=0;
while (i< emoticon_data.length) {
    if (typeof emoticon_data[i] == 'function') {
        var inserted= emoticon_data[i](emoticon_data,i);
        emoticon_data.splice.apply(emoticon_data, [i, 1].concat(inserted));
    }
    i++;
}
console.log(JSON.stringify(emoticon_data.filter(x => typeof x != 'string'))
    .replace(/(.{60}[^]]*\],)/g, '$1\n'))

function emoticon_svg(v, a, p, c) {
  const X = C => [1, v/500-0.1, a/500-0.1, p/500-0.1, c/1000].reduce((a,b,i) => a + b*(C[i] || 0), 0);
  var data = emoticon_data.map(X)
  var index=0;
  return [
      '<svg height="100%" version="1.1" viewBox="0 0 250 250" width="100%" xmlns="http://www.w3.org/2000/svg">',
      '  <defs id="defs">',
      '    <clipPath id="clipPath-left-eye">',
      '      <use href="#left-eye-outline"/>',
      '    </clipPath>',
      '    <clipPath id="clipPath-right-eye">',
      '      <use id="right-eye-outline" transform="matrix(-1,0,0,1,70,0)" href="#left-eye-outline"/>',
      '    </clipPath>',
      '    <clipPath id="clipPath-mouth">',
      '      <use href="#lips"/>',
      '    </clipPath>',
      '  </defs>',
      '  <g id="head">',
      '    <path d="M 125,230 C 175,230 215,200 215,130 S 175,30 125,30 S 35,65 35,130 S 75,230 125,230 Z" fill="#e9c6afa0"/>',
      '  </g>',
      '  <g id="eyes" transform="translate(90,?)">',
      '    <g id="left-eye">',
      '      <path transform="rotate(?)" d="M ?,? C ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? Z" id="left-eye-outline" fill="white" stroke="black"/>',
      '      <g clip-path="url(#clipPath-left-eye)" id="left-eyeball">',
      '        <g id="left-lens" transform="translate(?,?)">',
      '          <circle r="9" fill="#9d4922" id="iris"/>',
      '          <circle r="?" fill="black" id="pupil"/>',
      '          <circle r="?" cx="-5" cy="-3" fill="white" id="glare"/>',
      '        </g>',
      '        <path d="M -40,-30 H 35 V ? Q ?,? -40,? Z" id="left-lid-shadow" opacity="0.25" fill="black"/>',
      '      </g>',
      '    </g>',
      '    <g id="right-eye">',
      '      <use id="right-eye-outline" href="#right-eye-outline"/>',
      '      <g clip-path="url(#clipPath-right-eye)" id="right-eyeball">',
      '        <use id="right-lens" x="?" href="#left-lens"/>',
      '        <path d="M 35,-30 H 110 V? Q ?,? 35,? Z" id="right-lid-shadow" opacity="0.25" fill="black"/>',
      '      </g>',
      '    </g>',
      '  </g>',
      '  <path d="M ?,? Q ?,? ?,?" id="left-eye-brow" stroke-width="?" stroke="#292929" fill="none"/>' +
      '  <use id="right-eye-brow" transform="matrix(-1,0,0,1,250,0)" href="#left-eye-brow"/>',
      '  <g id="mouth">',
      '    <g clip-path="url(#clipPath-mouth)" id="mouth-interior">',
      '      <rect height="90" fill="black" id="mouth-background" width="120" x="65" y="140"/>',
      '      <path d="M 94.8,211 C 94.5,191 111,190 127,189 145,188 158,193 158,211 137,211 116,211 94.8,211 Z" id="tongue" fill="#800f08"/>',
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
      '    <path d="M ?,? C ?,? ?,? 125,? S ?,? ?,? C ?,? ?,? 125,? S ?,? ?,? Z" id="lips" fill="none" stroke="black"/>',
      '  </g>',
      '  <g id="wrinkles">',
      '    <path d="M ?,? Q ?,? ?,?" id="wrinkle-left-brow" fill="none" stroke="black" stroke-width="0.5"/>',
      '    <use id="wrinkle-right-brow" transform="matrix(-1,0,0,1,250,0)" href="#wrinkle-left-brow"/>',
      '    <path d="M ?,? Q ?,? ?,?" id="wrinkle-left-cheek" fill="none" stroke="black" stroke-width="0.5"/>',
      '    <path d="M ?,? Q ?,? ?,?" id="wrinkle-right-cheek" fill="none" stroke="black" stroke-width="0.5"/>',
      '  </g>',
      '  <g id="nose" transform="matrix(1,?,0,1,132,0) translate(-132,0)">',
      '    <path d="M 123,? q -3,? ?,0 M 132,? Q 137,? ?,? T ?,? ?,?" id="nose-path" fill="none" stroke="black"/>',
      '  </g>',
      controls_svg && controls_svg(X) || '',
      '</svg>'
    ].join("\n").replace(/\?/g, () => data[index++]);
}
