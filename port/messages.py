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

    objects = []

    p = Path(path)
    data = json.loads(open(p).read())
    for d in data:
        mapData = d["data"]
        for obj in mapData:
            if not "data" in obj:
                continue
            msg = obj["data"]["message"]
            if msg:
                objects.append(obj)
    
    # loop through all objects and give them a hash before saving the file
    for obj in objects:
        msgs = obj["data"]["message"]
        for m in msgs:
            text = m["text"]
            h = getHash(text)[:4]
            m["hash"] = h
    
    name = path.split("/")[-1]
    print(name)
    open(name, "w+").write(json.dumps(objects, ensure_ascii=False, indent=4))





for f in files:
    genTranslationFile(f)
