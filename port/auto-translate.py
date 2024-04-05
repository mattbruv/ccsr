import json

en = json.loads(open("translate-objects/en/map1.json").read())
pt = json.loads(open("translate-objects/pt/map1.json").read())

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
        mapped[id] = text
        print(msg, id)
        i += 1

open("auto_out.json", "w").write(json.dumps(mapped, ensure_ascii=False, indent=4))

