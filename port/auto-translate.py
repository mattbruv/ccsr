import json

en = json.loads(open("translate-objects/en/map4.json").read())
pt = json.loads(open("translate-objects/pt/map4.json").read())

print(len(en))
print(len(pt))

mapped = {}

for obj in en:
    for m in obj["data"]["message"]:
        mapped[m["hash"]] = m['text']

mapped = {k: v for k, v in sorted(
    mapped.items(), key=lambda item: item[1])}


for obj in pt:
    eng = [x for x in en if x["id"] == obj["id"]]
    if len(eng) == 0:
        continue


    i = 0
    for msg in obj["data"]["message"]:
        english = eng[0]["data"]["message"][i]
        id = english["hash"]
        text = msg["text"]
        if len(eng) > 1:
            text = obj["id"]
        mapped[id] = text
        #print(msg, id)
        i += 1

open("messages.json", "w").write(json.dumps(mapped, ensure_ascii=False, indent=4))

things = set()

for obj in pt:
    eng = [x for x in en if x["id"] == obj["id"]]
    if len(eng) > 1:
        for thing in eng:
            msgs = thing["data"]["message"]
            for m in msgs:
                things.add((thing["id"], m["text"]))

    msgs = obj["data"]["message"]
    for m in msgs:
        things.add((obj["id"], m["text"]))

for entry in sorted(list(things)):
    print(entry)