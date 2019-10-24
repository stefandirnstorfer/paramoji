function emoticon_svg_raw2(v,a,p) {
  v=v/50-1; a=a/50-1; p=p/50-1;
  X=[1, v, a, p];
  let l=0, d=[
      // left-eye-outline
      [1031,-45,-0,-7],
      [1133,-83,-161,39],
      [1117,-5,49,-13],
      [1184,-91,-118,39],
      [1128,23,35,-20],
      [1295,-90,-43,16],
      [1055,59,-4,-0],
      [1354,-61,-9,9],
      [917,91,-41,-4],
      [1374,-103,17,0],
      [731,73,-61,-19],
      [1326,-32,-19,-13],
      [691,20,-21,-15],
      [1252,47,-81,-21],
      [704,-79,-68,-10],
      [1152,-39,-148,-26],
      [910,-82,-26,-9],
      [1097,-104,-175,14],
      [1031,-45,-0,-7],
      [1133,-83,-161,39],
      // iris
      [1237,-27,-64,9],
      // pupil
      [32,7,10,-0],
      [32,7,10,-0],
      [1237,-27,-64,9],
      // glare
      [19,7,10,2],
      [19,7,10,2],
      [885,-10,7,1],
      [1216,-32,-81,7],
      // left-lid-shadow
      [1223,-16,-147,71],
      [971,6,-16,-33],
      [1083,-146,-202,9],
      [718,4,-51,-35],
      [1133,-80,-167,-52],
      [1328,-30,-95,3],
      // right-lid-shadow
      [1296,-26,-149,36],
      [1252,-14,-174,-15],
      [1707,7,-27,85],
      [1065,-131,-190,2],
      [1469,-23,-16,47],
      [1128,-109,-149,-2],
      [1296,-26,-149,36],
      // left-eye-brow
      [1087,-18,-0,95],
      [996,-138,-167,199],
      [940,-11,-9,82],
      [968,-165,-165,105],
      [770,-22,-17,82],
      [982,-156,-160,32],
      [613,-4,-17,58],
      [1043,-83,-142,-16],
      [609,-10,-20,69],
      [1014,-73,-146,-16],
      [772,-33,-23,92],
      [950,-142,-172,28],
      [938,-18,-15,93],
      [938,-159,-171,104],
      [1081,-12,-3,103],
      [942,-135,-171,159],
      // upper-teeth
      [2,-0,-73,-3],
      // lower-teeth
      [249,1,2,-6],
      // mouth-outline
      [1659,23,53,2],
      [1884,-149,-44,17],
      [1607,59,63,-35],
      [1958,-53,-8,9],
      [1429,30,16,-7],
      [1992,4,26,-0],
      [1992,4,27,-0],
      [1071,-30,-16,7],
      [1992,4,26,-0],
      [893,-59,-63,35],
      [1958,-53,-8,9],
      [841,-23,-53,-2],
      [1884,-149,-44,17],
      [908,11,-67,36],
      [1832,-46,-99,38],
      [1073,-13,-23,23],
      [1853,-14,-95,-7],
      [1852,-15,-96,-7],
      [1427,13,23,-23],
      [1853,-14,-95,-7],
      [1592,-11,67,-36],
      [1832,-46,-99,38],
      [1659,23,53,2],
      [1884,-149,-44,17],
      // wrinkle-left-brow
      [1074,-34,-32,137],
      [937,-122,-210,130],
      [1105,-28,-22,122],
      [956,-134,-215,182],
      [1125,-18,-19,89],
      [999,-133,-216,218],
      [1125,-13,-12,74],
      [1041,-134,-213,224],
      // wrinkle-left-cheek
      [702,-81,-43,-2],
      [1881,-172,-45,22],
      [735,-55,-48,31],
      [1813,-56,-78,31],
      [868,-73,-26,41],
      [1730,-41,-86,32],
      [906,-112,-2,18],
      [1651,-34,-74,-17],
      // nose-path
      [1125,11,-9,-4],
      [1670,-11,-79,-4],
      [1147,13,-1,-1],
      [1651,-14,-78,-2],
      [1212,-7,2,3],
      [1659,-19,-95,4],
      [1230,1,-2,-1],
      [1679,-20,-87,7],
      [1364,9,41,-15],
      [1397,-9,-15,3],
      [1399,6,60,-6],
      [1514,-5,-51,-7],
      [1474,1,19,-4],
      [1597,-7,-66,-11],
      [1439,-1,14,2],
      [1648,-12,-72,-7],
      [1412,-4,7,4],
      [1688,-20,-76,3],
      [1376,4,2,-7],
      [1655,-20,-105,-0],
      [1325,4,-3,-3],
      [1681,-17,-89,2],
  ].map(c => X.reduceRight((a,b) => a + b*c.pop(), 0)/10);
  return ('<svg height="100%" id="emoticon-front-view" version="1.1" viewBox="0 0 250 250" width="100%" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
      + '	<defs id="defs">'
      + '		<clipPath id="clipPath-left-eye">'
      + '			<use height="1" id="use-left-eye-outline-1" transform="matrix(1,0,0,1,0,0)" width="1" x="0" xlink:href="#left-eye-outline" y="0"/>'
      + '		</clipPath>'
      + '		<clipPath id="clipPath-right-eye">'
      + '			<use height="250" id="use-left-eye-outline-2" morph="fixed" transform="matrix(-1,0,0,1,250,0)" width="250" x="0" xlink:href="#left-eye-outline" y="0"/>'
      + '		</clipPath>'
      + '		<clipPath clipPathUnits="userSpaceOnUse" id="clipPath-mouth">'
      + '			<use height="250" id="use-mouth-outline" transform="matrix(1,0,0,1,0,0)" width="250" x="0" xlink:href="#mouth-outline" y="0"/>'
      + '		</clipPath>'
      + '	</defs>'
      + '	<g id="head" morph="fixed" transform="matrix(1,0,0,1,0,0)">'
      + '		<path d="M 124.98,230.66 C 172.77,230.75 215.51,200.57 215.91,132.64 216.3,64.72 173.26,31.81 123.18,31.53 73.1,31.24 33.88,66.28 33.59,132.64 33.3,199.01 77.19,230.57 124.98,230.66 Z" id="head-outline" style="fill:#e9c6af;stroke:none;stroke-width:1.0;fill-opacity:0.52968037"/>'
      + '	</g>'
      + '	<g id="left-eye">'
      + '		<path d="M ?,? C ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? ?,? Z" id="left-eye-outline" style="fill:#ffffff;stroke:#000000;stroke-width:1"/>'
      + '		<g clip-path="url(#clipPath-left-eye)" id="left-eyeball">'
      + '			<g id="left-lens">'
      + '				<path d="M 1,0 C 1,0.56 0.56,1 0,1 -0.56,1 -1,0.56 -1,0 -1,-0.56 -0.56,-1 0,-1 0.56,-1 1,-0.56 1,0 z" id="iris" morph="relative" style="fill:#9d4922;stroke:#000000;stroke-width:0.0034" transform="matrix(8.91,0,0,8.91,93.1,?)"/>'
      + '				<path d="M 1,0 C 1,0.56 0.56,1 0,1 -0.56,1 -1,0.56 -1,0 -1,-0.56 -0.56,-1 0,-1 0.56,-1 1,-0.56 1,0 z" id="pupil" morph="relative" style="fill:#000000;stroke:#000000;stroke-width:0.03" transform="matrix(?,0,0,?,93,?)"/>'
      + '				<path d="M 1,0 C 1,0.56 0.56,1 0,1 -0.56,1 -1,0.56 -1,0 -1,-0.56 -0.56,-1 0,-1 0.56,-1 1,-0.56 1,0 z" id="glare" morph="transform-only" style="fill:#ffffff;stroke:none" transform="matrix(?,0,0,?,?,?)"/>'
      + '			</g>'
      + '			<path d="M 50,75 125,75 125,? C ?,? ?,? 50,? Z" id="left-lid-shadow" style="opacity:0.24;fill:#000000;stroke:#000000;stroke-width:0px"/>'
      + '		</g>'
      + '	</g>'
      + '	<g id="right-eye">'
      + '		<use height="250" id="right-eye-outline" morph="fixed" transform="matrix(-1,0,0,1,250,0)" width="250" x="0" xlink:href="#left-eye-outline" y="0"/>'
      + '		<g clip-path="url(#clipPath-right-eye)" id="right-eyeball">'
      + '			<use height="1" id="right-lens" morph="fixed" transform="matrix(1,0,0,1,64,0)" width="1" x="0" xlink:href="#left-lens" y="0"/>'
      + '			<path d="M 125,? 125,75 200,75 200,? C ?,? ?,? 125,? Z" id="right-lid-shadow" style="opacity:0.24;fill:#000000;stroke:#000000;stroke-width:0px"/>'
      + '		</g>'
      + '	</g>'
      + '	<path d="M ?,? C ?,? ?,? ?,? L ?,? C ?,? ?,? ?,? Z" id="left-eye-brow" style="fill:#292929;stroke-width:1"/>'
      + '	<use height="250" id="right-eye-brow" transform="matrix(-1,0,0,1,250,0)" width="250" x="0" xlink:href="#left-eye-brow" y="0"/>'
      + '	<g id="mouth">'
      + '		<g clip-path="url(#clipPath-mouth)" id="mouth-interior">'
      + '			<rect height="66.55629" id="mouth-background" style="fill:#000000;stroke:none" width="119.94381" x="68.159775" y="159.93378"/>'
      + '			<path d="M 94.8,211 C 94.5,191 111,190 127,189 145,188 158,193 158,211 137,211 116,211 94.8,211 Z" id="tongue" style="fill:#800f08;stroke:none"/>'
      + '			<g id="upper-teeth" morph="fix-children" transform="matrix(1,0,0,1,0.481,?)">'
      + '				<use id="tooth-02" transform="matrix(1,0.14,0,1,-24,-18)" xlink:href="#tooth-04"/>'
      + '				<use id="tooth-03" transform="matrix(1,0.05,0,1,-12,-6)" xlink:href="#tooth-04"/>'
      + '				<rect height="15" id="tooth-04" rx="2" ry="2" style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-opacity:1" width="10" x="118" y="174"/>'
      + '				<use id="tooth-05" transform="matrix(1,-0.05,0,1,12,6)" xlink:href="#tooth-04"/>'
      + '				<use id="tooth-06" transform="matrix(1,-0.14,0,1,24,16)" xlink:href="#tooth-04"/>'
      + '			</g>'
      + '			<g id="lower-teeth" morph="fix-children" transform="matrix(1,0,0,1,0.481,?)">'
      + '				<use id="tooth-09" transform="translate(-24,0)" xlink:href="#tooth-04"/>'
      + '				<use id="tooth-10" transform="translate(-12,0)" xlink:href="#tooth-04"/>'
      + '				<use id="tooth-11" transform="translate(0,0)" xlink:href="#tooth-04"/>'
      + '				<use id="tooth-12" transform="translate(12,0)" xlink:href="#tooth-04"/>'
      + '				<use id="tooth-13" transform="translate(24,0)" xlink:href="#tooth-04"/>'
      + '			</g>'
      + '		</g>'
      + '		<path d="M ?,? C ?,? ?,? 125,? ?,? ?,? ?,? ?,? ?,? 125,? ?,? ?,? ?,? Z" id="mouth-outline" style="fill:none;stroke:#000000;stroke-width:1px"/>'
      + '	</g>'
      + '	<g id="wrinkles">'
      + '		<path d="M ?,? C ?,? ?,? ?,?" id="wrinkle-left-brow" style="fill:none;stroke:#000000;stroke-width:0.5"/>'
      + '		<path d="M ?,? C ?,? ?,? ?,?" id="wrinkle-left-cheek" style="fill:none;stroke:#000000;stroke-width:0.5"/>'
      + '		<use height="250" id="wrinkle-right-brow" morph="fixed" transform="matrix(-1,0,0,1,250,0)" width="250" x="0" xlink:href="#wrinkle-left-brow" y="0"/>'
      + '		<use height="250" id="wrinkle-right-cheek" morph="fixed" transform="matrix(-1,0,0,1,250,0)" width="250" x="0" xlink:href="#wrinkle-left-cheek" y="0"/>'
      + '	</g>'
      + '	<g id="nose">'
      + '		<path d="M ?,? C ?,? ?,? ?,? M ?,? C ?,? ?,? ?,? ?,? ?,? ?,?" id="nose-path" style="fill:none;stroke:#000000"/>'
      + '	</g>'
      + '</svg>'  ).replace(/\?/g, () => d[l++]);
}
