export function emoticon_svg(v, a, p, c, e, color="none") {

    v = v / 50 -1;
    a = a / 100;
    p = p / 50 -1;
    c = c / 100;
    e = (e / 50 -1)/2;

    const emoticon_data=[[51,-2,-10],[,25,,-25],[,,-11],[-8,,-8],[,,-4],[-8,,-8],[,,2],[-8,
        ,-3],[,,9],[-4,,1],[,-6,13],[5,,12],[,-9,11],[11,,8],[5,,12],[,-9,-11],[-4,,
        5],[,-6,-13],[,,-11],[,,,-1],[,-2,,-1],[.5,,4],[5,1,-4,8],[2,-10,-17,5],[,-25,
        ,25,-10,,20],[,,-11,,,10],[8,,8,,,-6],[,,-4,,,4],[8,,8,,,-6],[,,2,,,-2],[8,,
        3,,,-2],[,,9,,,-9],[4,,-1],[,-6,13,,-3,-12,6],[-5,,-12],[,-9,11,,-5,-8,10],[-11,
        ,-8],[-5,,-12],[,-9,-11,,-5,9,10],[4,,-5],[,-6,-13,,-3,12,6],[,,-11,,,10],[,
        ,,2],[2,1,-10,-6,3],[2,-9,-17,2,20],[61,2,,-5],[40,-7,-18,12],[72,,,-4],[40,
        -9,-18,4],[80,,4,-3],[40,-3,-18,-4],[2,-0.5,1,.5],[62,-1,-4,-3],[36,-5,-18,7],
        [56,1,,-4],[42,-7,-24,9],[56,,,-2],[45,-8,-22,10],[,,,,2,2],[,,,,.5],[70,-2,
            -10],[-3,,1],[-14,-2,6,2],[,4,6,-4],[-15,1,-5,1,,-4],[63,,9,-2],[,-11,-2],[60,
            ,11,-4],[,,11],[56,,6,-4],[,2,12],[,2,12],[40,,-11,4,3],[,,11],[37,,-9,2],[,
            -11,-2],[40,,-11,4,-3],[,,-11,,-22],[44,,-6,4],[,2,-12,,-7,-1],[,2,-12,,-3],
        [60,,11,-4],[,,-11],[63,,9,-2],[,-11,-2],[26,-2,-6,2,-2],[78,-8,-1],[32,,-6,
            4,-8],[76,-2,-8,1,-18],[37,-3,-2,1,3],[68,-1,-5,,-4,-4],[74,3,6,-2],[78,-8,-1],
        [68,,6,-4],[76,-2,-8,1],[63,2,2,-1],[68,-1,-5]]

    const expressable=[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0.5,0.5,0.5,0.5,1,1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]

    const dotprod = (X,Y) => X.reduce((a, b, i) => a + b*(Y[i] || 0), 0)
    var data = emoticon_data
        .map((C, i)=> {
            const V= [1, v, Math.min(1,Math.max(0,a + expressable[i]*e)), p, c]
            return dotprod(V, C)
        })
    var index=0;
    const template=  [
        '<svg height="100%" viewBox="0 0 100 100" width="100%" xmlns="http://www.w3.org/2000/svg">',
        '  <defs id="defs">',
        '    <clipPath id="clip-right-eye"><use href="#right-eye-outline"/></clipPath>',
        '    <clipPath id="clip-left-eye"><use href="#left-eye-outline"/></clipPath>',
        '    <clipPath id="clip-mouth"><use href="#lips"/></clipPath>',
        '  </defs>',
        '  <ellipse cx="50" cy="50" rx="48" ry="50" fill="' + color.replace(/"/g,'') + '"/>',
        '  <g id="eyes" transform="translate(68,?)">',
        '    <g id="right-eye">',
        '      <path transform="rotate(?)" d="M -8,? C ?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? -8,? Z" id="right-eye-outline" fill="white" stroke="black"/>',
        '      <g clip-path="url(#clip-right-eye)" id="right-eyeball">',
        '        <g id="right-lens" transform="translate(?,?)">',
        '          <circle r="5" fill="#9d4922" id="iris"/>',
        '          <circle r="?" fill="black" id="pupil"/>',
        '          <circle r="1" cx="-2.5" cy="-1.5" fill="white" id="glare"/>',
        '        </g>',
        '        <path d="M -15,-20 H 20 V0 Q ?,? -15,0 Z" id="right-lid-shadow" opacity="0.25" fill="black"/>',
        '      </g>',
        '    </g>',
        '    <g id="left-eye" transform="translate(-36,0)">',
        '      <path transform="rotate(?)" d="M 8,? C ?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? 8,? Z" id="left-eye-outline" fill="white" stroke="black"/>',
        '      <g clip-path="url(#clip-left-eye)" id="left-eyeball">',
        '        <use id="right-lens" x="?" href="#right-lens"/>',
        '        <path d="M -15,-20 H 15 V -2 Q ?,? -20,0 Z" id="left-lid-shadow" opacity="0.25" fill="black"/>',
        '      </g>',
        '    </g>',
        '  </g>',
        '  <g id="right-eye-top">',
        '    <path d="M ?,? Q ?,? ?,?" id="right-eye-brow" stroke-width="?" stroke="black" fill="none"/>' +
        '    <path d="M ?,? Q ?,? ?,?" id="wrinkle-right-brow" fill="none" stroke="black"/>',
        '  </g>',
        '  <use id="left-eye-brow" transform="matrix(-1,0,0,1,100,?)" href="#right-eye-top"/>',
        '  <g id="nose" transform="matrix(1,?,0,1,53,?)">',
        '    <path d="M -4,0 q -2,-2 -4,0 M -1,0 Q 3,-2 4,-1 T 6,? 4,?" id="nose-path" fill="none" stroke="black"/>',
        '  </g>',
        '  <g id="mouth" transform="translate(0,81)">',
        '    <g clip-path="url(#clip-mouth)" id="throat">',
        '      <rect height="45" fill="black" id="mouth-background" width="60" x="20" y="-25"/>',
        '      <ellipse cx="50" cy="10" rx="15" ry="10" id="tongue" fill="#800f08"/>/',
        '      <g id="lower-teeth" transform="translate(0,?)">',
        '        <use x="-14" href="#tooth"/>',
        '        <use x="-7" href="#tooth"/>',
        '        <use x="0" href="#tooth"/>',
        '        <use x="7" href="#tooth"/>',
        '      </g>',
        '      <g id="upper-teeth" transform="translate(0,?)">',
        '        <use transform="matrix(1,0.14,0,1,-14,-8)" href="#tooth"/>',
        '        <use x="-7" href="#tooth"/>',
        '        <rect height="15" id="tooth" rx="2" ry="1" fill="white" stroke="black" width="6" x="50"/>',
        '        <use transform="matrix(1,-0.14,0,1,7,7)" href="#tooth"/>',
        '      </g>',
        '    </g>',
        '    <path d="M ?,? C ?,? ?,? 50,? S ?,? ?,? C ?,? ?,? 50,? S ?,? ?,? Z" id="lips" fill="none" stroke="black"/>',
        '  </g>',
        '  <path d="M ?,? Q ?,? ?,?" id="wrinkle-left-cheek" fill="none" stroke="black"/>',
        '  <path d="M ?,? Q ?,? ?,?" id="wrinkle-right-cheek" fill="none" stroke="black"/>',
        '</svg>'
    ]
    return template.join("\n").replace(/\?/g, () => data[index++]);
}
