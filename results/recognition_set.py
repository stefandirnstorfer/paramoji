import numpy as np
import json
from common import selected_faces

resultA = json.load(open('gen/resultA.json', 'r'))
resultB = json.load(open('gen/resultB.json', 'r'))

data = []
for key in selected_faces:
    a1 = resultB[key]["x_opt"][1] * 100
    a2 = resultB[key]["x_opt"][2] * 100
    data.append({
        "file": key,
        "B": {
            "valence": round(100 * resultB[key]["x_opt"][0]),
            "arousal": round((a1+a2)/2),
            "potency": round(100 * resultB[key]["x_opt"][3]),
            "contempt": round(100 * resultB[key]["x_opt"][4]),
            "expression": round((a2-a1)/2 + 50)
        },
        "A":  {
            "code": max(resultA[key]["x_opt"].items(), key=lambda x: x[1])[0]
        }
    })

with open("gen/recognition.json", "w") as file:
    json.dump(data, file, indent=2)