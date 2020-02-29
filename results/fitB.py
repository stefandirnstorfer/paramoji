import json
import math
import numpy as np
from results.common import groupB


def get_vec(state):
    return np.array([
        state['valence'],
        state['arousal'],
        state['potency'],
        state['contempt'],
        state['expression']
    ]) / 100.0


RESULT = {}
faces = sorted(list(set([row['file'] for row in groupB])))
for face in faces:
    print("face:", face)
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


    x0 = np.zeros((2, 5))
    x0[0, :] = DATA[0]['selected']

    # print("Analyic Jaccobi")
    # print(np.round(jaccobi(x0), 3))

    # print("Numeric Jaccobi")
    dnn = np.zeros(x0.shape)
    for i in range(2):
        for j in range(5):
            h = 0.001
            d = np.zeros(x0.shape)
            d[i, j] = h
            dnn[i, j] = (loss(x0 + d) - loss(x0-d))/2/h
    # print(np.round(dnn, 3))

    x_mean = np.mean(np.array([row['selected'] for row in DATA]), axis=0)
    x_opt_global = np.array([x_mean, [0.5]*5])
    v_opt_global = -1e10

    x_opt = x_opt_global
    v_old = 0
    v = np.zeros(5)
    for train_iter in range(1000):
        v = 0.95 * v + 0.001 * jaccobi(x_opt)
        x_opt = x_opt + v
        x_opt[0, :] = np.maximum(np.minimum(x_opt[0, :], 1), 0)
        v[0, x_opt[0, :] == 1] = 0
        v[0, x_opt[0, :] == 0] = 0

        if loss(x_opt) > v_opt_global:
            v_opt_global = loss(x_opt)
            x_opt_global = x_opt

        if train_iter % 100 == 0:
            print("Optimized", train_iter, ':', np.round(x_opt_global[0, :], 3), loss(x_opt_global))
            if abs(v_opt_global - v_old) < 1e-5:
                break
            v_old = v_opt_global

    RESULT[face] = {
        "x_opt": np.round(100 * x_opt_global[0, :]).astype(int).tolist(),
        "x_std": np.round(100 * np.exp(-x_opt_global[1, :]/2)).astype(int).tolist()
    }

with open('gen/resultB.json', 'w') as out:
    json.dump(RESULT, out)
