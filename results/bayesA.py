import json
import numpy as np


data_in = open('gen/resultA.json', 'r')
data = json.load(data_in)
data_in.close()

faces = sorted(data.keys())
EMOJI = sorted({emoji for entry in data.values() for emoji in entry['x_opt'].keys()})
print(EMOJI)
PA = 1.0 / len(faces)
N = len(EMOJI)
PB_and_A = np.zeros((N, len(faces)))
for Ai in range(len(faces)):
    x_opt = np.array([data[faces[Ai]]['x_opt'][i] for i in EMOJI])
    denom = np.sum(np.exp(x_opt))
    PB_and_A[:, Ai] = [1 if i == np.argmax(x_opt) else 0 for i in range(x_opt.shape[0])]

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
print('---')
print(np.mean(list(PA_inferred.values())))
