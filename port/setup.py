import glob
import json
import os
import pathlib
import re
import shutil
from typing import final
from PyTexturePacker import Packer
from PIL import Image


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


"""
The purpose of this function is to be able to write

        obj.data.item.visi.inviAct
        instead of 
        obj["#data"]["#item"]["#visi"]["#inviAct"]
        
Using the keys from the original game is super verbose
bcause keys that begin with # can only be indexed as strings in the [] operator

"""


def cleanSymbols(jsonString):
    # convert "none" string to null
    jsonString = jsonString.replace('"#none"', "null")
    # convert lowercase direction key to uppercase
    # only down is lowercase for some reason in the original game
    jsonString = jsonString.replace('#d"', '#D"')
    jsonString = jsonString.replace("#", "")
    return jsonString


def packImages(episodeNumber):
    print(f"Packing images for episode {episodeNumber}")
    images = glob.glob("../ccsr/{}/**/*.png".format(episodeNumber))

    for img in images:
        out = pathlib.Path(img).name.lower()
        outPath = f"public/assets/{episodeNumber}/temp/"
        mkdir(outPath)
        finalPath = pathlib.Path(outPath + out)
        shutil.copy(img, finalPath)
        makeWhiteTransparent(finalPath)

    tempPath = f"public/assets/{episodeNumber}/temp/"
    images = glob.glob(tempPath + "*.png")

    print(f"Found {len(images)} images, packing them now.")
    packer = Packer.create(enable_rotated=False,
                           atlas_format="json")
    packer.pack(images, "ep{}".format(episodeNumber),
                "public/assets/{}".format(episodeNumber))
    shutil.rmtree(tempPath)


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
        jsonString = cleanSymbols(json.dumps(jsonData))
        parsed = json.loads(jsonString)
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
