import json
import numpy as np
from results.common import EMOJI

data_in = open('gen/resultA.json', 'r')
data = json.load(data_in)
data_in.close()

faces = sorted(data.keys())
PA = 1.0 / len(faces)
N = len(EMOJI)
PB_and_A = np.zeros((N, len(faces)))
for Ai in range(len(faces)):
    x_opt = np.array(data[faces[Ai]]['x_opt'])[0:N]
    denom = np.sum(np.exp(x_opt))
    PB_and_A[:, Ai] = np.exp(x_opt)/denom * PA

for A in range(len(faces)):
    PA_inferred = 0
    for B in range(N):
        pb = PB_and_A[B, A] / np.sum(PB_and_A[0:N, A])
        if A == np.argmax(PB_and_A[B, :]):
            PA_inferred += pb
    print(faces[A], round(PA_inferred * 100, 2))

