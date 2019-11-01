const curve = (x1, y1, x2, y2, offset, a) => {
    if (!a) a=0.5;
    const dx= x2-x1,
        dy= y2-y1,
        l  = Math.sqrt(dx*dx+dy*dy),
        nx= dy/l * offset,
        ny=-dx/l * offset;
    return [
        ((1-a)*x1+a*x2) + nx,
        ((1-a)*y1+a*y2) + ny
    ];
};
const range = len => len>0 ? range(len-1).concat(len-1) : [];
const curveX = (c, a) => ((data,i,X) => curve(data[i-2], data[i-1], data[i+1], data[i+2], X(c), a));
const copyX = (di, len) => (data,i) => range(len).map(offset => data[i+di+offset]);
const mirrorX = (di) => (data,i) => [250 - data[i+di], data[i+di+1]];

const emoticon_data=[
    // left-eye-outline
    copyX(8, 2), // M
    curveX([8, 0, 70, 0]), // right bow
    [103,  40,  20,  20], [136, -80,  -30,  70], // right bottom
    curveX([10, -80, 120, 0]), // lower lid
    [ 62,   0,   0,  40], [128,  30, -81, -80], // left
    curveX([8, 80, 70, 70]), // upper lid
    [103, -40,  -0,  90], [115, -100,-170, 140], // right top
    // left-lens
    [ 90,   0,   0,  30], [127, -50, -80,  20], // #left-lens
    [  4,   0,  30,   0], // #pupil[radius]
    [  2,   5,  15,   0], // #glare[radius]
    // left-lid-shadow
    /* 127 */             [120, -50, -150, 110],
    (data,i,X) => curve(127, data[i-1], 50, data[i+1], X([-20, -120, -120, 40])),
    /* 50 */              [135, -30, -90, -100],
    // right-eye
    [70, 0, 0, -60],
    // right-lid-shadow
    /* 200 */             [120,  0, -140, -100],
    (data,i,X) => curve(200, data[i-1], 125, data[i+1], X([-20, -120, -120, 40])),
    /* 125 */             [130, -80, -140, 100],
    // left-eye-brow
    [ 105,  -15,   0,  140], [ 103, -137, -190,  250],
    curveX([-2, -80, -10, -100]),
    [  63,   0,  -20,   60], [ 105,  -80, -140,  -20],
    [  4, -10,  10, 10],
    // upper-teeth
    [  0,    0, -70,   0],
    // lower-teeth
    [ 22,   20,  20,   0],
    // lips
    "#lips:1", [163,  23,  53,   2], [188,-149, -44,  17],
    "#lips:2", [152,  59,  63, -35], [197, -53,  -8,   9],
    "#lips:3", [138,  30,  16,  -7], [197,  -16,  27, -7],
    /* 125 */             copyX(-1, 1),
    mirrorX(-5),
    mirrorX(-9),
    "#lips:6", [ 98,  11, -67,  36], [184, -46, -99,  38],
    "#lips:7", [112, -13, -23,  23], [185, -15, -96,  -7],
    /* 125 */             copyX(-1, 1),
    mirrorX(-5),
    copyX(-18, 2),
    // wrinkle-left-brow
    "#wrinkle-left-brow:1", [114,   0, -32,  70], [ 96,-122,-210, 130],
    "#wrinkle-left-brow:2", [115,   0, -32,  70], [100,-128,-211, 177],
    "#wrinkle-left-brow:3", [116,   0, -32,  70], [104,-134,-212, 224],
    // wrinkle-left-cheek
    "#wrinkle-left-cheek:1", [ 78, -81, -43,  -2], [182,-172, -45,  22],
    "#wrinkle-left-cheek:2", [ 85, -96, -22,   8], [176,-103, -59,   2],
    "#wrinkle-left-cheek:3", [ 92,-112,  -2,  18], [170, -34, -74, -17],
    // nose-path
    [165,  -50, -80,   0], // nose left
    [ -4,  -20,  -5,   0],
    [ -9,  -30, -10, -20],
    [165,  -50, -80,   0], // nose right
    [161,  -70, -80,  -0],
    [140,   10,   0,   0], [163, -60, -80, 0],
    curveX([-4,20,0,-20], 0.1),
    [136,   40,   0,  10], [138, -40,  -50,  90]
];

function emoticon_svg(v,a,p) {
  const X = c => [1, v/500-0.1, a/500-0.1, p/500-0.1].reduce((a,b,i) => a + b*c[i], 0);
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
      '      <use transform="matrix(-1,0,0,1,250,0)" href="#left-eye-outline"/>',
      '    </clipPath>',
      '    <clipPath id="clipPath-mouth">',
      '      <use href="#lips"/>',
      '    </clipPath>',
      '  </defs>',
      '  <g id="head">',
      '    <path d="M 125,230 C 175,230 215,200 215,130 S 175,30 125,30 S 35,65 35,130 S 75,230 125,230 Z" fill="#e9c6afa0"/>',
      '  </g>',
      '  <g id="left-eye">',
      '    <path d="M ?,? Q ?,? ?,? ?,? ?,? ?,? ?,? Z" id="left-eye-outline" fill="white" stroke="black" stroke-width="1"/>',
      '    <g clip-path="url(#clipPath-left-eye)" id="left-eyeball">',
      '      <g id="left-lens" transform="translate(?,?)">',
      '        <circle r="9" fill="#9d4922" id="iris"/>',
      '        <circle r="?" fill="black" id="pupil"/>',
      '        <circle r="?" cx="-5" cy="-3" fill="white" id="glare"/>',
      '      </g>',
      '      <path d="M 70,70 H 125 V ? Q ?,? 50,? Z" id="left-lid-shadow" opacity="0.25" fill="black"/>',
      '    </g>',
      '  </g>',
      '  <g id="right-eye">',
      '    <use id="right-eye-outline" transform="matrix(-1,0,0,1,250,0)" href="#left-eye-outline"/>',
      '    <g clip-path="url(#clipPath-right-eye)" id="right-eyeball">',
      '      <use id="right-lens" x="?" href="#left-lens"/>',
      '      <path d="M 125,70 L 180,70 L 200,? Q ?,? 125,? Z" id="right-lid-shadow" opacity="0.25" fill="black"/>',
      '    </g>',
      '  </g>',
      '  <path d="M ?,? Q ?,? ?,?" id="left-eye-brow" stroke-width="?" stroke="#292929" fill="none"/>' +
      '  <use id="right-eye-brow" transform="matrix(-1,0,0,1,250,0)" href="#left-eye-brow"/>',
      '  <g id="mouth">',
      '    <g clip-path="url(#clipPath-mouth)" id="mouth-interior">',
      '      <rect height="70" fill="black" id="mouth-background" width="120" x="65" y="160"/>',
      '      <path d="M 94.8,211 C 94.5,191 111,190 127,189 145,188 158,193 158,211 137,211 116,211 94.8,211 Z" id="tongue" fill="#800f08"/>',
      '      <g id="upper-teeth" transform="matrix(1,0,0,1,0,?)">',
      '        <use transform="matrix(1,0.14,0,1,-24,-18)" href="#tooth"/>',
      '        <use transform="matrix(1,0.05,0,1,-12,-6)" href="#tooth"/>',
      '        <rect height="15" id="tooth" rx="2" ry="2" fill="white" stroke="black" width="10" x="118" y="174"/>',
      '        <use transform="matrix(1,-0.05,0,1,12,6)" href="#tooth"/>',
      '        <use transform="matrix(1,-0.14,0,1,24,16)" href="#tooth"/>',
      '      </g>',
      '      <g id="lower-teeth" transform="matrix(1,0,0,1,0,?)">',
      '        <use x="-24" href="#tooth"/>',
      '        <use x="-12" href="#tooth"/>',
      '        <use x="0" href="#tooth"/>',
      '        <use x="12" href="#tooth"/>',
      '        <use x="24" href="#tooth"/>',
      '      </g>',
      '    </g>',
      '    <path d="M ?,? C ?,? ?,? 125,? S ?,? ?,? C ?,? ?,? 125,? S ?,? ?,? Z" id="lips" fill="none" stroke="black"/>',
      '  </g>',
      '  <g id="wrinkles">',
      '    <path d="M ?,? Q ?,? ?,?" id="wrinkle-left-brow" fill="none" stroke="black" stroke-width="0.5"/>',
      '    <path d="M ?,? Q ?,? ?,?" id="wrinkle-left-cheek" fill="none" stroke="black" stroke-width="0.5"/>',
      '    <use id="wrinkle-right-brow" transform="matrix(-1,0,0,1,250,0)" href="#wrinkle-left-brow"/>',
      '    <use id="wrinkle-right-cheek" transform="matrix(-1,0,0,1,250,0)" href="#wrinkle-left-cheek"/>',
      '  </g>',
      '  <g id="nose">',
      '    <path d="M 123,? q -3,? ?,0 M 132,? Q 137,? ?,? T ?,? ?,?" id="nose-path" fill="none" stroke="black"/>',
      '  </g>',
      controls_svg && controls_svg(X) || '',
      '</svg>'
    ].join("\n").replace(/\?/g, () => data[index++]);
}
