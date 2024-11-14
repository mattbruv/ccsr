import glob
import json
import hashlib
import codecs


def getHash(string: str):
    return hashlib.sha256(string.encode('utf-8')).hexdigest()


g = "**/es/messages.json"

data = []

jsons = glob.glob(g)

for f in jsons:
    data.append({
        "file": f,
        "data": json.loads(codecs.open(f, "r", "utf-8").read())
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

    codecs.open(file["file"], "w",
                "utf-8").write(json.dumps(file["data"], indent=4, ensure_ascii=False))
