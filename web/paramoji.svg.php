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


$data=array(array(0,22,0,0,-26),array(0,0,-11),array(-8,0,-8),array(0,0,-4),array(-8,0,-
    8),array(0,0,2),array(-8,0,-3),array(0,0,9),array(-4,0,1,0,0,-3),array(0,-6,13),
    array(5,0,12,0,0,-10),array(0,-9,11),array(11,0,8,0,0,-2),array(5,0,12,0,0,-10),
    array(0,-9,-11),array(-4,0,5,0,0,-3),array(0,-6,-13),array(0,0,-11),array(0,0,0,0,26
    ),array(1,0,0,0,0,0,-0.7),array(0,0,0,0,26),array(14,1,0,9,-2),array(0,-12,0,-2),
    array(10,1,0,11,-3,-5),array(0,-2,0,11,0,-10),array(6,0,0,6,-3,-2),array(0,1,0,12),
    array(0,1,0,12),array(-10,-1,0,-11,3,5),array(0,-2,0,11,0,-10),array(-14,-1,0,-9,2),
    array(0,-12,0,-2),array(-10,-1,0,-11,3,5),array(0,-2,0,-11,0,-10),array(-6,0,0,-6,3,
    2),array(0,1,0,-12),array(0,1,0,-12),array(10,1,0,11,-3,-5),array(0,-2,0,-11,0,-10),
    array(14,1,0,9,-2),array(0,-12,0,-2),array(1,0,0,0,0,-0.2),array(0,0,0,0,0,0,0.3),
    array(50,0,0,0,0,0,-12),array(79,0,0,2,-2,-2,-2),array(0,0,0,0,0,0,0,0,0.3),array(7,
    -10,23,0,-20),array(65,-5,0,-6,-2,-5),array(0,0,0,0,0,0,0,15),array(0.3,0,0,0,0,0,0,
    0.7),array(0,0,0,0,0,0,-5),array(80,1,0,6,-6),array(65,0,0,-5,-1),array(51,-2,-10,0,
    0,-5),array(1,0,0,0,0,0,1),array(18,0,0,0,-1,-2,-7),array(0,-2.5,0,0,-1.5),array(0.5
    ,0,5),array(-36,0,0,0,2,4),array(23,1,-4,0,8),array(2,-9,-17,0,5,10),array(-16,1,-10
    ,0,-6,0,3),array(2,-9,-17,0,4,10,15),array(7,1,1,0,-1,-5),array(-13,-5,-8,0,13,10),
    array(14,1,2,0,-1,-12),array(-13,-10,-10,0,9,-6),array(23,2,3,0,-1,-10),array(-13,-
    10,-10,0,5,6),array(31,2,4,0,-1,-7),array(-13,-2,-8,0,1,6),array(1.2,-0.5,1,0,0.5),
    array(0,0,0,0,0,0,4),array(0,0,0,0,0,0,0.4),array(70,-2,0,-8,-1,-8),array(0,0,0,0,0,
    7),array(0,0,0,0,0,7),array(4,0,0,0,0,-4),array(-9,-1,-2,0,0,3));

$template='<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/20' .
    '00/svg" width="100%" height="100%" viewBox="0 0 100 100"><defs><path id="eye" tra' .
    'nsform="rotate(?)" d="M-8,?C?,? ?,? ?,? ?,? ?,? ?,0 ?,? ?,? -8,?Z" fill="white" s' .
    'troke="black"/><clipPath id="clip-eyes"><use id="eye-l" xlink:href="#eye" transfo' .
    'rm="translate(-18,0) rotate(?) scale(-1,?) rotate(?)"/><use id="eye-r" xlink:href' .
    '="#eye" x="18"/></clipPath><clipPath id="clip-lips"><path id="lips" d="M?,?C?,? ?' .
    ',? 0,?S?,? ?,?C?,? ?,? 0,?S?,? ?,?Z" transform="matrix(?,?,0,1,?,?)"/></clipPath>' .
    '<radialGradient id="blush"><stop stop-color="#ff0005" offset=".4"/><stop stop-col' .
    'or="#ff0005" stop-opacity=".5" offset=".8"/><stop stop-color="#ff0005" stop-opaci' .
    'ty="0" offset="1"/></radialGradient><g id="tear" transform="scale(?) translate(0,' .
    '?)"><circle r="20" fill="#4EC1F5" opacity="0.75"/><path d="m-11-10c-8,3-4,25 7,25' .
    ' 8,0 -2,-7 -4,-13 -2,-7 0,-13 -3,-12z" fill="#B3E2FB"/></g></defs><circle id="blu' .
    'sh-r" cx="75" cy="?" r="?" opacity="?" fill="url(#blush)"/><use xlink:href="#blus' .
    'h-r" x="-50" y="?"/><g clip-path="url(#clip-lips)"><rect height="100" width="100"' .
    '/><ellipse cx="50" cy="91" rx="15" ry="10" fill="#800f08"/><g id="teeth-r"><g tra' .
    'nsform="translate(0,?)"><rect id="tooth" x="50.25" rx="2" ry="1" height="15" widt' .
    'h="6.5" fill="white"/><use xlink:href="#tooth" x="7"/></g><g transform="translate' .
    '(0,?)"><use xlink:href="#tooth"/><use xlink:href="#tooth" transform="matrix(1,-.1' .
    '4,0,1,7,7)"/></g></g><use xlink:href="#teeth-r" transform="matrix(-1,0,0,1,100,0)' .
    '"/></g><use xlink:href="#lips" fill="none" stroke="black"/><g transform="translat' .
    'e(50,?)"><use xlink:href="#eye-r"/><use xlink:href="#eye-l" stroke-width="?"/><g ' .
    'clip-path="url(#clip-eyes)"><g id="lens" transform="translate(?,?)"><circle r="5"' .
    ' fill="#9d4922"/><circle r="?"/><circle r="1" cx="-2.5" cy="-1.5" fill="white"/><' .
    'use xlink:href="#tear" x="7" transform="scale(0.8)"/></g><use xlink:href="#lens" ' .
    'x="?"/><path d="M-52,-30H30L38,0Q?,? 0,-2 ?,? -38,0Z" opacity=".25"/></g><path id' .
    '="brow-r" d="M?,?C?,? ?,? ?,?" fill="none" stroke="black" stroke-width="?"/><use ' .
    'xlink:href="#brow-r" transform="matrix(-1,0,0,1,0,?)"/><use xlink:href="#tear" x=' .
    '"30" y="2"/><use xlink:href="#tear" x="-30" y="3"/></g><path transform="matrix(1,' .
    '?,0,1,53,?)" d="M-8,0Q-6,-2 -4,?M-1,?C2,-3 2,1 4,-1S6,-6 ?,?" fill="none" stroke=' .
    '"black"/></svg>';

$v = ($_GET['v'] ?? 50)/100;
$a = $_GET['a'];
$a1 = ($_GET['a1'] ?? $a ?? 50)/100;
$a2 = ($_GET['a2'] ?? $a ?? 50)/100;
$d = ($_GET['d'] ?? 50)/100;
$c = ($_GET['c'] ?? 0)/100;
$g = ($_GET['g'] ?? 0)/100;
$b = ($_GET['b'] ?? 0)/100;
$t = ($_GET['t'] ?? 0)/100;
$s = ($_GET['s'] ?? 0)/100;
$invert = ($_GET['invert'] ?? 0)/100;

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

function render($template, $data, $V) {
  $index = 0;
  return preg_replace_callback('/\?/', function() use (&$index, $V, $data) {
    return dotprod($V, $data[$index++]);
  }, $template);
}

function color_palette($inv, $dark, $hue) {
  if ($dark) $inv = 1 - $inv;
  $l = sprintf('%.3f', 1 - $inv);
  $c = sprintf('%.3f', 1.6*$inv*(1-$inv) - 3*$inv*($inv-0.5)*($inv-1));
  return "oklch($l $c $hue)";
}

function invertable_darkmode($inv, $dark, $svg) {
  $fill = color_palette($inv, $dark, 194);
  $stroke = color_palette(1 - $inv, $dark, 14);
  if ($inv > 0) {
    $svg = preg_replace('/(<svg[^>]*>)/', '$1<rect width="100" height="100" rx="10" fill="'.$fill.'"/>', $svg, 1);
  }
  if ($inv > 0 || $dark) {
    $svg = str_replace('stroke="black"', 'stroke="'.$stroke.'"', $svg);
  }
  return $svg;
}

$svg = render($template, $data, [1, 2*$v-1, $a1, $a2, 2*$d-1, $g, $c, $b, $t]);
$svg = invertable_darkmode($invert, !empty($_GET['dark']), $svg);

echo $svg;
?>
