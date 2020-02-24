import math
import numpy as np
from results.common import EMOJI, groupA


faces = sorted(set([row['file'] for row in groupA]))
RESULT = {}
for face in faces:
    DATA = [
        {
            "choices": [EMOJI.index(choice['code']) for choice in row['choices']],
            "selected": EMOJI.index(row['choices'][row['selected']]['code'])
        }
        for row in groupA if row['file'] == face
    ]

    def loss(x):
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

    x_opt = x0
    for i in range(100):
        x_opt = x_opt + 0.1 * jacobi(x_opt)

    x_opt = x_opt - np.max(x_opt)

    missing_data = list(set(range(len(EMOJI))) - set([i for item in DATA for i in item['choices']]))
    if len(missing_data) > 0:
        print("Warning: unrated emoji for ", face, ':', ' '.join(["%0x" % EMOJI[d] for d in missing_data]))
        x_opt[missing_data] = -100

    RESULT[face] = {
        "x_opt": np.round(x_opt, 4).tolist()
    }
