const range = len => len>0 ? range(len-1).concat(len-1) : [];
const copyX = (di, len) => (data,i) => range(len).map(offset => data[i+di+offset]);
const mirrorX = (di) => (data,i) => [250 - data[i+di], data[i+di+1]];

const emoticon_data=[
    // left-eye-outline
    copyX(11, 2), // M
    "#left-eye-outline:1", [ 113,  10, 102,  -5], [ 129,-115,-113,  55],
    "#left-eye-outline:2", [ 103,  66,  69,  12], [ 138, -93, -34,  34],
    "#left-eye-outline:3", [  78,  53,  -1,   4], [ 142,-103,  70,  11],
    "#left-eye-outline:4", [  62,   5, -45,  22], [ 130,  34, -63, -14],
    "#left-eye-outline:5", [  80, -40, -49,  22], [ 117,-152,-191, -10],
    "#left-eye-outline:6", [ 106, -25,  17,  52], [ 120,-105,-175,  90],
    // left-lens
    [ 90,   0,   0,  30], [127, -50, -80,  20], // #left-lens
    [  4,   0,  30,   0], // #pupil[radius]
    [  2,   15,  5,   0], // #glare[radius]
    // left-lid-shadow
    /* 127 */             [120, -50,-150, 110],
    "#left-lid-shadow:2", [  79,  64, -54,  64], [ 113,-224,-181,  -2],
    /* 50 */              [135, -30, -90,-100],
    // right-eye
    [70, 0, 0, -60],
    // right-lid-shadow
    /* 200 */             [120,  0,-140, -100],
    "#right-lid-shadow:2", [ 155,  58, -52, -30], [ 110,-204,-201,  59],
    /* 125 */             [130, -80,-140, 100],
    // left-eye-brow
    "#left-eye-brow:1", [ 104,  -3,  -4, 146], [ 102,-127,-194, 256],
    "#left-eye-brow:2", [  84,  -9,   0,  79], [ 101,-138,-151,  81],
    "#left-eye-brow:3", [  62,  11,  -9,  48], [ 103, -60,-120, -30],
    [  4, -10,  10, 10],
    // upper-teeth
    [  0,    0, -70,   0],
    // lower-teeth
    [ 22,   20,  20,   0],
    // lips
    "#lips:1", [ 164,  29,  11,   3], [ 189,-164,  -9,  24],
    "#lips:2", [ 157,  29,  25, -39], [ 196, -28,  51,   8],
    "#lips:3", [ 143,   3,  11, -17], [ 198,  13,  44,  -4],
    /* 125 */             copyX(-1, 1),
    mirrorX(-5),
    mirrorX(-9),
    "#lips:6", [  97, -18, -27,  32], [ 184,   3, -74,   5],
    "#lips:7", [ 111, -47, -35,  42], [ 186,  13, -74,  -5],
    /* 125 */             copyX(-1, 1),
    mirrorX(-5),
    copyX(-18, 2),
    // wrinkle-left-brow
    "#wrinkle-left-brow:1", [ 104,  -1,  19,  51], [  93, -72,-164, 123],
    "#wrinkle-left-brow:2", [ 114, -17,  -1,  82], [ 101,-104,-193, 182],
    "#wrinkle-left-brow:3", [ 112, -17,  -9,  54], [ 108,-127,-185, 207],
    // wrinkle-left-cheek
    "#wrinkle-left-cheek:1", [  73, -77, -24,  -4], [ 186,-157, -55,  29],
    "#wrinkle-left-cheek:2", [  82, -25, -15,  28], [ 178, -45, -35,  40],
    "#wrinkle-left-cheek:3", [  95,-108,   5,  20], [ 166, -42, -81, -19],
    // nose-path
    [165,  -50, -80,   0], // nose left
    [ -4,  -20,  -5,   0],
    [ -9,  -30, -10, -20],
    [165,  -50, -80,   0], // nose right
    [161,  -70, -80,  -0],
    "#nose:6", [140,   10,   0,   0], [163, -60, -80, 0],
    "#nose:5", [ 143,   1,  -3,  -3], [ 159, -58, -78,   9],
    "#nose:8", [ 136,   9, -10,  -2], [ 141, -39, -67,  91],
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
