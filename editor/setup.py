import shutil
import json
import zipfile

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

root = "../ccsr/"

for episode in episodes:
    path = root + episode
    out = "public/assets/" + episode + ".ccsr"
    print(episode)
    shutil.make_archive(out, "zip", path)
    with zipfile.ZipFile(out + ".zip", "a") as zip:
        zip.writestr("metadata.json", json.dumps(metadata[episode], indent=4))