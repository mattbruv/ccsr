import glob
import pathlib
from PyTexturePacker import Packer


def packImages(episodeNumber):
    images = glob.glob("../ccsr/{}/**/*.png".format(episodeNumber))
    packer = Packer.create(enable_rotated=False,
                           atlas_format="json")
    packer.pack(images, "ep{}".format(episodeNumber),
                "public/assets/{}".format(episodeNumber))


def setup():
    pathlib.Path("public/assets").mkdir(parents=True, exist_ok=True)
    for i in range(1, 5):
        pathlib.Path("public/assets/{}".format(i)
                     ).mkdir(parents=True, exist_ok=True)
        packImages(i)


setup()
