function emoticon_svg(v, a1, a2, p, c, w) {

    v = v / 50 -1;
    a1 = a1 / 100;
    a2 = a2 / 100;
    p = p / 50 -1;
    c = c / 100;
    const v1 = (v+1)/2
    const emoticon_data=[[51,-2,-10,0,0,0,0,0,0],[0,22,0,0,-26],[0,0,-11,0],[-8,0,-8,0],[0,
        0,-4,0],[-8,0,-8,0],[0,0,2,0],[-8,0,-3,0],[0,0,9,0],[-4,0,1,0],[0,-6,13,0],[5,
        0,12,0],[0,-9,11,0],[11,0,8,0],[5,0,12,0],[0,-9,-11,0],[-4,0,5,0],[0,-6,-13,
        0],[0,0,-11,0],[0,0,0,0,-1],[0,-2,0,0,-1],[0.5,0,4,0],[5,1,-4,0,8],[2,-9,-17,
        0,5],[0,-22,0,0,26,-10,0,20],[0,0,-11,0,0,0,10],[8,0,8,0,0,0,-6],[0,0,-4,0,0,
        0,4],[8,0,8,0,0,0,-6],[0,0,2,0,0,0,-2],[8,0,3,0,0,0,-2],[0,0,9,0,0,0,-9],[4,
        0,-1,0],[0,-6,13,0,0,-3,-12,6],[-5,0,-12,0],[0,-9,11,0,0,-5,-8,10],[-11,0,-8,
        0],[-5,0,-12,0],[0,-9,-11,0,0,-5,9,10],[4,0,-5,0],[0,-6,-13,0,0,-3,12,6],[0,
        0,-11,0,0,0,10],[0,0,0,0,2],[2,1,-10,0,-6,3],[2,-9,-17,0,4,20],[0,0,0,0,0,0.4],
        [70,-2,-2.5,-7.5,-1,0,0,0,1],[-3,0,0.25,0.75,0],[-14,-2,1.5,4.5,2],[25,-2,0,
            -6,4,-7,0,0],[77,-10,0,-2,0,-1],[29,0,0,-3,4,-9,0,0],[76,-4,0,-8,-1,-17,-1,1,
            1],[37,-2,-0.4,-1.6,4,3],[68,-3,-1.8,-7.2,-4,-5,-1,2,0,2],[75,2,0,6,-4],[77,
            -10,0,-2,0,0],[71,0,0,3,-3],[76,-4,0,-8,-1,0],[63,2,0.4,1.6,-2],[68,-3,-1.8,
            -7.2,-4],[80,4,0,6,-6,0,0,0,-2],[65,1,0,-5,-1,0,0,0,-2],[14,0,0,9,-2],[0,-12,
            0,-2,0,-3,0,6,-2],[10,0,0,11,-3],[0,-2,0,11,0,0,0,0,-9],[6,0,0,6,-3],[0,2,0,
            12,0,0,0,0,-5],[0,2,0,12,0,0,0,0,-4],[-10,0,0,-11,3],[0,-2,0,11,0,0,0,0,-2],
        [-14,0,0,-9,2],[0,-12,0,-2,0,-3,0,6,2],[-10,0,0,-11,3],[0,-2,0,-11,0,0,0,0,-5],
        [-6,0,0,-6,3],[0,2,0,-12,0,0,0,0,-3],[0,2,0,-12,0,0,0,0,-1],[10,0,0,11,-3],[0,
            -2,0,-11,0,0,0,0,-2],[14,0,0,9,-2],[0,-12,0,-2,0,-3,0,6,-2],[0,0,0,0,0,0.4,0,
            0.15,-0.25],[50,0,0,0,0,-12,0,0,6],[80,0,0,0,-2,-2,0,0,1],[59,2,1,0,-6],[42,
            -8,-21,0,12],[71,2,3,0,-5],[42,-11,-23,0,3],[79,1,6,0,-4],[42,-3,-20,0,-3],[1+w,
            -0.5,1,0,0.5],[62,0,-4,0,-2],[35,-5,-18,0,7],[56,2,0,0,-3],[41,-7,-24,0,9],[56,
            1,0,0,-1],[43,-8,-22,0,10],[0,0,0,0,0,1,3,2]]
    const dotprod = (X,Y) => X.reduce((a, b, i) => a + b*(Y[i] || 0), 0)
    var data = emoticon_data
        .map((C, i)=> {
            const V= [1, v, a1, a2, p, c, c*a1, c*v1, c*a2, c*p]
            return dotprod(V, C)
        })
    var index=0;
    const template= [
        '<svg height="100%" viewBox="0 0 100 100" width="100%">',
        '  <defs id="defs">',
        '    <clipPath id="clip-right-eye"><use href="#right-eye-outline"/></clipPath>',
        '    <clipPath id="clip-left-eye"><use href="#left-eye-outline"/></clipPath>',
        '    <clipPath id="clip-mouth"><use href="#lips"/></clipPath>',
        '  </defs>',
        '  <g id="eyes" transform="translate(68,?)">',
        '    <g id="right-eye">',
        '      <path transform="rotate(?)" d="M -8,? C ?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? -8,? Z" id="right-eye-outline" fill="white" stroke="black"/>',
        '      <g clip-path="url(#clip-right-eye)" id="right-eyeball">',
        '        <g id="right-lens" transform="translate(?,?)">',
        '          <circle r="5" fill="#9d4922" id="iris"/>',
        '          <circle r="?" id="pupil"/>',
        '          <circle r="1" cx="-2.5" cy="-1.5" fill="white" id="glare"/>',
        '        </g>',
        '        <path d="M -15,-20 H 20 V0 Q ?,? -15,-2 Z" id="right-lid-shadow" opacity="0.25" fill="black"/>',
        '      </g>',
        '    </g>',
        '    <g id="left-eye" transform="translate(-36,0)">',
        '      <path transform="rotate(?)" d="M 8,? C ?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? 8,? Z" id="left-eye-outline" fill="white" stroke="black"/>',
        '      <g clip-path="url(#clip-left-eye)" id="left-eyeball">',
        '        <use id="left-lens" x="?" href="#right-lens"/>',
        '        <path d="M -15,-20 H 15 V-2 Q ?,? -20,0 Z" id="left-lid-shadow" opacity="0.25" fill="black"/>',
        '      </g>',
        '    </g>',
        '  </g>',
        '  <path transform="matrix(1,?,0,1,53,?)" d="M -4,0 q -2,-2 -4,0 M -1,0 Q 3,-2 4,-1 T 6,? 4,?" id="nose" fill="none" stroke="black"/>',
        '  <path d="M ?,? Q ?,? ?,?" id="wrinkle-left-cheek" fill="none" stroke="black"/>',
        '  <path d="M ?,? Q ?,? ?,?" id="wrinkle-right-cheek" fill="none" stroke="black"/>',
        '  <g clip-path="url(#clip-mouth)" id="throat">',
        '    <rect fill="black" height="100" width="100"/>',
        '    <ellipse cx="50" cy="91" rx="15" ry="10" id="tongue" fill="#800f08"/>/',
        '    <g id="lower-teeth" transform="translate(0,?)">',
        '      <use x="-14" href="#tooth"/>',
        '      <use x="-7" href="#tooth"/>',
        '      <use href="#tooth"/>',
        '      <use x="7" href="#tooth"/>',
        '    </g>',
        '    <g id="upper-teeth" transform="translate(0,?)">',
        '      <use transform="matrix(1,0.14,0,1,-14,-8)" href="#tooth"/>',
        '      <use x="-7" href="#tooth"/>',
        '      <rect x="50.5" height="15" id="tooth" rx="2" ry="1" fill="white" width="6" stroke="black" stroke-width=".5"/>',
        '      <use transform="matrix(1,-0.14,0,1,7,7)" href="#tooth"/>',
        '    </g>',
        '  </g>',
        '  <path d="M ?,? C ?,? ?,? 0,? S ?,? ?,? C ?,? ?,? 0,? S ?,? ?,? Z"' +
        '        transform="matrix(1,?,0,1,?,?)" id="lips" fill="none" stroke="black"/>',
        '  <g id="right-eye-top">',
        '    <path d="M ?,? Q ?,? ?,?" id="right-eye-brow" stroke-width="?" stroke="black" fill="none"/>',
        '    <path d="M ?,? Q ?,? ?,?" id="wrinkle-right-brow" fill="none" stroke="black"/>',
        '  </g>',
        '  <use id="left-eye-brow" transform="matrix(-1,0,0,1,100,?)" href="#right-eye-top"/>',
        '</svg>'
    ].map(x =>
        x.includes("<path") && !x.includes("stroke-width")
            ? x.replace("<path", "<path stroke-width='"+w+"'")
            : x
    )
    return template.join("\n")
        .replace(/\?/g, () => data[index++])
        .replace(/svg/, 'svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"')
        .replace(/ href=/g, ' xlink:href=')
}

module.exports.emoticon_svg = emoticon_svg
