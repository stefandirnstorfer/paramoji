function emoticon_svg(v, a, p, c) {
    function head(v, a, p, c) {
      var h1= 19 * v;
      var data = [
        36, 36, // M
        36+h1, 36-h1, // C
        36+h1, -36+h1,
        36, -36,
        36-h1, -36-h1, // C
        -(36-h1), -36-h1,
        -36, -36,
        -36-h1,-36+h1, // C
        -36-h1,36-h1,
        -36,36,
        -(36-h1),36+h1, // C
        36-h1,36+h1,
        36,36];
      var scale = x => -(2*p-1)*(x/(36+h1) + (p-0.5)/2)/1.25
      for (var i=0; i<13; i++) data[2*i] += Math.sign(data[2*i]) *(36-h1)*scale(data[2*i+1])
      var index=0;
      return ('<path d="M ?,? C ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? Z"'+
           'style="fill:#e9c6afa0; stroke-width:1px; stroke:black"/>').replace(/\?/g, () => data[index++]);

    }

    function eye() {
      var k= -(20 * v*(2-v));
      var j= 20 * (1-v*v);
      var h= a*k + (1-a)*(k+j)/2
      var l= a*j + (1-a)*(k+j)/2
      var o= 5 + a*5;
      var data = [
        15, 0, // M
        15, h*2/3, //C
        o, h,
        0, h,
        -o, h, // C
        -15, h*2/3,
        -15,0,
        -15, l*2/3,//C
        -o, l,
        0, l,
        o, l, // C
        15, l*2/3,
        15, 0
      ];
      var index=0;
      return ('<path d="M ?,? C ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? Z" '+
           'style="fill:white; stroke-width:1px; stroke:black"/>').replace(/\?/g, () => data[index++]);
    }

    function mouth() {
      var s= 1+v*v/3;
      var k= -(20 * (1-v*v));
      var j= s*20 * v*(2-v);
      var h= a*k + (1-a)*(k+j)/2
      var l= a*j + (1-a)*(k+j)/2
      var o= 5 + a*5;
      var data = [
        15, 0, // M
        15, h*2/3, //C
        o, h,
        0, h,
        -o, h, // C
        -15, h*2/3,
        -15,0,
        -15, l*2/3,//C
        -o, l,
        0, l,
        o, l, // C
        15, l*2/3,
        15, 0
      ];
      for (var i=0; i<13; i++) {
        data[2*i] *= 1+v*v/2;
        data[2*i+1] -= 10*v*v
      }
      var index=0;
      return ('<path d="M ?,? C ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? Z" '+
           'style="fill:white; stroke-width:1px; stroke:black"/>').replace(/\?/g, () => data[index++]);
    }

  a=a/100;
  v=v/100;
  p=p/100;
  c=c/100;
  var h1= 19 * v;
  var data = [
    c/3,
    a/2+0.5,
    (30 - 60*p),
    (-30 + 60*p)
  ];
  var index=0;
  return [
      '<svg height="100%" version="1.1" viewBox="0 0 100 100" width="100%" xmlns="http://www.w3.org/2000/svg">',
      '  <g id="head" transform="matrix(1,?,0,1,50,50) scale(?)">',
      head(v,a,p,c),
      '<g transform="translate(18,-17) rotate(?)">'+eye()+'</g>',
      '<g transform="translate(-18,-17) rotate(?)">'+eye()+'</g>',
      '<g transform="translate(0,25)">'+mouth()+'</g>',
      '  </g>',
      '</svg>'
    ].join("").replace(/\?/g, () => data[index++]);
}
