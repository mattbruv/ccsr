from base64 import encode
import glob
import json
import base64
import hashlib
from pathlib import Path
from socketserver import DatagramRequestHandler

files = glob.glob("translate-objects/en/map*.json")


def object_id(obj):
    print(obj)
    id = f"{obj['member']}-{obj['type']}-{obj['location']}-{obj['width']}-{obj['height']}-{obj['WSHIFT']}-{obj['HSHIFT']}"
    return id

def createMapping(path):

    p = Path(path)
    objects = json.loads(open(p).read())

    for obj in objects:
        id = object_id(obj)
        obj["id"] = id
    
    open(p, "w+").write(json.dumps(objects, indent=4))




for f in files:
    createMapping(f)
