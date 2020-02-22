import json
import math
import urllib.request
import numpy as np
# import scipy.optimize

EMOJI = [0x1F600, 0x1F601, 0x1F602, 0x1F923, 0x1F603,
         0x1F604, 0x1F605, 0x1F606, 0x1F609, 0x1F60A,
         0x1F60B, 0x1F60E, 0x1F60D, 0x1F618, 0x1F617,
         0x1F619, 0x1F61A, 0x263A, 0x1F642, 0x1F917,
         0x1F929, 0x1F914, 0x1F928, 0x1F610, 0x1F611,
         0x1F644, 0x1F60F, 0x1F623, 0x1F625,
         0x1F62E, 0x1F910, 0x1F62F, 0x1F62A, 0x1F62B,
         0x1F634, 0x1F60C, 0x1F61B, 0x1F61C, 0x1F61D,
         0x1F924, 0x1F612, 0x1F613, 0x1F614, 0x1F615,
         0x1F911, 0x1F632, 0x2639, 0x1F641,
         0x1F616, 0x1F61E, 0x1F61F, 0x1F624, 0x1F622,
         0x1F62D, 0x1F626, 0x1F627, 0x1F628, 0x1F629,
         0x1F92F, 0x1F62C, 0x1F630, 0x1F631, 0x1F633,
         0x1F92A, 0x1F635, 0x1F621, 0x1F620,
         0x1F922, 0x1F92E]

base_url = 'http://h2615096.stratoserver.net'
campaign_id = 'd02d863f2cd2'
raw_data = json.loads(urllib.request.urlopen(base_url + '/api/work/' + campaign_id).read())

groupA = [row for row in raw_data if 'code' in row['items'][0]['choices'][0]]
groupA = [dict(item, worker=row['workerId']) for row in groupA for item in row['items']]
faces = sorted(list(set([row['file'] for row in groupA])))

RESULT = []
for face in faces:
    DATA = [
        {
            "choices": [EMOJI.index(choice['code']) for choice in row['choices']],
            "selected": EMOJI.index(row['choices'][row['selected']]['code'])
        }
        for row in groupA if row['file'] == face
    ]

    def likliness(x):
        p = 0
        for item in DATA:
            selected = item['selected']
            denom = np.sum(np.exp(x[item['choices']]))
            num = math.exp(x[selected])
            p += math.log(num / denom)
        return p


    def jacobi(x):
        pd = np.zeros((len(EMOJI)))
        for item in DATA:
            selected = item['selected']
            choices = np.zeros(x.shape)
            choices[item['choices']] = 1.0
            denom = np.sum(np.exp(x * choices))
            num = math.exp(x[selected])
            pd0 = -np.exp(x) * choices
            h = np.exp(x[selected] - x * choices)
            h[selected] = 0
            pd0[selected] = np.sum(h)
            pd += pd0 / denom / num
        return pd


    x0 = np.zeros((len(EMOJI)))
    # opt = scipy.optimize.minimize(likliness, x0, method="CG", jac=jacobi)

    x_opt = x0
    for i in range(100):
        x_opt = x_opt + 0.1 * jacobi(x_opt)
    RESULT += [{
        "face": face,
        "x_opt": x_opt
    }]

out = open("result.html", "w")
out.write('<table>\n')
for entry in RESULT:
    face = entry['face']
    x_opt = entry['x_opt']
    out.write('<tr>')
    out.write('<td align="right"><img src="%s/emoticon-data/%s"/></td>' % (base_url, face))
    out.write('<td>')
    p = np.exp(x_opt) / np.sum(np.exp(x_opt))
    print(p)
    for i in range(len(p)):
        if p[i] > 0.01:
            out.write('<img width="%f" src="%s/emoticon-data/emoji/emoji_u%0x.png"/>' %
                      (round(500*p[i]), base_url, EMOJI[i]))
    out.write('</td>')
    out.write('</tr>\n')
out.write('</table>\n')
out.close()