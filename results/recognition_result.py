from results.common import raw_data
import numpy as np

data = [dict(item, worker=row['workerId'], group=row['ab'])
        for row in raw_data
        for item in row['items']
        if "ab" in row]

files = sorted(set(item['file'] for item in data))
results = {file: {"A": [], "B": []} for file in files}
full = {"A": [], "B": []}

for item in data:
    if item['file'] != 'img_align_celeba/000086.jpg':
        group = item['group']
        answer = item['choices'][item['selected']]['file'] == item['file']
        full[group].append(answer)
        results[item['file']][group].append(answer)

for file in files:
    v = results[file]
    print(f"{file:20s}: {np.sum(v['A'])/len(v['A']):.2f} {np.sum(v['B'])/len(v['B']):.2f}")

for group in ["A", "B"]:
    num = np.sum(full[group])
    denom = len(full[group])
    print(f"group {group}: {num/denom:.2f} {num}/{denom}")