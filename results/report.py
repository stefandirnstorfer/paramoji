import numpy as np
import json
from results.common import base_url

resultA = json.load(open('gen/resultA.json', 'r'))
resultB = json.load(open('gen/resultB.json', 'r'))

imgscale= 0.6


def worker_link(w, relative=False):
    return '%sworker-%s.html' % ('' if relative else 'gen/', w)


def image(face):
    return '<img src="%s/emoticon-data/%s" width="%f%%"/>' % (base_url, face, imgscale*100)


def emoji(scale, code):
    return '<img width="%f" src="%s/emoticon-data/emoji/emoji_u%0x.svg"/>' % (round(imgscale * 500 * scale), base_url, code)


def iframe(size, state):
    return ('<div style="width: %dpx; height: %dpx;"' % (imgscale * size, imgscale*size)) + \
           ' data-eval="paramoji_svg(%f,%f,%f,%f,%f)"></div>' % state

def footer():
    return f'<script src="../../paramoji.js"></script>' + \
         '<script>let controls_svg=null; document.querySelectorAll("[data-eval]").forEach(' + \
         '(a,i) => a.innerHTML=eval(a.getAttribute("data-eval"))' + \
         '.replace(/href="#/g,"href=\\"#id-"+i+"-")' + \
         '.replace(/\\(#/g,"(#id-"+i+"-")' + \
         '.replace(/id="/g,"id=\\"id-"+i+"-"))</script>'




files = sorted(set(list(resultA.keys()) + list(resultB.keys())))

out = open("gen/index.html", "w")
out.write('<style>td { font-family: Arial; text-align: center }</style>')
out.write('<table>\n')
for face in files:
    out.write('<tr style="page-break-inside: avoid">')
    out.write(f'<td colspan="3">{face}</td>')
    out.write('</tr>')
    out.write('<tr style="page-break-inside: avoid">')
    out.write('<td>%d</td>' % (files.index(face)+1))
    out.write('<td align="right">%s</td>' % image(face))
    out.write('<td valign="bottom">')
    if face in resultA:
        x_opt = resultA[face]['x_opt']
        emojis = sorted(x_opt.keys())
        denom = np.sum(np.sqrt(np.exp(list(x_opt.values()))))
        for i in emojis:
            p = np.sqrt(np.exp(x_opt[i])) / denom
            if p > 0.01:
                out.write(emoji(p.item(), int(i, 16)))
        out.write(f"n={resultA[face]['n']}")
    out.write('</td>')
    out.write('<td valign="bottom">')
    if face in resultB:
        x_opt = resultB[face]['x_opt']
        out.write(iframe(200, tuple(x_opt)))
        out.write(f"n={resultB[face]['n']}")
    out.write('</td>')
    out.write('</tr>\n')
out.write('</table>\n')
out.write(footer())
out.close()
