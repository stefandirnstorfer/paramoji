import json
import datetime
import urllib.request

base_url = 'http://h2615096.stratoserver.net'
campaign_id = 'd02d863f2cd2'

start_date = datetime.datetime.strptime("2020-01-01", "%Y-%m-%d")
# start_date = datetime.datetime.strptime("2020-02-28", "%Y-%m-%d")


raw_data = []
check_double = set()
for entry in json.loads(urllib.request.urlopen(base_url + '/api/work/' + campaign_id).read()):
    if entry['startTime'] < start_date.timestamp()*1000:
        continue
    if entry['workerId'] + entry['taskId'] not in check_double:
        check_double.add(entry['workerId'] + entry['taskId'])
        raw_data.append(entry)

# raw_data = raw_data[0:20]

groupA = [row for row in raw_data if 'code' in row['items'][0]['choices'][0]]
groupA = [dict(item, worker=row['workerId']) for row in groupA for item in row['items']]

groupB = [row for row in raw_data if 'arousal' in row['items'][0]['choices'][0]]
groupB = [dict(item, worker=row['workerId']) for row in groupB for item in row['items']]
