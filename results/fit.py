import numpy as np
import json
from results.common import base_url, raw_data, emotion_params
from results.fitA import RESULT as resultA
from results.fitB import RESULT as resultB

#resultA = json.load(open('gen/resultA.json', 'r'))
#resultB = json.load(open('gen/resultB.json', 'r'))

imgscale= 0.6

def details_link(f: str, relative=False):
    return '%sface-%s.html' % ('' if relative else 'gen/', f.replace('/', '_'))


def worker_link(w, relative=False):
    return '%sworker-%s.html' % ('' if relative else 'gen/', w)


def image(face):
    return '<img src="%s/emoticon-data/%s" width="%f%%"/>' % (base_url, face, imgscale*100)


def emoji(scale, code):
    return '<img width="%f" src="%s/emoticon-data/emoji/emoji_u%0x.svg"/>' % (round(imgscale * 500 * scale), base_url, code)


def iframe(size, state):
    return ('<div style="width: %dpx; height: %dpx;"' % (imgscale * size, imgscale*size)) + \
           ' data-eval="emoticon_svg(%d,%d,%d,%d,%d,%d)"></div>' % state


def footer():
    return f'<script src="../../paramoji.js"></script>' + \
         '<script>let controls_svg=null; document.querySelectorAll("[data-eval]").forEach(' + \
         '(a,i) => a.innerHTML=eval(a.getAttribute("data-eval"))' + \
         '.replace(/href="#/g,"href=\\"#id-"+i+"-")' + \
         '.replace(/\\(#/g,"(#id-"+i+"-")' + \
         '.replace(/id="/g,"id=\\"id-"+i+"-"))</script>'


def render_choices(choices, selected):
    index = 0
    result = ''
    for choice in choices:
        css_class = "selected" if index == selected else ''
        if 'code' in choice:
            result += '<td class="%s">%s</td>' % (css_class, emoji(0.15, choice['code']))
        else:
            state = [choice[key] for key in emotion_params]
            emo = iframe(75, tuple(state))
            out.write('<td class="%s">%s</td>' % (css_class, emo))
        index += 1
    return result


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
    out.write('<td align="right"><a href="%s">%s</a></td>' % (details_link(face, True), image(face)))
    out.write('<td valign="bottom">')
    if face in resultB:
        x_opt = resultB[face]['x_opt']
        out.write(iframe(200, tuple(x_opt)))
    out.write('</td>')
    out.write('<td valign="bottom">')
    if face in resultA:
        x_opt = resultA[face]['x_opt']
        emojis = sorted(x_opt.keys())
        denom = np.sum(np.sqrt(np.exp(list(x_opt.values()))))
        for i in emojis:
            p = np.sqrt(np.exp(x_opt[i])) / denom
            if p > 0.01:
                out.write(emoji(p.item(), int(i, 16)))
    out.write('</td>')
    out.write('</tr>\n')
out.write('</table>\n')
out.write(footer())
out.close()
