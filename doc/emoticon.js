
const emoticon_data=[[1,0,0,0,-5],[127,-50,-80,20],[0,200,0,-200],[-18,-1,-17],[-7,1,
    -64,24],[-23,-1,-68],[-3,23,-24,34],[-22,-1,-63],[2,17,27,16],[-18,-1,-24],[7,
    18,77,12],[-6,7,13,16],[10,-112,107,32],[21,34,98,5],[7,-170,78,9],[27,6,51,
    1],[0,-67,8,-11],[21,29,104,3],[-6,-160,-54,7],[-3,7,48,19],[-11,-124,-104,27],
    [-18,-1,-17],[-7,1,-64,24],[0,0,0,-20],[0,-30],[4,0,30],[2,15,5],[7,25,-34,154],
    [-9,-220,-163,92],[-70,0,0,40],[-71,26,-55,-117,50],[-7,-208,-160,51,100],[146,
        -2,-26,-115],[103,-128,-159,211],[166,-21,9,-82],[102,-158,-151,87],[188,-21,
        39,-58],[103,-58,-84,-49],[4,-10,10,10],[145,-12,-31,-64],[94,-64,-157,131],
    [136,17,1,-82],[101,-104,-193,182],[137,-1,8,-52],[108,-117,-181,197],[0,0,0,
        0,80],[0,0,0,0,3],[165,-50,-80],[-4,-20,-5],[-9,-30,-10,-20],[165,-50,-80],[161,
        -70,-80],[140,10],[163,-60,-80],[143,1,-3,-3],[159,-58,-78,9],[136,9,-10,-2],
    [141,-39,-67,91],[27,50,20],[-2,20,-60],[160,25,94,-3],[187,-116,-26,-42],[154,
        26,92,-59],[193,-10,34,-28],[142,15,56,-42],[195,20,54,-27],[195,20,54,-27],
    [96,-26,-92,59],[193,-10,34,-28],[90,-25,-94,3],[187,-116,-26,-42],[97,-26,-92,
        59],[183,-26,-66,-25,-254],[108,-15,-56,42],[182,12,-82,-16,-74],[182,12,-78,
        -16,-35],[153,26,92,-59],[183,-26,-66,-25],[160,25,94,-3],[187,-116,-26,-42],
    [72,-61,-52,16,-9],[187,-158,-18,1,6],[84,-17,-39,25,-95],[179,-47,-47,22,-256],
    [97,-69,-20,15,64],[164,-68,-49,-1,-51],[178,61,52,-16],[187,-158,-18,1],[166,
        17,39,-25],[179,-47,-47,22],[153,69,20,-15],[164,-68,-49,-1]]
const expressable=[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.5,0.5,1,1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]

function emoticon_svg(v, a, p, c, e) {
    a = a / 50 -1;
    v = v / 50 -1;
    p = p / 50 -1;
    c = c / 100;
    e = e / 50 -1;
    const a2=a/500-0.1
    const dotprod = (X,Y) => X.reduce((a, b, i) => a + b*(Y[i] || 0), 0)
    const e2 = e/500-0.1
    var data = emoticon_data
        .filter(x => typeof(x) != 'string')
        .map((C, i)=> {
            const V= [1, v*0.1, 0.1*Math.min(1.5,Math.max(-1,a + expressable[i]*e)), 0.1*p, 0.1*c]
            return dotprod(V, C)
        })
    var index=0;
    return [
        '<svg height="100%" version="1.1" viewBox="0 0 250 250" width="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
        '  <style>path { stroke-width: 2px }</style>',
        '  <defs id="defs">',
        '    <clipPath id="clipPath-right-eye">',
        '      <use xlink:href="#right-eye-outline"/>',
        '    </clipPath>',
        '    <clipPath id="clipPath-left-eye">',
        '      <use id="left-eye-outline" transform="matrix(-1,0,0,?,-70,0)" xlink:href="#right-eye-outline"/>',
        '    </clipPath>',
        '    <clipPath id="clipPath-mouth">',
        '      <use xlink:href="#lips"/>',
        '    </clipPath>',
        '  </defs>',
        '  <path id="head" d="M 125,230 C 175,230 215,200 215,130 S 175,30 125,30 S 35,65 35,130 S 75,230 125,230 Z" stroke-width="1" stroke="black" fill="none"/>',
        '  <g id="eyes" transform="translate(160,?)">',
        '    <g id="right-eye">',
        '      <path transform="rotate(?)" d="M ?,? C ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? Z" id="right-eye-outline" fill="white" stroke="black"/>',
        '      <g clip-path="url(#clipPath-right-eye)" id="right-eyeball">',
        '        <g id="right-lens" transform="translate(?,?)">',
        '          <circle r="9" fill="#9d4922" id="iris"/>',
        '          <circle r="?" fill="black" id="pupil"/>',
        '          <circle r="?" cx="-5" cy="-3" fill="white" id="glare"/>',
        '        </g>',
        '        <path d="M -35,-30 H 40 V-5 Q ?,? -35,0 Z" id="right-lid-shadow" opacity="0.25" fill="black"/>',
        '      </g>',
        '    </g>',
        '    <g id="left-eye">',
        '      <use xlink:href="#left-eye-outline"/>',
        '      <g clip-path="url(#clipPath-left-eye)" id="left-eyeball">',
        '        <use id="right-lens" x="?" xlink:href="#right-lens"/>',
        '        <path d="M -110,-30 H -40 V -5 Q ?,? -110,0 Z" id="left-lid-shadow" opacity="0.25" fill="black"/>',
        '      </g>',
        '    </g>',
        '  </g>',
        '  <g id="right-eye-top">',
        '    <path d="M ?,? Q ?,? ?,?" id="right-eye-brow" stroke-width="?" stroke="#292929" fill="none"/>' +
        '    <path d="M ?,? Q ?,? ?,?" id="wrinkle-right-brow" fill="none" stroke="black" stroke-width="0.5"/>',
        '  </g>',
        '  <use id="left-eye-brow" transform="matrix(-1,0,0,1,250,?)" xlink:href="#right-eye-top"/>',
        '  <g id="nose" transform="matrix(1,?,0,1,132,0) translate(-132,0)">',
        '    <path d="M 123,? q -3,? ?,0 M 132,? Q 137,? ?,? T ?,? ?,?" id="nose-path" fill="none" stroke="black"/>',
        '  </g>',
        '  <g id="mouth">',
        '    <g clip-path="url(#clipPath-mouth)" id="mouth-interior">',
        '      <rect height="90" fill="black" id="mouth-background" width="120" x="65" y="140"/>',
        '      <path d="M 94.8,211 C 94.5,191 111,190 127,189 145,188 158,193 158,211 137,211 116,211 94.8,211 Z" id="tongue" fill="#800f08"/>',
        '      <g id="lower-teeth" transform="translate(0,?)">',
        '        <use x="-24" xlink:href="#tooth"/>',
        '        <use x="-12" xlink:href="#tooth"/>',
        '        <use x="0" xlink:href="#tooth"/>',
        '        <use x="12" xlink:href="#tooth"/>',
        '        <use x="24" xlink:href="#tooth"/>',
        '      </g>',
        '      <g id="upper-teeth" transform="translate(0,?)">',
        '        <use transform="matrix(1,0.14,0,1,-24,-18)" xlink:href="#tooth"/>',
        '        <use transform="matrix(1,0.05,0,1,-12,-6)" xlink:href="#tooth"/>',
        '        <rect height="20" id="tooth" rx="2" ry="2" fill="white" stroke="black" width="10" x="118" y="169"/>',
        '        <use transform="matrix(1,-0.05,0,1,12,6)" xlink:href="#tooth"/>',
        '        <use transform="matrix(1,-0.14,0,1,24,16)" xlink:href="#tooth"/>',
        '      </g>',
        '    </g>',
        '    <path d="M ?,? C ?,? ?,? 125,? S ?,? ?,? C ?,? ?,? 125,? S ?,? ?,? Z" id="lips" fill="none" stroke="black"/>',
        '    <path d="M ?,? Q ?,? ?,?" id="wrinkle-left-cheek" fill="none" stroke="black" stroke-width="0.5"/>',
        '    <path d="M ?,? Q ?,? ?,?" id="wrinkle-right-cheek" fill="none" stroke="black" stroke-width="0.5"/>',
        '  </g>',
        '</svg>'
    ].join("\n").replace(/\?/g, () => data[index++]);
}

module.exports.emoticon_svg = emoticon_svg
