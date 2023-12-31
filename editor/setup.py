import shutil
import json
import zipfile
from PIL import Image
from pathlib import Path

episodes = ["1", "2", "3", "4", "scooby-1", "scooby-2"]

metadata = {
    "1": {
        "name": "Cartoon Cartoon Summer Resort Episode 1: Pool Problems",
        "author": "Funny Garbage",
    },
    "2": {
        "name": "Cartoon Cartoon Summer Resort Episode 2: Tennis Menace",
        "author": "Funny Garbage",
    },
    "3": {
        "name": "Cartoon Cartoon Summer Resort Episode 3: Vivian vs. the Volcano",
        "author": "Funny Garbage",
    },
    "4": {
        "name": "Cartoon Cartoon Summer Resort Episode 4: Disco Dilema",
        "author": "Funny Garbage",
    },
    "scooby-1": {
        "name": "Scooby Doo and the Hollywood Horror: Part 1",
        "author": "Funny Garbage",
    },
    "scooby-2": {
        "name": "Scooby Doo and the Hollywood Horror: Part 2",
        "author": "Funny Garbage",
    },
}

def makeWhiteTransparent(imagePath):
    img = Image.open(imagePath)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        if item[0] == 255 and item[1] == 255 and item[2] == 255:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(imagePath, "PNG")

root = "../ccsr/"

for episode in episodes:
    path = root + episode
    temp = "temp/" + episode

    shutil.copytree(path, temp)

    pngs = list(Path(temp).rglob("*.png"))
    for png in pngs:
        makeWhiteTransparent(png)

    out = "public/assets/" + episode + ".ccsr"
    print(episode)
    shutil.make_archive(out, "zip", temp)
    with zipfile.ZipFile(out + ".zip", "a") as zip:
        zip.writestr("metadata.json", json.dumps(metadata[episode], indent=4))
    
    shutil.rmtree(temp)