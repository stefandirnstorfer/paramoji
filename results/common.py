import json
import datetime
import csv
import urllib.request

base_url = 'http://localhost'
campaign_id = '0e33b20003d8'

start_date = datetime.datetime.strptime("2020-01-01", "%Y-%m-%d")

with open("gen/selection.csv","r") as file:
    selected_faces = [row['file'] for row in csv.DictReader(file)]
selected_faces.sort()

#crowd_data = json.loads(urllib.request.urlopen(base_url + '/api/work/' + campaign_id).read())
crowd_data = json.load(open('./raw_data.json', 'r'))


raw_data = []
check_double = set()
for entry in crowd_data:
    if entry['startTime'] < start_date.timestamp()*1000:
        continue
    if entry['workerId'] + entry['taskId'] not in check_double:
        check_double.add(entry['workerId'] + entry['taskId'])
        raw_data.append(entry)

