import glob
import json
import pathlib
import re
from PyTexturePacker import Packer


def mkdir(path):
    pathlib.Path(path).mkdir(parents=True, exist_ok=True)


def parseMapDataToJson(data):
    """
        The map data is in an unusual json-like format, probably
        optimized for LingoScript. It uses square brackets [] for both
        dictionaries and 1-dimensional arrays. This function converts it
        to valid JSON so it is easier to work with.
    """
    # remove all newlines from file
    data = data.replace("\n", "")

    # replace []s with {}s
    data = data.replace('[', '{')
    data = data.replace(']', '}')

    # iterate over the map data and to convert {}s back to []s in the specific case of list
    s = ""
    depth = 0
    inList = False
    inString = False
    for i, char in enumerate(data):
        if char == ',':
            s = ""
            continue

        if char == '"':
            inString = not inString

        if inList and s == "#COND:" and not char in [' ', '{']:
            inList = False

        s += char
        if not inString:
            s = s.strip()

        if inList:
            if char == '{':
                if depth == 0:
                    data = data[:i] + '[' + data[i + 1:]
                depth += 1
            if char == '}':
                depth -= 1
                if depth == 0:
                    data = data[:i] + ']' + data[i + 1:]
                    inList = False
        else:
            if s in ["#location", "#COND", "#message"]:
                depth = 0
                inList = True

    # iterate over file again and remove all extra whitespace
    json = ""
    inString = False
    for i, char in enumerate(data):
        json += char

        if char == '"':
            inString = not inString

        if not inString:
            json = json.strip()

    # use regex to add quotes around all necessary fields (all of which happen to be prefixed with #)
    json = re.sub(r'([#]{1}\w+)', r'"\1"', json)

    return json

# Reads the given map data and separate each tile into it's own string in an array


def separateTileStrings(data):
    data = data[slice(1, -1)]  # remove bounding {} around whole file

    s = ""
    depth = 0
    tiles = []
    for char in data:
        if depth == 0 and char == ',':
            continue
        s += char
        if char == '{':
            depth += 1
        elif char == '}':
            depth -= 1
            if depth == 0:
                tiles.append(s)
                s = ""

    return tiles


# Reads each tile string in the given data and convert it to a dict using json.loads
def jsonLoadTileData(data):
    tiles = {}
    tiles["data"] = []
    info = json.loads(str(data[0]))
    tiles["roomID"] = info["#roomid"]
    tiles["roomStatus"] = info["#roomStatus"]
    data.pop(0)

    for tile in data:
        try:
            tiles["data"].append(json.loads(tile.__str__()))
        except:
            continue

    return tiles


def packImages(episodeNumber):
    print(f"Packing images for episode {episodeNumber}")
    images = glob.glob("../ccsr/{}/**/*.png".format(episodeNumber))
    print(f"Found {len(images)} images, packing them now.")
    packer = Packer.create(enable_rotated=False,
                           atlas_format="json")
    packer.pack(images, "ep{}".format(episodeNumber),
                "public/assets/{}".format(episodeNumber))


def parseMapData(episodeNumber):
    print(f"Parsing map data for episode {episodeNumber}")
    maps = glob.glob(f"../ccsr/{episodeNumber}/map.data/*.txt")
    path = f"public/assets/{episodeNumber}/"
    mkdir(path)
    globalMap = []
    for m in maps:
        print(f"Parsing map: {m}")
        data = open(m).read()
        jsonData = parseMapDataToJson(data)
        jsonData = separateTileStrings(jsonData)
        jsonData = jsonLoadTileData(jsonData)
        parsed = json.loads(json.dumps(jsonData))
        mapName = pathlib.Path(m).name.split('.')[0]
        parsed["name"] = mapName
        globalMap.append(parsed)

    print(f"Parsed {len(globalMap)} maps for episode {episodeNumber}")

    open(f"{path}map{episodeNumber}.json",
         "w").write(json.dumps(globalMap))


def setup():
    pathlib.Path("public/assets").mkdir(parents=True, exist_ok=True)
    for i in range(1, 5):
        pathlib.Path("public/assets/{}".format(i)
                     ).mkdir(parents=True, exist_ok=True)
        parseMapData(i)
        packImages(i)


setup()
