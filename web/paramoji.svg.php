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

$data=array(array(0,0,0,0,0,0.4),array(70,-2,0,-8,-1),array(-9,-1,-2),array(37,-5,0,0,2,
  4),array(68,-1,-2,-7,-3,-4),array(29,-2,0,-3,2,-17),array(76,-1,0,-8,0,-15),array(25,-
  4,0,-6,2,-10),array(77,-10,0,-2),array(65,4,0,0,-2,-0.5),array(68,-1,-2,-7,-3),array(
  71,2,0,3,-2),array(76,-1,0,-8),array(75,4,0,6,-2),array(77,-10,0,-2),array(80,5,0,6,-6
  ),array(66,2,0,-5,-1),array(14,1,0,9,-2),array(0,-12,0,-2),array(10,1,0,11,-3),array(0
  ,-2,0,11),array(6,0,0,6,-3),array(0,1,0,12),array(0,1,0,12),array(-10,-1,0,-11,3),
  array(0,-2,0,11),array(-14,-1,0,-9,2),array(0,-12,0,-2),array(-10,-1,0,-11,3),array(0,
  -2,0,-11),array(-6,0,0,-6,3),array(0,1,0,-12),array(0,1,0,-12),array(10,1,0,11,-3),
  array(0,-2,0,-11),array(14,1,0,9,-2),array(0,-12,0,-2),array(0,0,0,0,0,0.3),array(50,0
  ,0,0,0,-12),array(81,2,0,0,-3,-2),array(51,-2,-10),array(0,22,0,0,-26),array(0,0,-11),
  array(-8,0,-8),array(0,0,-4),array(-8,0,-8),array(0,0,2),array(-8,0,-3),array(0,0,9),
  array(-4,0,1),array(0,-6,13),array(5,0,12),array(0,-9,11),array(11,0,8),array(5,0,12),
  array(0,-9,-11),array(-4,0,5),array(0,-6,-13),array(0,0,-11),array(0,0,0,0,26),array(1
  ,0,0,0,0,-0.8),array(0,-22),array(0,0,-11),array(8,0,8),array(0,0,-4),array(8,0,8),
  array(0,0,2),array(8,0,3),array(0,0,9),array(4,0,-1),array(0,-6,13),array(-5,0,-12),
  array(0,-9,11),array(-11,0,-8),array(-5,0,-12),array(0,-9,-11),array(4,0,-5),array(0,-
  6,-13),array(0,0,-11),array(1,0,0,0,0,1),array(0,0,0,0,-1,-7),array(0,-2.5,0,0,-1.5),
  array(0.5,0,5),array(-36,0,0,0,2),array(5,1,-4,0,8),array(2,-9,-17,0,5),array(-34,1,-
  10,0,-6,3),array(2,-9,-17,0,4,15),array(59,2,-1,0,-6),array(40,-7,-19,0,12),array(70,1
  ,2,0,-5),array(40,-12,-21,0,3),array(81,1,5,0,-4),array(40,-4,-19,0,-3),array(2,-0.5,1
  ,0,0.5),array(62,0,-4,0,-2),array(33,-5,-16,0,7),array(56,2,0,0,-3),array(39,-7,-22,0,
  9),array(56,1,0,0,-1),array(41,-8,-20,0,10),array(0,0,0,0,0,4));

$template='<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/20' .
  '00/svg" width="100%" height="100%" viewBox="0 0 100 100"><defs><clipPath id="clip-e' .
  'yes"><use xlink:href="#eye-l"/><use xlink:href="#eye-r"/></clipPath><clipPath id="c' .
  'lip-lips"><use xlink:href="#lips"/></clipPath></defs><path transform="matrix(1,?,0,' .
  '1,53,?)" d="M-4,0q-2,-2 -4,0M-1,0Q3,-2 4,-1T6,-3 4,?" fill="none" stroke="black"/><' .
  'path d="M?,?Q?,? ?,? M?,?Q?,? ?,?" fill="none" stroke="black"/><g clip-path="url(#c' .
  'lip-lips)"><rect height="100" width="100"/><ellipse cx="50" cy="91" rx="15" ry="10"' .
  ' fill="#800f08"/><g transform="translate(0,?)"><use xlink:href="#tooth" x="-14"/><u' .
  'se xlink:href="#tooth" x="-7"/><use xlink:href="#tooth"/><use xlink:href="#tooth" x' .
  '="7"/></g><g transform="translate(0,?)"><use xlink:href="#tooth" transform="matrix(' .
  '1,.14,0,1,-14,-8)"/><use xlink:href="#tooth" x="-7"/><rect id="tooth" x="50.5" rx="' .
  '2" ry="1" height="15" width="6" fill="white" stroke="black" stroke-width=".5"/><use' .
  ' xlink:href="#tooth" transform="matrix(1,-.14,0,1,7,7)"/></g></g><path id="lips" d=' .
  '"M?,?C?,? ?,? 0,?S?,? ?,?C?,? ?,? 0,?S?,? ?,?Z" transform="matrix(1,?,0,1,?,?)" fil' .
  'l="none" stroke="black"/><g transform="translate(68,?)"><path id="eye-r" transform=' .
  '"rotate(?)" d="M-8,?C?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? -8,?Z" fill="white" stroke="bl' .
  'ack"/><path id="eye-l" transform="translate(-36,0) rotate(?) scale(1,?) rotate(?)" ' .
  'd="M8,?C?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? 8,?Z" fill="white" stroke="black" stroke-wi' .
  'dth="?"/><g clip-path="url(#clip-eyes)"><g id="lens" transform="translate(?,?)"><ci' .
  'rcle r="5" fill="#9d4922"/><circle r="?"/><circle r="1" cx="-2.5" cy="-1.5" fill="w' .
  'hite"/></g><use xlink:href="#lens" x="?"/><path d="M-70,-30H30L20,0Q?,? -18,-2 ?,? ' .
  '-56,0Z" opacity=".25"/></g></g><g id="brow-r"><path d="M?,?Q?,? ?,?" fill="none" st' .
  'roke="black" stroke-width="?"/><path d="M?,?Q?,? ?,?" fill="none" stroke="black"/><' .
  '/g><use xlink:href="#brow-r" transform="matrix(-1,0,0,1,100,?)"/></svg>';

$v = ($_GET['v'] ?? 50)/100;
$a = $_GET['a'];
$a1 = ($_GET['a1'] ?? $a ?? 50)/100;
$a2 = ($_GET['a2'] ?? $a ?? 50)/100;
$d = ($_GET['d'] ?? 50)/100;
$c = ($_GET['c'] ?? 0)/100;
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

$V= [1, 2*$v-1, $a1, $a2, 2*$d-1, $c];
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

echo $svg;
?>
