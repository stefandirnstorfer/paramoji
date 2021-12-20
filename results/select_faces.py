from common import base_url
import csv
import random
import numpy as np

dims = ["anger","contempt","disgust","fear","happiness","neutral","sadness","surprise"]
cur_stat = {dim : 0.0 for dim in dims}
result = []

csv_file = open("../../emoticon-data/classification.csv", "r")

reader = csv.DictReader(csv_file, delimiter=",")
data = [row for row in reader]


while len(result) < 20:
    sel = random.randint(1, len(data))
    new_stat = { dim: cur_stat[dim] + float(data[sel][dim]) for dim in dims}
    new_min = np.min([a for a in new_stat.values()])
    new_max = np.max([a for a in new_stat.values()])
    if new_max - new_min <= 1.0:
        cur_stat = new_stat
        result.append(data[sel]["file"])

print(result)
print(cur_stat)


def image(face):
    return '<img src="%s/emoticon-data/%s" width="%fpx"/>' % (base_url, face, 250)

out = open("gen/selection.html", "w")
for face in result:
    out.write(image(face))
out.close()

out = open("gen/selection.csv", "w")
out.write("file\n")
for face in result:
    out.write(face+"\n")
out.close()
