// Paramoji Generator
// Copyright © 2022 Stefan Dirnstorfer
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

function paramoji_svg(v, a1, a2, p, c) {
    const data = [
    //   transform="matrix(1,?,0,1,53,?)"  d="M-4,0q-2,-2 -4,0M-1,0Q3,-2 4,-1T6,-3 4,?"
        [  0,  0,  0,  0,  0, 0.4],
        [ 70, -2, 0, -8, -1],
        [-9, -1, -2],
    //   d="M?,?Q?,? ?,? M?,?Q?,? ?,?"
        [ 37, -5,  0,  0,  2,   4], [ 68, -1, -2, -7, -3, -4],
        [ 29, -2,  0, -3,  2, -17], [ 76, -1,  0, -8,  0,-15],
        [ 25, -4,  0, -6,  2, -10], [ 77,-10,  0, -2],
        [ 65,  4,  0,  0, -2, -.5], [ 68, -1, -2, -7, -3],
        [ 71,  2,  0,  3, -2],      [ 76, -1,  0, -8],
        [ 75,  4,  0,  6, -2],      [ 77,-10,  0, -2],
    //   transform="translate(0,?)"
        [ 80,  5,  0,  6, -6],
    //   transform="translate(0,?)"
        [ 66,  2,  0, -5, -1],
    // id: lips
    //   d="M?,?C?,? ?,? 0,?S?,? ?,?C?,? ?,? 0,?S?,? ?,?Z"  transform="matrix(1,?,0,1,?,?)"
        [ 14,  1,  0,  9, -2], [  0,-12,  0, -2,  0,  0],
        [ 10,  1,  0, 11, -3], [  0, -2,  0, 11,  0,  0],
        [  6,  0,  0,  6, -3], [  0,  1,  0, 12,  0,  0],
        [  0,  1,  0, 12],
        [-10, -1,  0,-11,  3], [  0, -2,  0, 11,  0,  0],
        [-14, -1,  0, -9,  2], [  0,-12,  0, -2,  0,  0],
        [-10, -1,  0,-11,  3], [  0, -2,  0,-11,  0,  0],
        [ -6,  0,  0, -6,  3], [  0,  1,  0,-12,  0,  0],
        [  0,  1,  0,-12],
        [ 10,  1,  0, 11, -3], [  0, -2,  0,-11,  0,  0],
        [ 14,  1,  0,  9, -2], [  0,-12,  0, -2,  0,  0],
        [  0,  0,  0,  0,  0, 0.3],
        [ 50,  0,  0,  0,  0,-12], [ 81,  2,  0,  0, -3, -2],
        //   transform="translate(68,?)"
        [ 51, -2,-10],
    // id: eye-r
        //   transform="rotate(?)"  d="M8,?C?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? 8,?Z"
        [  0, 22,  0,  0, -26],
        [  0,  0,-11,  0],
        [ -8,  0, -8,  0], [  0,  0, -4,  0],
        [ -8,  0, -8,  0], [  0,  0,  2,  0],
        [ -8,  0, -3,  0], [  0,  0,  9,  0],
        [ -4,  0,  1,  0], [  0, -6, 13,  0],
        [  5,  0, 12,  0], [  0, -9, 11,  0],
        [ 11,  0,  8,  0],
        [  5,  0, 12,  0], [  0, -9,-11,  0],
        [ -4,  0,  5,  0], [  0, -6,-13,  0],
        [  0,  0,-11,  0],
    // id: eye-l
    //   transform="translate(-36,0) rotate(?) scale(1,?) rotate(?)"
        [  0, 0,  0,  0, 26],
        [1, 0, 0, 0, 0, -.8],
        [  0, -22,  0,  0,],
    // id: eye-l
    //   transform="rotate(?)"  d="M-8,?C?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? -8,?Z"
        [  0,  0, -11,  0],
        [  8,  0,  8,  0], [  0,  0, -4,  0],
        [  8,  0,  8,  0], [  0,  0,  2,  0],
        [  8,  0,  3,  0], [  0,  0,  9,  0],
        [  4,  0, -1,  0], [  0, -6, 13,  0],
        [ -5,  0,-12,  0], [  0, -9, 11,  0],
        [-11,  0, -8,  0],
        [ -5,  0,-12,  0], [  0, -9,-11,  0],
        [  4,  0, -5,  0], [  0, -6,-13,  0],
        [  0,  0, -11,  0],
        [  1, 0, 0,0,0, 1],
    // id: lens
    //   transform="translate(?,?)"
        [  0,  0,  0,  0, -1, -7], [  0,-2.5,  0,  0,-1.5],
    //   r="?"
        [0.5,  0,  5,  0],
    //   x="?"
        [  -36,  0,  0,  0,  2],
    //   d="M-15,-20H20V0Q?,? -15,-2Z M-15,-20H15V-2Q?,? -20,0Z"
        [  5,  1, -4,  0,  8], [  2, -9,-17,  0,  5],
        [  -34,  1,-10,  0, -6,  3], [  2, -9,-17,  0,  4, 15],
    //   d="M?,?Q?,? ?,?"  stroke-width="?"
        [ 59,  2, -1,  0, -6], [ 40, -7,-19,  0, 12],
        [ 70,  1,  2,  0, -5], [ 40,-12,-21,  0,  3],
        [ 81,  1,  5,  0, -4], [ 40, -4,-19,  0, -3],
        [  2,-0.5,  1,  0,0.5],
    //   d="M?,?Q?,? ?,?"
        [ 62,  0, -4,  0, -2], [ 33, -5,-16,  0,  7],
        [ 56,  2,  0,  0, -3], [ 39, -7,-22,  0,  9],
        [ 56,  1,  0,  0, -1], [ 41, -8,-20,  0, 10],
    //   transform="matrix(-1,0,0,1,100,?)"
        [  0,  0,  0,  0,  0,  4],
    ]

    // console.log(JSON.stringify(data))

    const template= [
        '<svg width="100%" height="100%" viewBox="0 0 100 100">',
        '  <defs>',
        '    <clipPath id="clip-eyes"><use href="#eye-l"/><use href="#eye-r"/></clipPath>',
        '    <clipPath id="clip-lips"><use href="#lips"/></clipPath>',
        '  </defs>',
        '  <path transform="matrix(1,?,0,1,53,?)" d="M-4,0q-2,-2 -4,0M-1,0C2,-3 2,1 4,-1S6,-6 4,?" fill="none" stroke="black"/>',
        '  <path d="M?,?Q?,? ?,? M?,?Q?,? ?,?" fill="none" stroke="black"/>',
        '  <g clip-path="url(#clip-lips)">',
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
        '      <rect id="tooth" x="50.5" rx="2" ry="1" height="15" width="6" fill="white" stroke="black" stroke-width=".5"/>',
        '      <use href="#tooth" transform="matrix(1,-.14,0,1,7,7)"/>',
        '    </g>',
        '  </g>',
        '  <path id="lips" d="M?,?C?,? ?,? 0,?S?,? ?,?C?,? ?,? 0,?S?,? ?,?Z" transform="matrix(1,?,0,1,?,?)" fill="none" stroke="black"/>',
        '  <g transform="translate(68,?)">',
        '    <path id="eye-r" transform="rotate(?)" d="M-8,?C?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? -8,?Z" fill="white" stroke="black"/>',
        '    <path id="eye-l" transform="translate(-36,0) rotate(?) scale(1,?) rotate(?)" d="M8,?C?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? 8,?Z" fill="white" stroke="black" stroke-width="?"/>',
        '    <g clip-path="url(#clip-eyes)">',
        '      <g id="lens" transform="translate(?,?)">',
        '        <circle r="5" fill="#9d4922"/>',
        '        <circle r="?"/>',
        '        <circle r="1" cx="-2.5" cy="-1.5" fill="white"/>',
        '      </g>',
        '      <use href="#lens" x="?"/>',
        '      <path d="M-70,-30H30L20,0Q?,? -18,-2 ?,? -56,0Z" opacity=".25"/>',
        '    </g>',
        '  </g>',
        '  <g id="brow-r">',
        '    <path d="M?,?Q?,? ?,?" fill="none" stroke="black" stroke-width="?"/>',
        '    <path d="M?,?Q?,? ?,?" fill="none" stroke="black"/>',
        '  </g>',
        '  <use href="#brow-r" transform="matrix(-1,0,0,1,100,?)"/>',
        '</svg>'
    ]
    const dotprod = (X,Y) => X.reduce((a, b, i) => a + b*(Y[i] || 0), 0)
    let index=0,  V= [1, 2*v-1, a1, a2, 2*p-1, c]
    return template.join("\n").replace(/\?/g, () => dotprod(V, data[index++]));
}

function paramoji_blink_svg(blink, v, a1, a2, d, c) {
    const open = paramoji_svg(v, a1, a2, d, c)
    if (!blink) return open
    const closed = paramoji_svg((1-blink*a1)*v, (1-blink)*a1, a2, d, c)
    return open
        .replace(/id="eye-r[^>]*/, closed.match(/id="eye-r[^>]*/)[0])
        .replace(/id="eye-l[^>]*/, closed.match(/id="eye-l[^>]*/)[0])
}

function dark_mode(svg) {
    return svg.replace(/(<(?!rect id="tooth")[^>]*) stroke="black"/g, '$1 stroke="white"')
}

function add_love(svg, l) {
    const data = [
        [0, 1],
        [0.7, -0.2],
        [0, 1]
    ]
    const template= [
        '<path id="love"',
        ' d="m -21,-13 c -11,0 -19,8 -19,18 0,14 9,23 40,48 C 32,28 40,19 40,5 40,-5 32,-13 21,-13 12,-13 7,-8 3,-3 L 0,1 -3,-3 c -4,-5 -9,-10 -18,-10 z"',
        ' transform="translate(50,55) scale(?) translate(0, -15)"',
        ' fill="rgba(150,0,0,?)" stroke-width="1" stroke="black"/>'
    ]
    const dotprod = (X,Y) => X.reduce((a, b, i) => a + b*(Y[i] || 0), 0)
    let index=0,  V= [1, l]
    const love= template.join("").replace(/\?/g, () => dotprod(V, data[index++]));
    svg = svg.replace(/(?=<path id="lips")/ , love)
    svg = svg.replace(/(?=<\/svg>)/ , '<use href="#love"/>')
    return svg
}
