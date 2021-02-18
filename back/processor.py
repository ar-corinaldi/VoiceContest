import os
import sys
from os import listdir
from os.path import isfile, join


onlyfiles = [f for f in listdir('unprocessed/') if isfile(join('unprocessed/', f))]

print(onlyfiles)

for f in onlyfiles:
    f_no_extension = f.split(".")[0]
    string_command = "ffmpeg -i original/{} processed/{}.mp3"
    print(string_command, "String")
    command = f"ffmpeg -i unprocessed/{f} processed/{f_no_extension}.mp3"
    print(command)
    os.system(command)
    delete_command = f"rm unprocessed/{f}"
    os.system(delete_command)