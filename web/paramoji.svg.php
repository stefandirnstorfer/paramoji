<?php
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

if ($_GET['showSource']) {
    header('Content-type: text/plain');
    $file = fopen(__FILE__,"r");
    while(! feof($file)) echo fgets($file);
    fclose($file);
    return;
}
header("Cache-Control: max-age=2592000");
header('Content-Type: image/svg+xml');

$data=array(array(65,-5,0,-6,-2,-5),array(0,0,0,0,0,0,0,10),array(80,1,0,6,-6),array(65,
    0,0,-5,-1),array(14,1,0,9,-2),array(0,-12,0,-2),array(10,1,0,11,-3,-5),array(0,-2,0,
    11,0,-10),array(6,0,0,6,-3,-2),array(0,1,0,12),array(0,1,0,12),array(-10,-1,0,-11,3,
    5),array(0,-2,0,11,0,-10),array(-14,-1,0,-9,2),array(0,-12,0,-2),array(-10,-1,0,-11,
    3,5),array(0,-2,0,-11,0,-10),array(-6,0,0,-6,3,2),array(0,1,0,-12),array(0,1,0,-12),
    array(10,1,0,11,-3,-5),array(0,-2,0,-11,0,-10),array(14,1,0,9,-2),array(0,-12,0,-2),
    array(1,0,0,0,0,-0.2),array(0,0,0,0,0,0,0.3),array(50,0,0,0,0,0,-12),array(79,0,0,2,
    -2,-2,-2),array(51,-2,-10,0,0,-5),array(0,22,0,0,-26),array(0,0,-11),array(-8,0,-8),
    array(0,0,-4),array(-8,0,-8),array(0,0,2),array(-8,0,-3),array(0,0,9),array(-4,0,1,0
    ,0,-3),array(0,-6,13),array(5,0,12,0,0,-10),array(0,-9,11),array(11,0,8,0,0,-2),
    array(5,0,12,0,0,-10),array(0,-9,-11),array(-4,0,5,0,0,-3),array(0,-6,-13),array(0,0
    ,-11),array(0,0,0,0,26),array(1,0,0,0,0,0,-0.7),array(0,-22),array(0,0,-11),array(8,
    0,8),array(0,0,-4),array(8,0,8),array(0,0,2),array(8,0,3),array(0,0,9),array(4,0,-1,
    0,0,3),array(0,-6,13),array(-5,0,-12,0,0,10),array(0,-9,11),array(-11,0,-8,0,0,2),
    array(-5,0,-12,0,0,10),array(0,-9,-11),array(4,0,-5,0,0,3),array(0,-6,-13),array(0,0
    ,-11),array(1,0,0,0,0,0,1),array(18,0,0,0,-1,-2,-7),array(0,-2.5,0,0,-1.5),array(0.5
    ,0,5),array(-36,0,0,0,2,4),array(23,1,-4,0,8),array(2,-9,-17,0,5,10),array(-16,1,-10
    ,0,-6,0,3),array(2,-9,-17,0,4,10,15),array(0,2,0,0,-8),array(8,2,-1,0,-1,-5),array(-
    13,-5,-8,0,14,10),array(15,2,1,0,-1,-12),array(-13,-10,-10,0,11,-6),array(23,2,3,0,-
    1,-10),array(-13,-10,-10,0,8,6),array(30,2,5,0,-1,-7),array(-13,-2,-8,0,5,6),array(
    1.2,-0.5,1,0,0.5),array(0,0,0,0,0,0,4),array(0,0,0,0,0,0,0.4),array(70,-2,0,-8,-1,-8
    ),array(0,0,0,0,0,7),array(0,0,0,0,0,7),array(4,0,0,0,0,-4),array(-9,-1,-2,0,0,3));

$template='<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/20' .
    '00/svg" width="100%" height="100%" viewBox="0 0 100 100"><defs><clipPath id="clip' .
    '-eyes"><use xlink:href="#eye-l"/><use xlink:href="#eye-r"/></clipPath><clipPath i' .
    'd="clip-lips"><use xlink:href="#lips"/></clipPath></defs><circle id="blush" cx="2' .
    '5" cy="?" r="?" filter="blur(5px)" fill="#d3251b"/><use xlink:href="#blush" trans' .
    'form="matrix(-1,0,0,1,100,0)"/><g clip-path="url(#clip-lips)"><rect height="100" ' .
    'width="100"/><ellipse cx="50" cy="91" rx="15" ry="10" fill="#800f08"/><g id="righ' .
    't-teeth"><g transform="translate(0,?)"><use xlink:href="#tooth"/><use xlink:href=' .
    '"#tooth" x="7"/></g><g transform="translate(0,?)"><rect id="tooth" x="50.5" rx="2' .
    '" ry="1" height="15" width="6" fill="white" stroke="black" stroke-width=".5"/><us' .
    'e xlink:href="#tooth" transform="matrix(1,-.14,0,1,7,7)"/></g></g><use xlink:href' .
    '="#right-teeth" transform="matrix(-1,0,0,1,100,0)"/></g><path id="lips" d="M?,?C?' .
    ',? ?,? 0,?S?,? ?,?C?,? ?,? 0,?S?,? ?,?Z" transform="matrix(?,?,0,1,?,?)" fill="no' .
    'ne" stroke="black"/><g transform="translate(50,?)"><path id="eye-r" transform="tr' .
    'anslate(18,0) rotate(?)" d="M-8,?C?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? -8,?Z" fill="wh' .
    'ite" stroke="black"/><path id="eye-l" transform="translate(-18,0) rotate(?) scale' .
    '(1,?) rotate(?)" d="M8,?C?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? 8,?Z" fill="white" strok' .
    'e="black" stroke-width="?"/><g clip-path="url(#clip-eyes)"><g id="lens" transform' .
    '="translate(?,?)"><circle r="5" fill="#9d4922"/><circle r="?"/><circle r="1" cx="' .
    '-2.5" cy="-1.5" fill="white"/></g><use xlink:href="#lens" x="?"/><path d="M-52,-3' .
    '0H30L38,0Q?,? 0,-2 ?,? -38,0Z" opacity=".25"/></g><path id="brow-r" transform="ro' .
    'tate(?)" d="M?,?C?,? ?,? ?,?" fill="none" stroke="black" stroke-width="?"/><use x' .
    'link:href="#brow-r" transform="matrix(-1,0,0,1,0,?)"/></g><path transform="matrix' .
    '(1,?,0,1,53,?)" d="M-8,0Q-6,-2 -4,?M-1,?C2,-3 2,1 4,-1S6,-6 ?,?" fill="none" stro' .
    'ke="black"/></svg>';

$v = ($_GET['v'] ?? 50)/100;
$a = $_GET['a'];
$a1 = ($_GET['a1'] ?? $a ?? 50)/100;
$a2 = ($_GET['a2'] ?? $a ?? 50)/100;
$d = ($_GET['d'] ?? 50)/100;
$c = ($_GET['c'] ?? 0)/100;
$g = ($_GET['g'] ?? 0)/100;

$o = $_GET['o'];
if (!is_null($o)) {
  $a = ($a1+$a2)/2;
  $a1 = $a + $o/100 - 0.5;
  $a2 = $a - $o/100 + 0.5;
}
$size = $_GET['size'];
if ($size) {
  $template = preg_replace('/100%/', $size, $template, 2);
}

function dotprod($X, $Y) {
  $value = 0;
  for ($j = 0; $j < count($Y); $j++) {
    $value += $Y[$j] * $X[$j];
  }
  return $value;
}

$V= [1, 2*$v-1, $a1, $a2, 2*$d-1, $g, $c];
$index = 0;
$svg = preg_replace_callback('/\?/', function() use (&$index, $V, $data) {
  return dotprod($V, $data[$index++]);
}, $template);

// experimental inclusion of love
$l = ($_GET['l'] ?? 0)/100;
if ($l > 0) {
  $data= array(
    array(0, 1),
    array(0.5, -0.2),
    array(0, 1));
  $V= [1, $l];
  $index=0;
  $template= '<path id="love"' .
    ' d="m -21,-13 c -11,0 -19,8 -19,18 0,14 9,23 40,48 C 32,28 40,19 40,5 40,-5 32,-13 21,-13 12,-13 7,-8 3,-3 L 0,1 -3,-3 c -4,-5 -9,-10 -18,-10 z"' .
    ' transform="translate(50,55) scale(?) translate(0, -15)"' .
    ' style="fill:rgba(100,0,0,?); stroke: black; stroke-width:0.5" />';
  $love = preg_replace_callback('/\?/', function() use (&$index, $V, $data) {
    return dotprod($V, $data[$index++]);
  }, $template);
  $svg = preg_replace('/(?=<path id="lips")/', $love, $svg, 1);
  $svg = preg_replace('/(?=<\/svg>)/', '<use xlink:href="#love"/>' , $svg, 1);
}


if ($_GET['dark']) {
  $svg = preg_replace('/(<(?!rect id="tooth")[^>]*) stroke="black"/', '$1 stroke="white"', $svg);
}

echo $svg;
?>
