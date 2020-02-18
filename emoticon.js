function emoticon_svg(v, a, p, c, e) {
    var id=0;
    a=a/100;
    v=v/100;
    p=p/100;
    c=c/100;
    ee=Math.max(0,e/50-1);
    es=Math.max(0,1-e/50);
    e=e/100;
    function t(body,x,y,a) {
        return '<g transform="translate('+x+','+y+') rotate('+(a||0)+')">'+body+'</g>'
    }
    function p13(data) {
        data.push(data[0]);
        data.push(data[1]);
        return 'M ?,? C ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? Z'.replace(/\?/g, () => data.shift())
    }
    function clip(path, body) {
      id += 1;
      return '<defs><clipPath id="id-'+id+'-path"><use href="#id-'+id+'"/></clipPath></defs>' +
        '<g clip-path="url(#id-'+id+'-path)">'+body+'</g>' +
        '<path id="id-'+id+'" d="'+path+'" style="stroke-width:1px; stroke:black; fill:none"/>';
    }
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
        36-h1,36+h1
        ];
      var scale = x => -(2*p-1)*(x/(36+h1) + (p-0.5)/2)/1.25
      for (var i=0; i<12; i++) data[2*i] += Math.sign(data[2*i]) *(36-h1)*scale(data[2*i+1])
      return '<path d="'+p13(data)+'" '+
        'transform="matrix(1,?,0,1,0,0)" '.replace('?', -c/5) +
        'style="fill:#00000030; stroke-width:1px; stroke:black"/>'
    }

    function eye(no) {
      var a2= (no==0 ? a : a*(1-c/2)) * (1-ee)*(1+es/2);
      var k= -(20 * v*(2-v));
      var j= 20 * (1-v*v);
      var h= a2*k + (1-a2)*(k+j)/2
      var l= a2*j + (1-a2)*(k+j)/2
      var o= 5 + a2*5;
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
        15, l*2/3];
      return clip(p13(data),
        t('<circle r="50" fill="white"/><circle r="5"/>',
            (20*no-10)*(p-0.5), Math.min(Math.max(0,.7*h),.7*l)));
    }

    function mouth() {
      var a2=a*(1-es)*(1+ee/2);
      var s= 1+v*v/3;
      var k= -(20 * (1-v*v));
      var j= s*20 * v*(2-v);
      var h= a2*k + (1-a2)*(k+j)/2
      var l= a2*j + (1-a2)*(k+j)/2
      var o= 5 + a2*5;
      var data = [
        15, 0, // M
        15, h*2/3 + 2*a2*c, //C
        o,  h + 5*a2*c,
        0, h - 2*c,
        -o, h - (5 + 5*a2)*c, // C
        -15, h*2/3 - 15*c,
        -15, 0,
        -15, l*2/3,//C
        -o, l,
        0, l,
        o, l, // C
        15, l*2/3,
        15, 0
      ];
      for (var i=0; i<13; i++) {
        data[2*i] *= (1+v*v/2)*(1-es/2);
      }
      var index=0;
      return t(clip(p13(data),
        '<rect x="-50" width="100" y="-50" height="100"/>' +
        t('<rect x="-15" rx="5" width="30" height="22" fill="white"/>', 0, (h+l)/2 - a*8 - 22) +
        t('<rect x="-15" rx="5" width="30" height="22" fill="white"/>', 0, (h+l)/2 - a*10*(1-v) + 13)
      ), 0, (20*(1-p) - 10*v + 16) -10*v*v)
    }

  return '<svg height="100%" version="1.1" viewBox="-50 -50 100 100" width="100%" xmlns="http://www.w3.org/2000/svg">' +
      '  <g id="head" transform="scale('+(a/2.1+0.5)+')">' +
      head(v,a,p,c) +
      t(
        t(eye(0), 18 + 10*(v-0.5)*(p-0.5), 0, 30 - 60*p) +
        t(eye(1), -18 - 10*(v-0.5)*(p-0.5), 0, -30 + 60*p), 0, 25*(1-p) -26) +
      mouth() +
      '</g></svg>';
}
