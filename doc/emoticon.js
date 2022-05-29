function emoticon_svg(v, a1, a2, p, c, w) {

    v = v / 50 -1;
    a1 = a1 / 100;
    a2 = a2 / 100;
    p = p / 50 -1;
    c = c / 100;
    const v1 = (v+1)/2
    const emoticon_data = [[51,-2,-10],[,22,,,-26],[,,-11],[-
        8,,-8],[,,-4],[-8,,-8],[,,2],[-8,,-3],[,,9],[
        -4,,1],[,-6,13],[5,,12],[,-9,11],[11,,8],[5,,
        12],[,-9,-11],[-4,,5],[,-6,-13],[,,-11],[,,,,
        -1],[,-2.5,,,-1.5],[.5,,5],[5,1,-4,,8],[2,-9,
        -17,,5],[,-22,,,26,-10,,20],[,,-11,,,,10],[8,
        ,8,,,,-6],[,,-4,,,,4],[8,,8,,,,-6],[,,2,,,,-2
    ],[8,,3,,,,-2],[,,9,,,,-9],[4,,-1],[,-6,13,,,
        -3,-12,6],[-5,,-12],[,-9,11,,,-5,-8,10],[-11,
        ,-8],[-5,,-12],[,-9,-11,,,-5,9,10],[4,,-5],[,
        -6,-13,,,-3,12,6],[,,-11,,,,10],[,,,,2],[2,1,
        -10,,-6,3],[2,-9,-17,,4,20],[,,,,,.4],[70,-2,
        -2.5,-7.5,-1,,,,1],[-3,,.25,.75],[-14,-2,1.5,
        4.5,1],[25,-4,,-6,2,-7],[77,-10,,-2,,-1],[29,
        -2,,-3,2,-9],[76,-1,,-8,-1,-17,-1,1,1],[37,-5
        ,,,2,4],[68,-1,-2,-7,-2,-6,-4,5,,2],[75,4,,6,
        -2],[77,-10,,-2],[71,2,,3,-2],[76,-1,,-8,-1,,
        ,1],[65,4,,-1,-2,-2],[68,-1,-2,-7,-2,-3,-1,3]
        ,[80,5,,6,-6,,,,-2],[66,2,,-5,-1,,,,-2],[14,1
            ,,9,-1],[,-12,,-2,,-3,,6,-2],[10,1,,11,-2],[,
            -2,,11,,,,,-9],[6,,,6,-2],[,1,,12,,,,,-5],[,1
            ,,12,,,,,-4],[-10,-1,,-11,2],[,-2,,11,,,,,-2]
        ,[-14,-1,,-9,1],[,-12,,-2,,-3,,6,2],[-10,-1,,
            -11,2],[,-2,,-11,,,,,-5],[-6,,,-6,2],[,1,,-12
            ,,,,,-3],[,1,,-12,,,,,-1],[10,1,,11,-2],[,-2,
            ,-11,,,,,-2],[14,1,,9,-1],[,-12,,-2,,-3,,6,-2
        ],[,,,,,.4,,.15,-.25],[50,,,,,-12,,,6],[81,2,
            ,,-2,-2,,,1],[59,2,1,,-6],[40,-8,-19,,12],[71
            ,2,3,,-5],[40,-11,-21,,3],[79,1,6,,-4],[40,-3
            ,-18,,-3],[1+w,-.5,1,,.5],[62,,-4,,-2],[33,-5,-
            16,,7],[56,2,,,-3],[39,-7,-22,,9],[56,1,,,-1]
        ,[41,-8,-20,,10],[,,,,,1,3,2]]
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
