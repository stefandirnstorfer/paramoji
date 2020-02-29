import numpy as np
import json
from results.common import base_url, EMOJI, groupA, groupB, raw_data

# from results.fitA import RESULT as resultA
# from results.fitB import RESULT as resultB

resultA = json.load(open('gen/resultA.json', 'r'))
resultB = json.load(open('gen/resultB.json', 'r'))

def details_link(f: str, relative=False):
    return '%sface-%s.html' % ('' if relative else 'gen/', f.replace('/', '_'))


def worker_link(w, relative=False):
    return '%sworker-%s.html' % ('' if relative else 'gen/', w)


def image(face):
    return '<img src="%s/emoticon-data/%s"/>' % (base_url, face)


def emoji(scale, code):
    return '<img width="%f" src="%s/emoticon-data/emoji/emoji_u%0x.svg"/>' % (round(500 * scale), base_url, code)


def iframe(size, state):
    return ('<iframe width="%dpx" height="%dpx" frameborder="0"' % (size, size)) + \
           'src="/emoticons/viewer.html?a&v=%d&a=%d&p=%d&c=%d&e=%d"></iframe>' % state


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
    out.close()

out = open("gen/index.html", "w")
out.write('<table>\n')
for face in files:
    out.write('<tr>')
    out.write('<td align="right"><a href="%s">%s</a></td>' % (details_link(face, True), image(face)))
    out.write('<td>')
    if face in resultB:
        x_opt = resultB[face]['x_opt']
        out.write(iframe(200, tuple(x_opt)))
    out.write('</td>')
    out.write('<td>')
    if face in resultA:
        x_opt = resultA[face]['x_opt']
        p = np.exp(x_opt) / np.sum(np.exp(x_opt))
        for i in range(len(p)):
            if p[i] > 0.01:
                out.write(emoji(p[i], EMOJI[i]))
    out.write('</td>')
    out.write('</tr>\n')
out.write('</table>\n')
out.close()
