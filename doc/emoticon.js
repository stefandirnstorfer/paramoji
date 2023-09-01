function emoticon_svg(v, a1, a2, p, c, w) {

    v = v / 50 -1;
    a1 = a1 / 100;
    a2 = a2 / 100;
    p = p / 50 -1;
    c = c / 100;
    const v1 = (v+1)/2
    const emoticon_data = [[,,,,,.5],[70,-2,,-8,-1],[-9,-1,-2],[37,-5,,,2,4],[68,-1,-2,-
        7,-2,-6,-4,-1,3],[29,-2,,-3,2,-9],[76,-1,,-8,,-17,-1,,3],[25,-4,,-6,2,-7],
        [77,-10,,-2],[65,4,,,-2,-.5],[68,-1,-2,-7,-2],[71,2,,3,-2],[76,-1,,-8],[75
        ,4,,6,-2],[77,-10,,-2],[80,5,,6,-6,,,,-2],[66,2,,-5,-1,,,,-2],[14,1,,9,-1]
        ,[,-12,,-2,,-3,,6,-2],[10,1,,11,-2],[,-2,,11,,,,,-9],[6,,,6,-2],[,1,,12,,,
        ,,-5],[,1,,12,,,,,-4],[-10,-1,,-11,2],[,-2,,11,,,,,-2],[-14,-1,,-9,1],[,-
        12,,-2,,-3,,6,2],[-10,-1,,-11,2],[,-2,,-11,,,,,-5],[-6,,,-6,2],[,1,,-12,,,
        ,,-3],[,1,,-12,,,,,-1],[10,1,,11,-2],[,-2,,-11,,,,,-2],[14,1,,9,-1],[,-12,
        ,-2,,-3,,6,-2],[,,,,,.4,,.15,-.25],[50,,,,,-12,,,6],[81,2,,,-2,-2,,,1],[51
        ,-2,-10],[,22,,,-26],[,,-11],[-8,,-8],[,,-4],[-8,,-8],[,,2],[-8,,-3],[,,9]
        ,[-4,,1],[,-6,13],[5,,12],[,-9,11],[11,,8],[5,,12],[,-9,-11],[-4,,5],[,-6,
        -13],[,,-11],[,,,,-1],[,-2.5,,,-1.5],[.5,,5],[5,1,-4,,8],[2,-9,-17,,5],[,-
        22,,,26,-10,,20],[,,-11,,,,10],[8,,8,,,,-6],[,,-4,,,,4],[8,,8,,,,-6],[,,2,
        ,,,-2],[8,,3,,,,-2],[,,9,,,,-9],[4,,-1],[,-6,13,,,-3,-12,6],[-5,,-12],[,-9
        ,11,,,-5,-8,10],[-11,,-8],[-5,,-12],[,-9,-11,,,-5,9,10],[4,,-5],[,-6,-13,,
        ,-3,12,6],[,,-11,,,,10],[,,,,2],[2,1,-10,,-6,3],[2,-9,-17,,4,20],[59,2,1,,
        -6],[40,-8,-19,,12],[71,2,3,,-5],[40,-11,-21,,3],[79,1,6,,-4],[40,-3,-18,,
        -3],[2,-.5,1,,.5],[62,,-4,,-2],[33,-5,-16,,7],[56,2,,,-3],[39,-7,-22,,9],[
        56,1,,,-1],[41,-8,-20,,10],[,,,,,1,3,2]]

    const dotprod = (X,Y) => X.reduce((a, b, i) => a + b*(Y[i] || 0), 0)
    const V= [1, v, a1, a2, p, c, c*a1, c*v1, c*a2]
    var data = emoticon_data
        .map((C, i)=> {
            return dotprod(V, C)
        })
    var index=0;
    const template= [
        '<svg width="100%" height="100%" viewBox="0 0 100 100">',
        '  <defs>',
        '    <clipPath id="c-eye-r"><use href="#eye-r"/></clipPath>',
        '    <clipPath id="c-eye-l"><use href="#eye-l"/></clipPath>',
        '    <clipPath id="c-lips"><use href="#lips"/></clipPath>',
        '  </defs>',
        '  <path transform="matrix(1,?,0,1,53,?)" d="M-4,0q-2,-2 -4,0M-1,0Q3,-2 4,-1T6,-3 4,?" fill="none" stroke="black"/>',
        '  <path d="M?,?Q?,? ?,?" fill="none" stroke="black"/>',
        '  <path d="M?,?Q?,? ?,?" fill="none" stroke="black"/>',
        '  <g clip-path="url(#c-lips)">',
        '    <rect height="100" width="100"/>',
        '    <ellipse cx="50" cy="91" rx="15" ry="10" fill="#800f08"/>',
        '    <g transform="translate(0,?)">',
        '      <use href="#tooth" x="-14"/>',
        '      <use href="#tooth" x="-7"/>',
        '      <use href="#tooth"/>',
        '      <use href="#tooth" x="7"/>',
        '    </g>',
        '    <g transform="translate(0,?)">',
        '      <use href="#tooth" transform="matrix(1,.14,0,1,-14,-8)"/>',
        '      <use href="#tooth" x="-7"/>',
        '      <rect id="tooth" x="50.5" rx="2" ry="1" height="15" fill="white" width="6" stroke="black" stroke-width=".5"/>',
        '      <use href="#tooth" transform="matrix(1,-.14,0,1,7,7)"/>',
        '    </g>',
        '  </g>',
        '  <path id="lips" d="M?,?C?,? ?,? 0,?S?,? ?,?C?,? ?,? 0,?S?,? ?,?Z" transform="matrix(1,?,0,1,?,?)" fill="none" stroke="black"/>',
        '  <g transform="translate(68,?)">',
        '    <path id="eye-r" transform="rotate(?)" d="M-8,?C?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? -8,?Z" fill="white" stroke="black"/>',
        '    <g clip-path="url(#c-eye-r)">',
        '      <g id="lens" transform="translate(?,?)">',
        '      <circle r="5" fill="#9d4922"/>',
        '      <circle r="?"/>',
        '      <circle r="1" cx="-2.5" cy="-1.5" fill="white"/>',
        '      </g>',
        '      <path d="M-25,-40H20V0Q?,? -15,-2Z" opacity=".25"/>',
        '    </g>',
        '    <g transform="translate(-36,0)">',
        '      <path id="eye-l" transform="rotate(?)" d="M8,?C?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? 8,?Z" fill="white" stroke="black"/>',
        '      <g clip-path="url(#c-eye-l)">',
        '        <use href="#lens" x="?"/>',
        '        <path d="M-50,-40H15V-2Q?,? -20,0Z" opacity=".25"/>',
        '      </g>',
        '    </g>',
        '  </g>',
        '  <g id="brow-r">',
        '    <path d="M?,?Q?,? ?,?" fill="none" stroke="black" stroke-width="?"/>',
        '    <path d="M?,?Q?,? ?,?" fill="none" stroke="black"/>',
        '  </g>',
        '  <use href="#brow-r" transform="matrix(-1,0,0,1,100,?)"/>',
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
