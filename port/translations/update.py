from email import message
import glob
import json
import hashlib


def getHash(string: str):
    return hashlib.sha256(string.encode('utf-8')).hexdigest()


langs = glob.glob("*/")

lang = langs[1]

g = str(lang) + "**/messages.json"

data = []

jsons = glob.glob(g)

for f in jsons:
    data.append({
        "file": f,
        "data": json.loads(open(f).read())
    })

replace = {}

for file in data:
    messages = file["data"]
    for key in messages:
        hash = getHash(messages[key])[:len(key)]
        if key != hash:
            replace[key] = messages[key]
            print(key, hash, messages[key])

i = 0
for file in data:
    messages = file["data"]
    for key in messages:
        if key in replace:
            data[i]["data"][key] = replace[key]
    i += 1

    open(file["file"], "w").write(json.dumps(file["data"], indent=4))
