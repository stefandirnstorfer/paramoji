function emoticon_svg(v, a1, a2, p, g, c) {

    v = v / 50 -1;
    a1 = a1 / 100;
    a2 = a2 / 100;
    p = p / 50 -1;
    g = g / 100;
    c = c / 100;
    const v1 = (v+1)/2
    const matrix=[[80,1,,6,-6],[65,,,-5,-1],[14,1,,9,-2],[,-12,,-2],[10,1,,11,-3,-5],[,-2,,11,,-10],[6,,
        ,6,-3,-2],[,1,,12],[,1,,12],[-10,-1,,-11,3,5],[,-2,,11,,-10],[-14,-1,,-9,2],[,-12,,-2],[-10,-1,,-
        11,3,5],[,-2,,-11,,-10],[-6,,,-6,3,2],[,1,,-12],[,1,,-12],[10,1,,11,-3,-5],[,-2,,-11,,-10],[14,1,,
        9,-2],[,-12,,-2],[1,,,,,-.2],[,,,,,,.3],[50,,,,,,-12],[79,,,2,-2,-2,-2],[51,-2,-10,,,-5],[,22,,,-
        26],[,,-11],[-8,,-8],[,,-4],[-8,,-8],[,,2],[-8,,-3],[,,9],[-4,,1],[,-6,13],[5,,12],[,-9,11],[11,,8
        ],[5,,12],[,-9,-11],[-4,,5],[,-6,-13],[,,-11],[,,,,26],[1,,,,,,-.7],[,-22],[,,-11],[8,,8],[,,-4],[
        8,,8],[,,2],[8,,3],[,,9],[4,,-1],[,-6,13],[-5,,-12],[,-9,11],[-11,,-8],[-5,,-12],[,-9,-11],[4,,-5]
        ,[,-6,-13],[,,-11],[1,,,,,,1],[18,,,,-1,,-7],[,-2.5,,,-1.5],[.5,,5],[-36,,,,2],[23,1,-4,,8],[2,-9,
        -17,,5,10],[-16,1,-10,,-6,,3],[2,-9,-17,,4,10,15],[,,,,-10],[9,,-1,,-4,-4],[-13,-5,-8,,14,10],[16,
        ,1,,-4,-11],[-13,-10,-10,,11,-6],[24,,3,,-4,-9],[-13,-10,-10,,8,6],[31,,5,,-4,-6],[-13,-2,-8,,5,6]
        ,[1.2,-.5,1,,.5],[,,,,,,4],[,,,,,,.4],[70,-2,,-8,-1,-8],[,,,,,7],[,,,,,7],[4,,,,,-4],[-9,-1,-2,,,3
        ]]

    const dotprod = (X,Y) => X.reduce((a, b, i) => a + b*(Y[i] || 0), 0)
    const V= [1, v, a1, a2, p, g, c]
    var data = matrix
        .map((C, i)=> {
            return dotprod(V, C)
        })
    var index=0;
    const template='<svg width="100%" height="100%" viewBox="0 0 100 100"><defs><clipPath id="clip-eye'+
    's"><use href="#eye-l"/><use href="#eye-r"/></clipPath><clipPath id="clip-lips"><use href="#lips'+
    '"/></clipPath></defs><g clip-path="url(#clip-lips)"><rect height="100" width="100"/><ellipse cx'+
    '="50" cy="91" rx="15" ry="10" fill="#800f08"/><g transform="translate(0,?)"><use href="#tooth" '+
    'x="-14"/><use href="#tooth" x="-7"/><use href="#tooth"/><use href="#tooth" x="7"/></g><g transf'+
    'orm="translate(0,?)"><use href="#tooth" transform="matrix(1,.14,0,1,-14,-8)"/><use href="#tooth'+
    '" x="-7"/><rect id="tooth" x="50.5" rx="2" ry="1" height="15" width="6" fill="white" stroke="bl'+
    'ack" stroke-width=".5"/><use href="#tooth" transform="matrix(1,-.14,0,1,7,7)"/></g></g><path id'+
    '="lips" d="M?,?C?,? ?,? 0,?S?,? ?,?C?,? ?,? 0,?S?,? ?,?Z" transform="matrix(?,?,0,1,?,?)" fill='+
    '"none" stroke="black"/><g transform="translate(50,?)"><path id="eye-r" transform="translate(18,'+
    '0) rotate(?)" d="M-8,?C?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? -8,?Z" fill="white" stroke="black"/><pat'+
    'h id="eye-l" transform="translate(-18,0) rotate(?) scale(1,?) rotate(?)" d="M8,?C?,? ?,? ?,? ?,'+
    '? ?,? ?,0 ?,? ?,? 8,?Z" fill="white" stroke="black" stroke-width="?"/><g clip-path="url(#clip-e'+
    'yes)"><g id="lens" transform="translate(?,?)"><circle r="5" fill="#9d4922"/><circle r="?"/><cir'+
    'cle r="1" cx="-2.5" cy="-1.5" fill="white"/></g><use href="#lens" x="?"/><path d="M-52,-30H30L3'+
    '8,0Q?,? 0,-2 ?,? -38,0Z" opacity=".25"/></g><path id="brow-r" transform="rotate(?)" d="M?,?C?,?'+
    ' ?,? ?,?" fill="none" stroke="black" stroke-width="?"/><use href="#brow-r" transform="matrix(-1'+
    ',0,0,1,0,?)"/></g><path transform="matrix(1,?,0,1,53,?)" d="M-8,0Q-6,-2 -4,?M-1,?C2,-3 2,1 4,-1'+
    'S6,-6 ?,?" fill="none" stroke="black"/></svg>'
    return template
        .replace(/\?/g, () => data[index++])
        .replace(/svg/, 'svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"')
        .replace(/ href=/g, ' xlink:href=')
}

module.exports.emoticon_svg = emoticon_svg
