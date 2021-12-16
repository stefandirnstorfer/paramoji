import numpy as np
import json
from results.common import base_url, emotion_params, raw_data

resultA = json.load(open('gen/resultA.json', 'r'))
resultB = json.load(open('gen/resultB.json', 'r'))

data = [
    {
        "file": key,
        "B": {
            emotion_params[i]: resultB[key]["x_opt"][i]
            for i in range(len(emotion_params))
        },
        "A":  {
            "code": max(resultA[key]["x_opt"].items(), key=lambda x: x[1])[0]
        }
    }
    for key in resultA.keys()
]
with open("recognition.json", "w") as file:
    json.dump(data, file)