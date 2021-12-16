function emoticon_svg(v, a, p, c, e, l) {

    v = v / 50 -1;
    a = a / 100;
    p = p / 50 -1;
    c = c / 100;
    e = (e / 50 -1)/2;
    l = (l || 0)/ 100;

    const emoticon_data=[[1,,,,-0.5],[55,-2,-10],[,20,,-20],[-8],[,,-11],[-8,,-8],[,,-4],
        [-8,,-8],[,,2],[-8,,-3],[,,9],[-4,,1],[,-6,13],[5,2,11],[,-9,9],[11,,6],[],[5,
            2,13],[,-9,-9],[-4,,5],[,-6,-13],[-8],[,,-11],[,,,-1],[,-2,,-1],[.5,,4],[1,.5],
        [5,1,-4,8],[2,-10,-17,5],[-35,,,2],[-33,1,-10,-6,3],[2,-9,-17,2,13],[63,2,-3,
            -5],[44,-7,-18,8],[72,,,-4],[44,-9,-18,4],[80,,4,-3],[44,-3,-18,-2],[2,-0.5,
            1,.5],[62,-1,-4,-3],[40,-5,-18,7],[56,1,,-4],[46,-7,-24,9],[56,,,-2],[49,-8,
            -22,10],[,,,,3],[,,,,.4],[74,-2,-10],[-2,-1],[-4,-1,-1,-1],[74,-2,-10],[72,-2,
            -10],[57],[73,-2,-10],[59],[71,-2,-9],[56,,-1],[60,-4,-5,2],[1,,-l/2],[63,1,
            11],[,-6,-3,-1],[60,1,11,-3],[,-1,3,-1,,4],[56,1,6,-2],[,1,6,-1,,8],[,1,6,-1,
            ,8],[40,-1,-11,3],[,-1,3,-1,,4],[37,-1,-11],[,-6,-3,-1],[40,-1,-11,3],[,-1,-7,
            -1,-18,-4],[44,-1,-6,2],[,1,-8,-1,-7,-9],[,1,-8,-1,-3,-6],[56,1,6,-2],[,1,-8,
            -1,1,-9],[60,1,11,-3],[,-1,-7,-1,,-4],[63,1,11],[,-6,-3,-1],[,1,2,-1,,1],[-10,
            1,-5,,,-2],[63,1,11],[,-6,-3,-1],[60,1,11,-3],[,-1,3,-1],[56,1,6,-2],[,1,6,-1],
        [,1,6,-1],[40,-1,-11,3],[,-1,3,-1],[37,-1,-11],[,-6,-3,-1],[40,-1,-11,3],[,-1,
            -7,-1,-18],[44,-1,-6,2],[,1,-8,-1,-7],[,1,-8,-1,-3],[60,1,11,-3],[,-1,-7,-1],
        [63,1,11],[,-6,-3,-1],[26,-3,-6],[82,-8,-1,,,3],[32,,-6,1,-4,7],[80,-2,-8,1,
            -12,2],[37,-3,-2,,3],[72,-3,-5,,-6],[74,3,6],[82,-8,-1,,,3],[68,,6,-1,,-7],[80,
            -2,-8,1,,2],[63,3,2],[72,-3,-5]]
    const expressable=[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
        -1,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,1,1,1,1,1]

    const dotprod = (X,Y) => X.reduce((a, b, i) => a + b*(Y[i] || 0), 0)
    var data = emoticon_data
        .map((C, i)=> {
            const V= [1, v, Math.min(1,Math.max(0,a + expressable[i]*e)), p, c, l]
            return dotprod(V, C)
        })
    var index=0;
    const template= [
        '<svg height="100%" viewBox="0 0 100 110" width="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
        '  <defs id="defs">',
        '    <clipPath id="clip-right-eye">',
        '      <use xlink:href="#right-eye-outline"/>',
        '    </clipPath>',
        '    <clipPath id="clip-left-eye">',
        '      <use id="left-eye-outline" transform="matrix(-1,0,0,?,-35,0)" xlink:href="#right-eye-outline"/>',
        '    </clipPath>',
        '    <clipPath id="clip-mouth">',
        '      <use xlink:href="#inner-mouth"/>',
        '    </clipPath>',
        '  </defs>',
        '  <ellipse cx="50" cy="54" rx="48" ry="52" fill="none" stroke="black"/>',
        '  <g id="eyes" transform="translate(67.5,?)">',
        '    <g id="right-eye">',
        '      <path transform="rotate(?)" d="M ?,? C ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? Z" id="right-eye-outline" fill="white" stroke="black"/>',
        '      <g clip-path="url(#clip-right-eye)" id="right-eyeball">',
        '        <g id="right-lens" transform="translate(?,?)">',
        '          <circle r="5" fill="#9d4922" id="iris"/>',
        '          <circle r="?" fill="black" id="pupil"/>',
        '          <circle r="?" cx="-2.5" cy="-1.3" fill="white" id="glare"/>',
        '        </g>',
        '        <path d="M -15,-20 H 20 V0 Q ?,? -15,0 Z" id="right-lid-shadow" opacity="0.25" fill="black"/>',
        '      </g>',
        '    </g>',
        '    <g id="left-eye">',
        '      <use xlink:href="#left-eye-outline"/>',
        '      <g clip-path="url(#clip-left-eye)" id="left-eyeball">',
        '        <use id="right-lens" x="?" xlink:href="#right-lens"/>',
        '        <path d="M -50,-20 H -20 V -2 Q ?,? -55,0 Z" id="left-lid-shadow" opacity="0.25" fill="black"/>',
        '      </g>',
        '    </g>',
        '  </g>',
        '  <g id="right-eye-top">',
        '    <path d="M ?,? Q ?,? ?,?" id="right-eye-brow" stroke-width="?" stroke="#292929" fill="none"/>' +
        '    <path d="M ?,? Q ?,? ?,?" id="wrinkle-right-brow" fill="none" stroke="black"/>',
        '  </g>',
        '  <use id="left-eye-brow" transform="matrix(-1,0,0,1,100,?)" xlink:href="#right-eye-top"/>',
        '  <g id="nose" transform="matrix(1,?,0,1,53,0) translate(-53,0)">',
        '    <path d="M 49,? q -2,? ?,0 M 52,? Q 56,? ?,? T ?,? ?,?" id="nose-path" fill="none" stroke="black"/>',
        '  </g>',
        '  <g id="mouth" transform="translate(50,83) scale(?,1) translate(-50, 0)">',
        '    <path d="M ?,? C ?,? ?,? 50,? S ?,? ?,? C ?,? ?,? 50,? C ?,? ?,? ?,? Z" id="lips" fill="gray" stroke="black"/>',
        '    <g clip-path="url(#clip-mouth)" id="mouth-interior">',
        '      <rect height="45" fill="black" id="mouth-background" width="60" x="20" y="-25"/>',
        '      <ellipse cx="50" cy="5" rx="16" ry="6" id="tongue" fill="#800f08"/>/',
        '      <g id="lower-teeth" transform="translate(0,?)">',
        '        <use x="-14" xlink:href="#tooth"/>',
        '        <use x="-7" xlink:href="#tooth"/>',
        '        <use x="0" xlink:href="#tooth"/>',
        '        <use x="7" xlink:href="#tooth"/>',
        '      </g>',
        '      <g id="upper-teeth" transform="translate(0,?)">',
        '        <use transform="matrix(1,0.14,0,1,-14,-8)" xlink:href="#tooth"/>',
        '        <use x="-7" xlink:href="#tooth"/>',
        '        <rect height="10" id="tooth" rx="2" ry="1" fill="white" stroke="black" width="6" x="50"/>',
        '        <use transform="matrix(1,-0.14,0,1,7,7)" xlink:href="#tooth"/>',
        '      </g>',
        '    </g>',
        '    <path d="M ?,? C ?,? ?,? 50,? S ?,? ?,? C ?,? ?,? 50,? S ?,? ?,? Z" id="inner-mouth" fill="none" stroke="black"/>',
        '  </g>',
        '  <path d="M ?,? Q ?,? ?,?" id="wrinkle-left-cheek" fill="none" stroke="black"/>',
        '  <path d="M ?,? Q ?,? ?,?" id="wrinkle-right-cheek" fill="none" stroke="black"/>',
        '</svg>'
    ]
    return template.join("\n").replace(/\?/g, () => data[index++]);
}

module.exports.emoticon_svg = emoticon_svg
