import json
import random
import csv
import tensorflow as tf
import numpy as np
import multiprocessing as mp

all_data = json.load(open('./raw_data.json', 'r'))

data = []
check_double = set()
for entry in all_data:
    unique_key = entry['workerId'] + entry['taskId']
    if unique_key in check_double:
        continue
    check_double.add(unique_key)
    if entry['task'] == 'classify' and entry['ab'] == 'A':
        data.extend(dict(item, worker=entry['workerId']) for item in entry['items'])

EMOJI = sorted({choice['code'] for row in data for choice in row['choices']})
faces = sorted(set(row['file'] for row in data))


def get_data(data, face, max_n=None):
    filtered_data = [
        {
            "choices": [EMOJI.index(choice['code']) for choice in row['choices']],
            "selected": EMOJI.index(row['choices'][row['selected']]['code'])
        }
        for row in data if row['file'] == face
    ]
    if max_n:
        if max_n > len(filtered_data):
            raise Exception("Out of data")
        filtered_data = filtered_data[0:max_n]
    return filtered_data


def loss(DATA, x):
    denom_mat = np.zeros((len(DATA),x.shape[0]))
    num_mat = np.zeros((len(DATA),x.shape[0]))
    for i in range(len(DATA)):
        denom_mat[i, DATA[i]['choices']] = 1.0
        num_mat[i, DATA[i]['selected']] = 1.0
    exp_x = tf.exp(x)
    loss = -tf.reduce_sum(
        tf.math.log(
            tf.linalg.matmul(num_mat, exp_x) /
            tf.linalg.matmul(denom_mat, exp_x)))
    return loss


def fit_model(data, max_n=None):
    RESULT = np.zeros((len(faces), len(EMOJI)))
    for f in range(len(faces)):
        face = faces[f]
        x = tf.Variable(np.zeros((len(EMOJI),1)))
        DATA= get_data(data, face, max_n)
        opt = tf.keras.optimizers.Adam(learning_rate = 0.1, epsilon=0.01)
        with tf.GradientTape(persistent=True) as tape:
            L = lambda: loss(DATA,x)
        print(f"{face=}: ", end="")
        for epoch in range(10):
            print(f".", end="")
            x_old = np.exp(x.numpy())
            for iter in range(100):
                opt.minimize(L, [x], tape=tape)
                x.assign(x - tf.math.reduce_max(x))
            dist = np.max(np.abs(x_old - np.exp(x.numpy())))/np.sum(np.exp(x_old))
            if dist < 0.0001:
                break
        print()
        x_opt = np.round(np.exp(x.numpy())/np.sum(np.exp(x.numpy())), 4)
        RESULT[f,:] = np.squeeze(x_opt)
    return RESULT


results=[]

def f(max_n):
    workers = np.random.permutation(sorted(set(row['worker'] for row in data)))
    selected = { workers[i] : i < len(workers)//2 for i in range(len(workers)) }

    data1 = [row for row in data if selected[row['worker']]]
    data2 = [row for row in data if not selected[row['worker']]]
    Result1 = fit_model(data1, max_n)
    Result2 = fit_model(data2, max_n)

    total = 0
    successes = 0
    y = 5
    for i in range(len(faces)):
        e_star = np.argmax(Result1[i])
        ti, si = 0,0
        for j in range(20):
            decoys = np.random.choice(range(len(faces)), y, replace=True)
            if Result1[i][e_star] < np.max(Result2[decoys, e_star]):
                success = 0
            else:
                coll = Result1[i][e_star] == Result2[decoys, e_star]
                success = 1/(1+np.sum(coll))
            si += success
            ti += 1
        print(f"{i+1:2d} {faces[i]:41s}: {100 * si/ti:6.2f}")
        total += ti
        successes += si

    return successes/total




if __name__ == '__main__':
    pool = mp.Pool(processes = 8)
    mp.freeze_support()
    for max_n0 in range(10, 81, 20):
        for p in pool.map(f, [max_n0] * 25):
            results.append({
                'max_n': max_n0,
                'p': p
            })
        print(results)
        print(np.mean([r['p'] for r in results]))

