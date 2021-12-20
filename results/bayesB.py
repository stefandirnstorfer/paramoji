import json
import numpy as np
from results.common import emotion_params

data_in = open('gen/resultB.json', 'r')
data = json.load(data_in)
data_in.close()

faces = sorted(data.keys())
PA = 1.0 / len(faces)

N = 10000
D = len(emotion_params)
choices = np.reshape(np.random.uniform(0, 1, D*N), (N, D))
choices[:, 3] = np.maximum(0, 2 * choices[:, 3]-1)

PB_and_A = np.zeros((N, len(faces)))
for A in range(len(faces)):
    x_opt = np.array(data[faces[A]]['x_opt']) / 100
    x_std = np.array(data[faces[A]]['x_std']) / 100
    x_opt=x_opt[0:D]
    x_std=x_std[0:D]
    denom = np.sum([np.exp(-np.sum(
                    (choices[j, :] - x_opt)**2 /(x_std)**2))
                    for j in range(choices.shape[0])])
    for B in range(N):
        num = np.exp(-np.sum((choices[B, :] - x_opt)**2 /(x_std)**2))
        PB_and_A[B, A] = num / denom * PA

PA_inferred = {}
for A in range(len(faces)):
    face = faces[A]
    PA_inferred[face] = 0
    for B in range(N):
        pb = PB_and_A[B, A] / np.sum(PB_and_A[0:N, A])
        if A == np.argmax(PB_and_A[B, :]):
            PA_inferred[face] += pb
    PA_inferred[face] = round(PA_inferred[face] * 100, 2)
    print(A+1, face, PA_inferred[face])

print(f"mean = {np.mean(list(PA_inferred.values()))}")
