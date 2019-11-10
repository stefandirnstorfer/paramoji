const range = len => len>0 ? range(len-1).concat(len-1) : [];
const copyX = (di, len) => (data,i) => range(len).map(offset => data[i+di+offset]);
const mirrorX = (di) => (data,i) => [250 - data[i+di], data[i+di+1]];


DY=0
DYA=0
const emoticon_data=[
    // left-eye-outline
    [127, -50, -80,  20],
    [0, -200, 0, 200],
    copyX(17, 2), // M
    "#left-eye-outline:1a", [  23,   2,  68,   1], [  -4,  24, -45,  34],
    "#left-eye-outline:1b", [  22,   2,  59,   1], [   2,  14,  25,  14],
    "#left-eye-outline:2", [  18,   2,  20,   1], [   7,  14,  75,  14],
    "#left-eye-outline:3a", [   5,  12,  -6, -10], [  11,-120, 115,  31],
    "#left-eye-outline:3b", [ -21,   0, -80,  -6], [   9,-137,  95,   9],
    "#left-eye-outline:4", [ -28,  19, -40, -20], [   1,  17,  15,  -5],
    "#left-eye-outline:5a", [ -23,  -4, -68, -37], [  -6,-127, -59,  -1],
    "#left-eye-outline:5b", [   2, -14, -27, -29], [ -12,-131,-125,  19],
    "#left-eye-outline:6", [  18,   2,  17,   1], [  -8,   2, -85,  24],
    // left-lens
    [  0,   0,   0,  20], [  0,   -30,   0,  0],// #left-lens
    [  4,   0,  30,   0], // #pupil[radius]
    [  2,   15,  5,   0], // #glare[radius]
    // left-lid-shadow
    /* 35 */              [ -15,-100,   0,   0],
    "#left-lid-shadow:2", [  -3,  29, -26, -11], [ -11, -81, -61,  42],
    /* -40 */             [   5, -50,   0,   0],
    // right-eye
    [70, 0, 0, -40],
    // right-lid-shadow
    /* 200 */             copyX(-5, 1),
    "#right-lid-shadow:2", [  52, -35, -74, 106], [ -16, -86, -82,  86],
    /* 125 */             copyX(-5,1 ),
    // left-eye-brow
    "#left-eye-brow:1", [ 104,   2,  26, 115], [ 103,-128,-159, 211],
    "#left-eye-brow:2", [  84,  21,  -9,  82], [ 102,-158,-151,  87],
    "#left-eye-brow:3", [  62,  21, -39,  58], [ 103, -58, -84, -49],
    [  4, -10,  10, 10],
    // teeth
    [ 27,   50,  20,   0],
    [ -2,    20, -60,   0],
    // lips
    "#lips:1", [ 164,  25,  44,   0], [ 188,-116, -27,   1],
    "#lips:2", [ 156,  25,  67, -50], [ 194, -17,  39,  -4],
    "#lips:3", [ 144,   3,  53, -55], [ 196,  28,  53,  10],
    /* 125 */             copyX(-1,1),
    mirrorX(-5),
    mirrorX(-9),
    "#lips:6", [  93, -25, -67,  50], [ 184, -16, -61,   4,-327],
    "#lips:7", [ 107,  -3, -53,  55], [ 184,  29, -61,   8,-100],
    /* 125 */             [  184, 29, -62,   8, -50],
    "mirror#lips:6", [ 157,  25,  67, -50], [ 184, -16, -61,   4],
    copyX(-18, 2),
    // wrinkle-left-brow
    "#wrinkle-left-brow:1", [ 105,  12,  31,  64], [  94, -64,-157, 131],
    "#wrinkle-left-brow:2", [ 114, -17,  -1,  82], [ 101,-104,-193, 182],
    "#wrinkle-left-brow:3", [ 113,   1,  -8,  52], [ 108,-117,-181, 197],
    // wrinkle-left-cheek
    "#wrinkle-left-cheek:1", [  73, -76, -37, -11, -29], [ 185,-145, -31,  34,  22],
    "#wrinkle-left-cheek:2", [  82,  -7,  -5,  35, -81], [ 179, -29, -51,  40,-258],
    "#wrinkle-left-cheek:3", [  95, -56,  -7,  28,  81], [ 164, -70, -51,  -3, -53],
    [0.5, 0, 0, 0, 10],
    "mirror:1#wrinkle-left-cheek:1", [ 177,  76,  37,  11], [ 185,-145, -31,  34],
    "mirror:2#wrinkle-left-cheek:2", [ 168,   7,   5, -35], [ 179, -29, -51,  40],
    "mirror:3#wrinkle-left-cheek:3", [ 155,  56,   7, -28], [ 164, -70, -51,  -3],
    // nose-path
    [165,  -50, -80,   0], // nose left
    [ -4,  -20,  -5,   0],
    [ -9,  -30, -10, -20],
    [165,  -50, -80,   0], // nose right
    [161,  -70, -80,  -0],
    "#nose:6", [ 140,  10,   0,   0], [ 163, -60, -80,   0],
    "#nose:5", [ 143,   1,  -3,  -3], [ 159, -58, -78,   9],
    "#nose:8", [ 136,   9, -10,  -2], [ 141, -39, -67,  91],
];

function emoticon_svg(v, a, p, c) {
  const X = C => [1, v/500-0.1, a/500-0.1, p/500-0.1, c/1000].reduce((a,b,i) => a + b*(C[i] || 0), 0);
  const data = emoticon_data.map(c => Array.isArray(c) ? X(c) : c);
  var i=0;
  while (i< data.length) {
      if (typeof data[i] == 'function') {
          var inserted= data[i](data,i,X);
          data.splice.apply(data, [i, 1].concat(inserted));
      }
      i++;
  }
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
      '    <path d="M ?,? Q ?,? ?,?" id="wrinkle-left-cheek" fill="none" stroke="black" stroke-width="?"/>',
      '    <path d="M ?,? Q ?,? ?,?" id="wrinkle-right-cheek" fill="none" stroke="black" stroke-width="0.5"/>',
      '  </g>',
      '  <g id="nose">',
      '    <path d="M 123,? q -3,? ?,0 M 132,? Q 137,? ?,? T ?,? ?,?" id="nose-path" fill="none" stroke="black"/>',
      '  </g>',
      controls_svg && controls_svg(X) || '',
      '</svg>'
    ].join("\n").replace(/\?/g, () => data[index++]);
}
