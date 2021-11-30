import numpy as np
import json
from results.common import base_url, groupA, groupB, raw_data
from results.fitA import RESULT as resultA
from results.fitB import RESULT as resultB
from results.bayesA import PA_inferred as inferredA
from results.bayesB import PA_inferred as inferredB

#resultA = json.load(open('gen/resultA.json', 'r'))
#AresultB = json.load(open('gen/resultB.json', 'r'))

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
           ' data-eval="emoticon_svg(%d,%d,%d,%d,%d)"></div>' % state


def footer():
    return f'<script src="{base_url}/emoticons/emoticon.js"></script>' + \
         '<script>document.querySelectorAll("[data-eval]").forEach(' + \
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
            state = [choice[key] for key in ['valence', 'arousal', 'potency', 'contempt', 'expression']]
            emo = iframe(75, tuple(state))
            out.write('<td class="%s">%s</td>' % (css_class, emo))
        index += 1
    return result


files = sorted(set(list(resultA.keys()) + list(resultB.keys())))
for face in files:
    out = open(details_link(face), "w")
    out.write('<style>.selected { border: 2px solid blue; background-color: steelblue; } '
              'h1 { font-family: Arial }</style>')
    out.write('<h1>%s <a href="index.html">[X]</a></h1>' % face)
    out.write('%s<br/>' % image(face))
    rows = [row for row in groupA if row['file'] == face]
    out.write('<h1>Group A (%d)</h1><table>' % len(rows))
    for row in rows:
        out.write('<tr><td><a href="%s">%s</a></td>' % (worker_link(row['worker'], True), row['worker']))
        out.write(render_choices(row['choices'], row['selected']))
        out.write('</tr>')
    out.write('</table>')
    rows = [row for row in groupB if row['file'] == face]
    out.write('<h1>Group B (%d)</h1><table>' % len(rows))
    for row in rows:
        out.write('<tr><td><a href="%s">%s</a></td>' % (worker_link(row['worker'], True), row['worker']))
        out.write(render_choices(row['choices'], row['selected']))
        out.write('</tr>')
    out.write('</table>')
    out.write(footer())
    out.close()

workers = sorted(set([row['workerId'] for row in raw_data]))
for worker in workers:
    out = open(worker_link(worker), "w")
    out.write('<style>.selected { border: 2px solid blue; background-color: steelblue; } '
              'h1 { font-family: Arial }</style>')
    out.write('<h1>%s <a href="index.html">[X]</a></h1>' % worker)
    out.write('<table>')
    for row in [row for row in raw_data if row['workerId'] == worker]:
        for item in row['items']:
            out.write('<tr><td><a href="%s">%s</a></td>' % (details_link(item['file'], True), image(item['file'])))
            out.write(render_choices(item['choices'], item['selected']))
            out.write('</tr>')
    out.write('</table>')
    out.write(footer())
    out.close()

out = open("gen/index.html", "w")
out.write('<style>td { font-family: Arial; text-align: center }</style>')
out.write('<table>\n')
for face in files:
    out.write('<tr style="page-break-inside: avoid">')
    out.write('<td>%d</td>' % (files.index(face)+1))
    out.write('<td align="right"><a href="%s">%s</a></td>' % (details_link(face, True), image(face)))
    out.write('<td valign="bottom">')
    if face in resultB:
        x_opt = resultB[face]['x_opt']
        out.write(iframe(200, tuple(x_opt)))
        out.write('<p/> %.0f%%' % inferredB[face])
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
        out.write('<p/> %.0f%%' % inferredA[face])
    out.write('</td>')
    out.write('</tr>\n')
out.write('<tr style="background-color:black; height:1px"><td colspan="4"/></tr>')
out.write('<tr><td/><td>Summary</td>')
out.write('<td padding="5ex"> %.0f%%</td>' % np.mean(list(inferredB.values())))
out.write('<td padding="5ex"> %.0f%%</td></tr>' % np.mean(list(inferredA.values())))
out.write('</table>\n')
out.write(footer())
out.close()
