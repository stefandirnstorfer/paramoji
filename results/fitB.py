import json
import math
import numpy as np
import random
from results.common import raw_data, selected_faces

groupB = [row for row in raw_data if row.get('ab') == 'B' and row.get('task') == 'classify']
groupB = groupB[:50]
groupB = [dict(item, worker=row['workerId']) for row in groupB for item in row['items']]


def get_vec(state):
    a = state['arousal']/100
    e = (state['expression']/50-1)/2
    a1 = min(1, max(0, a - e))
    a2 = min(1, max(0, a + e))
    return np.array([
        state['valence'] / 100.0,
        a1, a2,
        state['potency'] / 100.0,
        state['contempt'] / 100.0
    ])

D = 5

RESULT = {}
for face in selected_faces:
    print("%d/%d: %s" % (selected_faces.index(face)+1, len(selected_faces), face))
    DATA = [
        {
            "choices": [get_vec(choice) for choice in row['choices']],
            "selected": get_vec(row['choices'][row['selected']]),
        }
        for row in groupB if row['file'] == face
    ]

    def loss(x):
        p = 0
        for item in DATA:
            selected = item['selected']
            denom = np.sum([np.exp(-np.sum(
                    (choice - x[0, :])**2 * np.exp(x[1, :])))
                    for choice in item['choices']])
            num = np.exp(-np.sum((selected - x[0, :])**2 * np.exp(x[1, :])))
            p += math.log(num / denom)
        return p


    def jaccobi(x):
        dp = np.zeros(x.shape)
        for item in DATA:
            selected = item['selected']
            x0 = x[0, :]
            x1 = x[1, :]
            denom = np.sum([np.exp(-np.sum((choice - x0)**2 * np.exp(x1))) for choice in item['choices']])
            num = np.exp(-np.sum((selected - x0)**2 * np.exp(x1)))
            dnum = num * np.array([2*(selected - x0)*np.exp(x1), -(selected - x0)**2*np.exp(x1)])
            ddnom = np.zeros(x.shape)
            for choice in item['choices']:
                ddnom += np.exp(-np.sum((choice - x0)**2 * np.exp(x1))) *\
                         np.array([2*(choice - x0)*np.exp(x1), -(choice - x0)**2*np.exp(x1)])
            dp += (dnum * denom - num * ddnom) / denom / num
        return dp


    x0 = np.zeros((2, D))
    x0[0, :] = DATA[0]['selected']

    # print("Analyic Jaccobi")
    # print(np.round(jaccobi(x0), 3))

    # print("Numeric Jaccobi")
    dnn = np.zeros(x0.shape)
    for i in range(2):
        for j in range(D):
            h = 0.001
            d = np.zeros(x0.shape)
            d[i, j] = h
            dnn[i, j] = (loss(x0 + d) - loss(x0-d))/2/h
    # print(np.round(dnn, 3))

    x_mean = np.mean(np.array([row['selected'] for row in DATA]), axis=0)
    x_opt_global = np.array([x_mean, [0.5]*D])
    v_opt_global = -1e10
    v_old = 0
    x_opt = x_opt_global
    v = np.zeros(x_opt.shape)
    for train_iter in range(1000):
        v = 0.95 * v + 0.002 * jaccobi(x_opt)
        x_opt = x_opt + v
        x_opt[0, :] = np.maximum(np.minimum(x_opt[0, :], 1), 0)
        v[0, x_opt[0, :] == 1] = 0
        v[0, x_opt[0, :] == 0] = 0

        if loss(x_opt) > v_opt_global:
            v_opt_global = loss(x_opt)
            x_opt_global = x_opt

        if train_iter % 100 == 0:
            print("Optimized", train_iter, ':', np.round(x_opt_global[0, :], 3), loss(x_opt_global))
            if abs(v_opt_global - v_old) < 1e-4:
                break
            v_old = v_opt_global

    RESULT[face] = {
        "x_opt": x_opt_global[0, :].tolist(),
        "x_std": np.exp(-x_opt_global[1, :]/2).tolist(),
        "n": len(DATA)
    }

with open('gen/resultB.json', 'w') as out:
    json.dump(RESULT, out)
