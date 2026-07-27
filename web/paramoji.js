// Paramoji Generator
// Copyright © 2025 Stefan Dirnstorfer
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

export function paramoji_svg(v, a1, a2, p, g, c, b, t=0) {
   const data = [
        // id: eye
        //   transform="rotate(?)"  d="M-8,?C?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? -8,?Z"
                [  0, 22,  0,  0,-26],
                [  0,  0,-11,  0],
                [ -8,  0, -8,  0], [  0,  0, -4,  0],
                [ -8,  0, -8,  0], [  0,  0,  2,  0],
                [ -8,  0, -3,  0], [  0,  0,  9,  0],
                [ -4,  0,  1,  0,  0, -3], [  0, -6, 13,  0],
                [  5,  0, 12,  0,  0,-10], [  0, -9, 11,  0],
                [ 11,  0,  8,  0,  0, -2],
                [  5,  0, 12,  0,  0,-10], [  0, -9,-11,  0],
                [ -4,  0,  5,  0,  0, -3], [  0, -6,-13,  0],
                [  0,  0,-11,  0],
        // id: eye-l
        //   transform="translate(-18,0) rotate(?) scale(-1,?) rotate(?)"
                [  0,  0,  0,  0, 26],
                [  1,  0,  0,  0,  0,  0,-0.7],
                [  0,  0,  0,  0, 26],
        // id: lips
        //   d="M?,?C?,? ?,? 0,?S?,? ?,?C?,? ?,? 0,?S?,? ?,?Z"  transform="matrix(?,?,0,1,?,?)"
                [ 14,  1,  0,  9, -2,  0], [  0,-12,  0, -2,  0,  0],
                [ 10,  1,  0, 11, -3, -5], [  0, -2,  0, 11,  0,-10],
                [  6,  0,  0,  6, -3, -2], [  0,  1,  0, 12,  0,  0],
                [  0,  1,  0, 12,  0,  0],
                [-10, -1,  0,-11,  3,  5], [  0, -2,  0, 11,  0,-10],
                [-14, -1,  0, -9,  2,  0], [  0,-12,  0, -2,  0,  0,  0],
                [-10, -1,  0,-11,  3,  5], [  0, -2,  0,-11,  0,-10],
                [ -6,  0,  0, -6,  3,  2], [  0,  1,  0,-12,  0,  0],
                [  0,  1,  0,-12,  0,  0],
                [ 10,  1,  0, 11, -3, -5], [  0, -2,  0,-11,  0,-10],
                [ 14,  1,  0,  9, -2,  0], [  0,-12,  0, -2,  0,  0,  0],
                [  1,  0,  0,  0,  0,-0.2,  0], [  0,  0,  0,  0,  0,  0,0.3],
                [ 50,  0,  0,  0,  0,  0,-12], [ 79,  0,  0,  2, -2, -2, -2],
        // id: tear
        //   transform="scale(?) translate(0,?)"
                [  0,  0,  0,  0,  0,  0,  0,  0,0.3],
                [  7,-10, 23,  0,-20],
        // id: blush-r
        //   cy="?"  r="?"  opacity="?"
                [ 65, -5,  0, -6, -2, -5],
                [  0,  0,  0,  0,  0,  0,  0, 15],
                [0.3,  0,  0,  0,  0,  0,  0,0.7],
        //   y="?"
                [  0,  0,  0,  0,  0,  0, -5],
        //   transform="translate(0,?)"
                [ 80,  1,  0,  6, -6],
        //   transform="translate(0,?)"
                [ 65,  0,  0, -5, -1],
        //   transform="translate(50,?)"
                [ 51, -2,-10,  0,  0, -5],
        //   stroke-width="?"
                [  1,  0,  0,  0,  0,  0,  1],
        // id: lens
        //   transform="translate(?,?)"
                [ 18,  0,  0,  0, -1, -2, -7], [  0,-2.5,  0,  0,-1.5],
        //   r="?"
                [0.5,  0,  5,  0],
        //   x="?"
                [-36,  0,  0,  0,  2,  4],
        //   d="M-52,-30H30L38,0Q?,? 0,-2 ?,? -38,0Z"
                [ 23,  1, -4,  0,  8,  0,  0], [  2, -9,-17,  0,  5, 10,  0],
                [-16,  1,-10,  0, -6,  0,  3], [  2, -9,-17,  0,  4, 10, 15],
        // id: brow-r
        //   transform="rotate(?)"  d="M?,?C?,? ?,? ?,?"  stroke-width="?"
                [  7,  1,  1,  0, -1, -5], [-13, -5, -8,  0, 13, 10],
                [ 14,  1,  2,  0, -1,-12], [-13,-10,-10,  0,  9, -6],
                [ 23,  2,  3,  0, -1,-10], [-13,-10,-10,  0,  5,  6],
                [ 31,  2,  4,  0, -1, -7], [-13, -2, -8,  0,  1,  6],
                [1.2,-0.5,  1,  0,0.5],
        //   transform="matrix(-1,0,0,1,0,?)"
                [  0,  0,  0,  0,  0,  0,  4],
        //   transform="matrix(1,?,0,1,53,?)"  d="M-8,0Q-6,-2 -4,?M-1,?C2,-3 2,1 4,-1S6,-6 ?,?"
                [  0,  0,  0,  0,  0,  0,0.4],
                [ 70, -2,  0, -8, -1, -8],
                [  0,  0,  0,  0,  0,  7],
                [  0,  0,  0,  0,  0,  7],
                [  4,  0,  0,  0,  0, -4], [ -9, -1, -2,  0,  0,  3],
        ]

    const template = [
        '<svg width="100%" height="100%" viewBox="0 0 100 100">',
        '  <defs>',
        '    <path id="eye" transform="rotate(?)" d="M-8,?C?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? -8,?Z" fill="white" stroke="black"/>',
        '    <clipPath id="clip-eyes">',
        '       <use id="eye-l" href="#eye" transform="translate(-18,0) rotate(?) scale(-1,?) rotate(?)"/>',
        '       <use id="eye-r" href="#eye" x="18"/>',
        '    </clipPath>',
        '    <clipPath id="clip-lips">',
        '      <path id="lips" d="M?,?C?,? ?,? 0,?S?,? ?,?C?,? ?,? 0,?S?,? ?,?Z" transform="matrix(?,?,0,1,?,?)"/>',
        '    </clipPath>',
        '    <radialGradient id="blush">',
        '      <stop stop-color="#ED7770" offset=".2"/>',
        '      <stop stop-color="#ED7770" stop-opacity=".3" offset=".7"/>',
        '      <stop stop-color="#ED7770" stop-opacity="0" offset="1"/>',
        '    </radialGradient>',
        '    <g id="tear" transform="scale(?) translate(0,?)">',
        '      <circle r="20" fill="#4EC1F5" opacity="0.75"/>',
        '      <path d="m-11-10c-8,3-4,25 7,25 8,0 -2,-7 -4,-13 -2,-7 0,-13 -3,-12z" fill="#B3E2FB"/>',
        '    </g>',
        '  </defs>',
        '  <circle id="blush-r" cx="75" cy="?" r="?" opacity="?" fill="url(#blush)"/>',
        '  <use href="#blush-r" x="-50" y="?"/>',
        '  <g clip-path="url(#clip-lips)">',
        '    <rect height="100" width="100"/>',
        '    <ellipse cx="50" cy="91" rx="15" ry="10" fill="#800f08"/>',
        '    <g id="teeth-r">',
        '      <g transform="translate(0,?)">',
        '        <rect id="tooth" x="50.25" rx="2" ry="1" height="15" width="6.5" fill="white"/>',
        '        <use href="#tooth" x="7"/>',
        '      </g>',
        '      <g transform="translate(0,?)">',
        '        <use href="#tooth"/>',
        '        <use href="#tooth" transform="matrix(1,-.14,0,1,7,7)"/>',
        '      </g>',
        '    </g>',
        '    <use href="#teeth-r" transform="matrix(-1,0,0,1,100,0)"/>',
        '  </g>',
        '  <use href="#lips" fill="none" stroke="black"/>',
        '  <g transform="translate(50,?)">',
        '    <use href="#eye-r"/>',
        '    <use href="#eye-l" stroke-width="?"/>',
        '    <g clip-path="url(#clip-eyes)">',
        '      <g id="lens" transform="translate(?,?)">',
        '        <circle r="5" fill="#9d4922"/>',
        '        <circle r="?"/>',
        '        <circle r="1" cx="-2.5" cy="-1.5" fill="white"/>',
        '        <use href="#tear" x="7" transform="scale(0.8)"/>',
        '      </g>',
        '      <use href="#lens" x="?"/>',
        '      <path d="M-52,-30H30L38,0Q?,? 0,-2 ?,? -38,0Z" opacity=".25"/>',
        '    </g>',
        '    <path id="brow-r" d="M?,?C?,? ?,? ?,?" fill="none" stroke="black" stroke-width="?"/>',
        '    <use href="#brow-r" transform="matrix(-1,0,0,1,0,?)"/>',
        '    <use href="#tear" x="30" y="2"/>',
        '    <use href="#tear" x="-30" y="3"/>',
        '  </g>',
        '  <path transform="matrix(1,?,0,1,53,?)" d="M-8,0Q-6,-2 -4,?M-1,?C2,-3 2,1 4,-1S6,-6 ?,?" fill="none" stroke="black"/>',
        '</svg>'
    ]
    const dotprod = (X,Y) => X.reduce((a, b, i) => a + b*(Y[i] || 0), 0)
    let index=0,  V= [1, 2*v-1, a1, a2, 2*p-1, g, c, b, t]
    return template.join("\n").replace(/\?/g, () => dotprod(V, data[index++]));
}

export function paramoji_blink_svg(blink, v, a1, a2, d, g, c, b, t=0) {
    const open = paramoji_svg(v, a1, a2, d, g, c, b, t)
    const closed = paramoji_svg((1-blink*a1)*v, (1-blink)*a1, a2, d, g, c, b, t)
    return open.replace(/id="eye[^>]*/, closed.match(/id="eye[^>]*/)[0])
}

export function dark_mode(svg) {
    return svg.replace(/stroke="black"/g, 'stroke="white"')
}

export function unique_id(svg, prefix=null) {
    const id_prefix = prefix || Math.random().toString(36).substring(2, 15)+"-"
    return svg.replace(/(href="#|\(#|id=")/g, "$1"+id_prefix)
}

export function unwrap(svg) {
    return svg.replace(/<\/?svg[^>]*>/g,'')
}