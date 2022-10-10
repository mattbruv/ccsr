from base64 import encode
import glob
import json
import base64
import hashlib
from pathlib import Path
from socketserver import DatagramRequestHandler

files = glob.glob("public/assets/**/map*.json")


def getHash(string: str):
    return hashlib.sha256(string.encode('utf-8')).hexdigest()


def genTranslationFile(path):

    strings = []

    messages = []

    p = Path(path)
    data = json.loads(open(p).read())
    for d in data:
        mapData = d["data"]
        for obj in mapData:
            msg = obj["data"]["message"]
            if msg:
                for m in msg:
                    messages.append(m["text"])

    messages = list(set(messages))

    translate = {}

    for i in range(15, 0, -1):
        hashset = set(map(lambda x: getHash(x)[:i], messages))
        if len(hashset) != len(messages):
            break
        translate = {}
        for m in messages:
            translate[getHash(m)[:i]] = m

    for d in translate:
        print(d, translate[d])
    open(p.name, "w").write(json.dumps(translate, indent=4))


for f in files:
    genTranslationFile(f)
    break
