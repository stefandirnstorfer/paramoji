const emoticon_data=[
    [127, -50, -80,  20]];

function emoticon_head(v, a, p, c) {
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
       '         style="fill:#e9c6afa0; stroke-width:1px; stroke:black"/>').replace(/\?/g, () => data[index++]);

}

function emoticon_svg(v, a, p, c) {
  a=a/100;
  v=v/100;
  p=p/100;
  c=c/100;
  var h1= 19 * v;
  var data = [
    c/3,
    a/2+0.5];
  var index=0;
  return [
      '<svg height="100%" version="1.1" viewBox="0 0 100 100" width="100%" xmlns="http://www.w3.org/2000/svg">',
      '  <g id="head" transform="matrix(1,?,0,1,50,50) scale(?)">',
      emoticon_head(v,a,p,c),
      '  </g>',
      '</svg>'
    ].join("\n").replace(/\?/g, () => data[index++]);
}
