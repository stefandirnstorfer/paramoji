import json
import numpy as np
from results.common import EMOJI

data_in = open('gen/resultB.json', 'r')
data = json.load(data_in)
data_in.close()

faces = sorted(data.keys())
PA = 1.0 / len(faces)

N = 10000
choices = np.reshape(np.random.uniform(0, 1, 5*N), (N, 5))
choices[:, 3] = np.maximum(0, 2 * choices[:, 3]-1)

PB_and_A = np.zeros((N, len(faces)))
for A in range(len(faces)):
    x_opt = np.array(data[faces[A]]['x_opt']) / 100
    x_std = -2 * np.log(np.array(data[faces[A]]['x_std']) / 100)
    denom = np.sum([np.exp(-np.sum(
                    (choices[j, :] - x_opt)**2 * np.exp(x_std)))
                    for j in range(choices.shape[0])])
    for B in range(N):
        num = np.exp(-np.sum((choices[B, :] - x_opt)**2 * np.exp(x_std)))
        PB_and_A[B, A] = num / denom * PA

for A in range(len(faces)):
    PA_inferred = 0
    for B in range(N):
        pb = PB_and_A[B, A] / np.sum(PB_and_A[0:N, A])
        if A == np.argmax(PB_and_A[B, :]):
            PA_inferred += pb
    print(faces[A], round(PA_inferred * 100, 2))

