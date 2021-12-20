from results.common import raw_data
import numpy as np
import scipy

data = [dict(item, worker=row['workerId'], group=row['ab'])
        for row in raw_data
        for item in row['items']
        if row.get("task") == "recognize"]

files = sorted(set(item['file'] for item in data))
results = {file: {"A": [], "B": []} for file in files}
full = {"A": [], "B": []}

for item in data:
    #@if item['file'] != 'img_align_celeba/000086.jpg':
        group = item['group']
        answer = item['choices'][item['selected']]['file'] == item['file']
        full[group].append(answer)
        results[item['file']][group].append(answer)

for i in range(len(files)):
    file=files[i]
    v = results[file]
    print(f"{i+1}: {file:20s}: {np.sum(v['A'])/len(v['A']):.2f} {np.sum(v['B'])/len(v['B']):.2f}")

from scipy.stats import binom
for group in ["A", "B"]:
    num = np.sum(full[group])
    denom = len(full[group])
    p= num/denom
    q1 = binom.ppf(0.05, denom, p)
    q2 = binom.ppf(0.95, denom, p)
    L = 5/(1/p-1)
    print(f"group {group}: {p:.2f} {num}/{denom} [{q1/denom:.2f}:{q2/denom:.2f}] {L=:.2f}")
