import numpy as np
import json
from results.common import base_url, groupA, groupB, raw_data
from results.bayesA import PA_inferred as inferredA
from results.bayesB import PA_inferred as inferredB

resultA = json.load(open('gen/resultA.json', 'r'))
resultB = json.load(open('gen/resultB.json', 'r'))

data = [
    {
        "file": key,
        "B": {
            "valence": resultB[key]["x_opt"][0],
            "arousal": resultB[key]["x_opt"][1],
            "potency": resultB[key]["x_opt"][2],
            "contempt": resultB[key]["x_opt"][3],
            "expression": resultB[key]["x_opt"][4],
        },
        "A":  {
            "code": max(resultA[key]["x_opt"].items(), key=lambda x: x[1])[0]
        }
    }
    for key in resultA.keys()
]
with open("recognition.json", "w") as file:
    json.dump(data, file)