function emoticon_svg_raw2(v,a,p) {
  const X = c => [1, v/500-0.1, a/500-0.1, p/500-0.1].reduceRight((a,b) => a + b*c.pop(), 0);
  const curve = (x1, y1, x2, y2, offset) => {
      const dx= x2-x1,
          dy= y2-y1,
          l  = Math.sqrt(dx*dx+dy*dy),
          nx= dy/l * offset,
          ny=-dx/l * offset;
      return [
          (x1+x2)/2 + nx,
          (y1+y2)/2 + ny
      ];
  };
  const curveX = c => ((data,i) => curve(data[i-2], data[i-1], data[i+1], data[i+2], X(c)));
  const copyX = di => ((data,i) => [data[i+di], data[i+di+1]])
  let data=[
      // left-eye-outline
      copyX(8), // M
      curveX([8, 0, 70, 0]), // right bow
      [105,  40,  20,  20], [136, -80,  -30,  70], // right bottom
      curveX([10, -80, 120, 0]), // lower lid
      [ 60,   0,   0,  40], [128,  30, -81, -80], // left
      curveX([8, 80, 70, 70]), // upper lid
      [105, -40,  -0,  90], [115, -100,-170, 140], // right top
      // left-lens
      [ 90,   0,   0,  30], [127, -50, -80,  20], // #left-lens
      [  4,   0,  30,   0], // #pupil[radius]
      [  2,   5,  15,   0], // #glare[radius]
      // left-lid-shadow
      [120, -50, -150, 110],
      (data,i) => curve(127, data[i-1], 50, data[i+1], X([-20, -120, -120, 40])),
      [135, -30, -90, -100],
      // right-eye
      [70, 0, 0, -60],
      // right-lid-shadow
      [120,  0, -140, -100],
      (data,i) => curve(200, data[i-1], 125, data[i+1], X([-20, -120, -120, 40])),
      [130, -80, -140, 100],
      // left-eye-brow
      [ 105,  -15,   0,   150], [ 100, -137, -169,  270],
      curveX([-2, -80, 20, -100]),
      [  63,   0,  -20,   60], [ 105,  -80, -140,  -20],
      [  4, -10,  10, 10],
      // upper-teeth
      [  0,    0, -70,   0],
      // lower-teeth
      [ 22,   20,  20,   0],
      // mouth-outline
      [163,  23,  53,   2],
      [188,-149, -44,  17],
      [152,  59,  63, -35],
      [197, -53,  -8,   9],
      [138,  30,  16,  -7],
      [197,   4,  26,  -0],
      [198,   4,  27,  -0],
      [112, -30, -16,   7],
      [197,   4,  26,  -0],
      [ 98, -59, -63,  35],
      [197, -53,  -8,   9],
      [ 87, -23, -53,  -2],
      [188,-149, -44,  17],
      [ 98,  11, -67,  36],
      [184, -46, -99,  38],
      [112, -13, -23,  23],
      [185, -14, -95,  -7],
      [185, -15, -96,  -7],
      [138,  13,  23, -23],
      [185, -14, -95,  -7],
      [152, -11,  67, -36],
      [184, -46, -99,  38],
      [163,  23,  53,   2],
      [188,-149, -44,  17],
      // wrinkle-left-brow
      [114, -34, -32, 137],
      [ 96,-122,-210, 130],
      [116, -28, -22, 122],
      [ 99,-134,-215, 182],
      [116, -18, -19,  89],
      [102,-133,-216, 218],
      [115, -13, -12,  74],
      [104,-134,-213, 224],
      // wrinkle-left-cheek
      [ 78, -81, -43,  -2],
      [182,-172, -45,  22],
      [ 81, -55, -48,  31],
      [178, -56, -78,  31],
      [ 85, -73, -26,  41],
      [173, -41, -86,  32],
      [ 92,-112,  -2,  18],
      [170, -34, -74, -17],
      // nose-path
      [115,  11,  -9,  -4],
      [166, -11, -79,  -4],
      [116,  13,  -1,  -1],
      [163, -14, -78,  -2],
      [121,  -7,   2,   3],
      [163, -19, -95,   4],
      [124,   1,  -2,  -1],
      [164, -20, -87,   7],
      [135,   9,  41, -15],
      [134,  -9, -15,   3],
      [136,   6,  60,  -6],
      [148,  -5, -51,  -7],
      [147,   1,  19,  -4],
      [158,  -7, -66, -11],
      [143,  -1,  14,   2],
      [163, -12, -72,  -7],
      [140,  -4,   7,   4],
      [167, -20, -76,   3],
      [137,   4,   2,  -7],
      [161, -20,-105,  -0],
      [132,   4,  -3,  -3],
      [166, -17, -89,   2],
  ]
  data = data.map(c => Array.isArray(c) ? X(c) : c);
  var i=0;
  while (i< data.length) {
      if (typeof data[i] == 'function') {
          var inserted= data[i](data,i);
          data.splice.apply(data, [i, 1].concat(inserted));
      }
      i++;
  }
  var index=0;
  return [
      '<svg height="100%" version="1.1" viewBox="0 0 250 250" width="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
      '  <defs id="defs">',
      '    <clipPath id="clipPath-left-eye">',
      '      <use xlink:href="#left-eye-outline"/>',
      '    </clipPath>',
      '    <clipPath id="clipPath-right-eye">',
      '      <use transform="matrix(-1,0,0,1,250,0)" xlink:href="#left-eye-outline"/>',
      '    </clipPath>',
      '    <clipPath id="clipPath-mouth">',
      '      <use xlink:href="#mouth-outline"/>',
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
      '    <use id="right-eye-outline" transform="matrix(-1,0,0,1,250,0)" xlink:href="#left-eye-outline"/>',
      '    <g clip-path="url(#clipPath-right-eye)" id="right-eyeball">',
      '      <use id="right-lens" x="?" xlink:href="#left-lens"/>',
      '      <path d="M 125,70 L 180,70 L 200,? Q ?,? 125,? Z" id="right-lid-shadow" opacity="0.25" fill="black"/>',
      '    </g>',
      '  </g>',
      '  <path d="M ?,? Q ?,? ?,?" id="left-eye-brow" stroke-width="?" stroke="#292929" fill="none"/>' +
      '  <use id="right-eye-brow" transform="matrix(-1,0,0,1,250,0)" xlink:href="#left-eye-brow"/>',
      '  <g id="mouth">',
      '    <g clip-path="url(#clipPath-mouth)" id="mouth-interior">',
      '      <rect height="70" fill="black" id="mouth-background" width="120" x="65" y="160"/>',
      '      <path d="M 94.8,211 C 94.5,191 111,190 127,189 145,188 158,193 158,211 137,211 116,211 94.8,211 Z" id="tongue" style="fill:#800f08;stroke:none"/>',
      '      <g id="upper-teeth" transform="matrix(1,0,0,1,0.103,?)">',
      '        <use id="tooth-02" transform="matrix(1,0.14,0,1,-24,-18)" xlink:href="#tooth-04"/>',
      '        <use id="tooth-03" transform="matrix(1,0.05,0,1,-12,-6)" xlink:href="#tooth-04"/>',
      '        <rect height="15" id="tooth-04" rx="2" ry="2" fill="white" stroke="black" width="10" x="118" y="174"/>',
      '        <use id="tooth-05" transform="matrix(1,-0.05,0,1,12,6)" xlink:href="#tooth-04"/>',
      '        <use id="tooth-06" transform="matrix(1,-0.14,0,1,24,16)" xlink:href="#tooth-04"/>',
      '      </g>',
      '      <g id="lower-teeth" transform="matrix(1,0,0,1,0.103,?)">',
      '        <use id="tooth-09" x="-24" xlink:href="#tooth-04"/>',
      '        <use id="tooth-10" x="-12" xlink:href="#tooth-04"/>',
      '        <use id="tooth-11" xlink:href="#tooth-04"/>',
      '        <use id="tooth-12" x="12" xlink:href="#tooth-04"/>',
      '        <use id="tooth-13" x="24" xlink:href="#tooth-04"/>',
      '      </g>',
      '    </g>',
      '    <path d="M ?,? C ?,? ?,? 125,? ?,? ?,? ?,? ?,? ?,? 125,? ?,? ?,? ?,? Z" id="mouth-outline" style="fill:none;stroke:#000000;stroke-width:1px"/>',
      '  </g>',
      '  <g id="wrinkles">',
      '    <path d="M ?,? C ?,? ?,? ?,?" id="wrinkle-left-brow" style="fill:none;stroke:#000000;stroke-width:0.5"/>',
      '    <path d="M ?,? C ?,? ?,? ?,?" id="wrinkle-left-cheek" style="fill:none;stroke:#000000;stroke-width:0.5"/>',
      '    <use height="250" id="wrinkle-right-brow" transform="matrix(-1,0,0,1,250,0)" width="250" x="0" xlink:href="#wrinkle-left-brow" y="0"/>',
      '    <use height="250" id="wrinkle-right-cheek" transform="matrix(-1,0,0,1,250,0)" width="250" x="0" xlink:href="#wrinkle-left-cheek" y="0"/>',
      '  </g>',
      '  <g id="nose">',
      '    <path d="M ?,? C ?,? ?,? ?,? M ?,? C ?,? ?,? ?,? ?,? ?,? ?,?" id="nose-path" style="fill:none;stroke:#000000"/>',
      '  </g>',
      '  <path d="M ?,? Q ?,? ?,?" id="left-eye-brow-copy" stroke-width="4" stroke="red" fill="none"/>',
      '</svg>'
    ].join("\n").replace(/\?/g, () => data[index++]);
}
