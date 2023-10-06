import shutil

episodes = ["1", "2", "3", "4", "scooby-1", "scooby-2"]

root = "../ccsr/"

for episode in episodes:
    path = root + episode
    print(episode)
    shutil.make_archive("public/assets/" + episode + ".ccsr", "zip", path)