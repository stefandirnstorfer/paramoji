import math
import json
import numpy as np
from results.common import groupB

M = 50
EMOJI_params = np.zeros((M-1, 5))
for i in range(5):
    EMOJI_params[:, i] = 100 * np.arange(1, M)/M
    np.random.shuffle(EMOJI_params)
EMOJI = ["EMOJI-%.0f-%.0f-%.0f-%.0f-%.0f" % tuple(EMOJI_params[i, :]) for i in range(EMOJI_params.shape[0])]


def toEMOJI(state):
    d = np.sqrt([
        (state['valence'] - EMOJI_params[i, 0])**2 +
        (state['arousal'] - EMOJI_params[i, 1])**2 +
        (state['potency'] - EMOJI_params[i, 2])**2 +
        (state['contempt'] - EMOJI_params[i, 3])**2 +
        (state['expression'] - EMOJI_params[i, 4])**2
        for i in range(EMOJI_params.shape[0])
    ])
    return np.argmin(d).item()


faces = sorted({row['file'] for row in groupB})
RESULT = {}
for face in faces:
    print(faces.index(face), face)
    DATA = [
        {
            "choices": list({toEMOJI(choice) for choice in row['choices']}),
            "selected": toEMOJI(row['choices'][row['selected']])
        }
        for row in groupB if row['file'] == face
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
    x_opt_global = x0
    v_opt_global = -1e10
    x_opt = x0
    v_old = 0
    v = np.zeros(x_opt.shape)
    for train_iter in range(1000):
        v = 0.95 * v + 0.001 * jacobi(x_opt)
        x_opt = x_opt + v

        if loss(x_opt) > v_opt_global:
            v_opt_global = loss(x_opt)
            x_opt_global = x_opt

        if train_iter % 100 == 0:
            print("Optimized", train_iter, ':',  loss(x_opt_global))
            if abs(v_opt_global - v_old) < 1e-4:
                break
            v_old = v_opt_global
    for i in range(500):
        x_opt = x_opt + 0.1 * jacobi(x_opt)

    x_opt = x_opt - np.max(x_opt)

    missing_data = list(set(range(len(EMOJI))) - set([i for item in DATA for i in item['choices']]))
    if len(missing_data) > 0:
        print("Warning: unrated emoji for ", face, ':', ' '.join(["%s" % EMOJI[d] for d in missing_data]))
        x_opt[missing_data] = -100

    RESULT[face] = {
        "x_opt": {"%s" % EMOJI[i]: round(x_opt_global[i], 4) for i in range(len(EMOJI))}
    }

with open('gen/resultB2.json', 'w') as out:
    json.dump(RESULT, out)
    out.close()
