import json
import tensorflow as tf
import numpy as np
import scipy.stats
import multiprocessing as mp

all_data = json.load(open('./raw_data.json', 'r'))

data = []
check_double = set()
for entry in all_data:
    if entry['task'] == 'classify' and entry['ab'] == 'B':# and entry.get('version') != 2:
        unique_key = entry['workerId'] + entry['taskId']
        if unique_key in check_double:
            continue
        check_double.add(unique_key)
        data.extend(dict(item, worker=entry['workerId']) for item in entry['items'])

faces = sorted(set(row['file'] for row in data))


def get_vec(state):
    a = state['arousal']/100
    e = (state['expression']/50-1)/2
    a1 = round(min(1, max(0, a - e)), 2)
    a2 = round(min(1, max(0, a + e)), 2)
    return np.array([
        state['valence'] / 100.0,
        a1, a2,
        state['potency'] / 100.0,
        state['contempt'] / 100.0
    ])


def get_data(data, face, max_n=None):
    filtered_data = [
        {
            "choices": [get_vec(choice) for choice in row['choices']],
            "selected": get_vec(row['choices'][row['selected']]),
        }
        for row in data if row['file'] == face
    ]
    if max_n:
        if max_n > len(filtered_data):
            raise Exception("Out of data")
        filtered_data = filtered_data[0:max_n]
    return filtered_data


def get_mats(DATA):
    numer = np.zeros((5, 1,  len(DATA)))
    denom = np.zeros((5, 15, len(DATA)))
    for j in range(len(DATA)):
        numer[:, 0, j] = DATA[j]['selected']
        for i in range(15):
            denom[:, i, j] = DATA[j]['choices'][i]
    return tf.constant(numer), tf.constant(denom)


def loss(numer, denom, mu, sigma):
    s = tf.exp(sigma)
    #mu = 1/(1+tf.exp(-mu))
    loss1 = tf.math.exp(- tf.reduce_sum((mu - numer)**2 * s, axis= 0))
    loss2 = tf.reduce_sum(
        tf.math.exp(- tf.reduce_sum((mu - denom)**2 * s, axis=0)), axis=0)
    loss = -tf.reduce_sum(tf.math.log(tf.squeeze(loss1)) - tf.math.log(loss2))
    return loss


def fit_model(data, max_n=None):
    RESULT = np.zeros((len(faces), 2, 5))
    for f in range(len(faces)):
        face = faces[f]
        mu = tf.Variable(np.zeros((5,1,1)))
        sigma = tf.Variable(np.zeros((5,1,1)))
        DATA= get_data(data, face, max_n)
        opt = tf.keras.optimizers.Adam(learning_rate = 0.01)
        with tf.GradientTape(persistent=True) as tape:
            numer, denom = get_mats(DATA)
            L = lambda: loss(numer, denom, mu, sigma)
        print(f"{face=}: ", end="")
        for epoch in range(50):
            print(f".", end="")
            mu_old = mu.numpy()
            for iter in range(300):
                opt.minimize(L, [mu, sigma], tape=tape)
                mu.assign(tf.math.maximum(mu, 0.0))
                mu.assign(tf.math.minimum(mu, 1.0))
            dist = np.max(np.abs(mu_old - mu.numpy()))
            if dist < 0.0001:
                break
        print()
        RESULT[f,:, :] = [ np.squeeze(mu.numpy()), np.exp(-0.5 * np.squeeze(sigma.numpy())) ]
    return RESULT

results=[]
def f(max_n):
    workers = np.random.permutation(sorted(set(row['worker'] for row in data)))
    selected = { workers[i] : i < len(workers)//2 for i in range(len(workers)) }

    data1 = [row for row in data if selected[row['worker']]]
    data2 = [row for row in data if not selected[row['worker']]]
    data1 = np.random.permutation(data1)
    data2 = np.random.permutation(data2)
    Result1 = fit_model(data1, max_n)
    Result2 = fit_model(data2, max_n)

    Z = np.array([
        np.prod([scipy.stats.norm.cdf(1, Result2[i][0][j], Result2[i][1][j])  -
                 scipy.stats.norm.cdf(0, Result2[i][0][j], Result2[i][1][j]) for j in range(Result1.shape[2])])
        for i in range(Result2.shape[0])
    ])

    total = 0
    successes = 0
    y = 5
    for i in range(len(faces)):
        mu = Result1[i, 0]
        p0 = np.prod(scipy.stats.norm.pdf(mu, Result2[i, 0], Result2[i, 1])) / Z[i]
        ti = 0
        si = 0
        for j in range(100):
            decoys = np.random.choice(range(len(faces)), y, replace=True)
            ps = [ np.prod(scipy.stats.norm.pdf(mu, Result2[k, 0], Result2[k, 1])) / Z[k] for k in decoys]
            if p0 < np.max(ps):
                success = 0
            else:
                success = 1/(1+np.sum(p0 == ps))
            ti += 1
            si += success
        print(f"{i+1:2d} {faces[i]:41s}: {100 * si/ti:6.2f}")
        total += ti
        successes += si

    return successes / total


if __name__ == '__main__':
    pool = mp.Pool(processes=10)
    mp.freeze_support()
    for max_n0 in range(20, 217, 20):
        for p in pool.map(f, [max_n0] * 25):
            results.append({
                'max_n': max_n0,
                'p': p
            })
        print(results)
        print(np.mean([r['p'] for r in results]))
