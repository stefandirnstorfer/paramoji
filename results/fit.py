import numpy as np
from results.common import base_url, EMOJI
from results.fitA import RESULT as resultA
from results.fitB import RESULT as resultB

files = sorted(resultA.keys() + resultB.keys())

out = open("result.html", "w")
out.write('<table>\n')
for face in files:
    out.write('<tr>')
    out.write('<td align="right"><img src="%s/emoticon-data/%s"/></td>' % (base_url, face))
    out.write('<td>')
    if face in resultB:
        x_opt = resultB[face]['x_opt']
        out.write('<iframe width="200px" height="200px" frameborder="0"' +
                  'src="/emoticons/viewer.html?a&v=%d&a=%d&p=%d&c=%d&e=%d"></iframe>' % tuple(x_opt))
    out.write('</td>')
    out.write('<td>')
    if face in resultA:
        x_opt = resultA[face]['x_opt']
        p = np.exp(x_opt) / np.sum(np.exp(x_opt))
        for i in range(len(p)):
            if p[i] > 0.01:
                out.write('<img width="%f" src="%s/emoticon-data/emoji/emoji_u%0x.svg"/>' %
                          (round(500 * p[i]), base_url, EMOJI[i]))
    out.write('</td>')
    out.write('</tr>\n')
out.write('</table>\n')
out.close()
