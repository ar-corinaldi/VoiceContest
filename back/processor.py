import os
import sys
from os import listdir
from os.path import isfile, join


onlyfiles = [f for f in listdir('/home/estudiante/VoiceContest/back/unprocessed/') if isfile(join('/home/estudiante/VoiceContest/back/unprocessed/', f))]

print(onlyfiles)

for f in onlyfiles:
    f_no_extension = f.split(".")[0]
    string_command = "ffmpeg -i /home/estudiante/VoiceContest/back/original/{} /home/estudiante/VoiceContest/back/processed/{}.mp3"
    print(string_command, "String")
    command = f"ffmpeg -i /home/estudiante/VoiceContest/back/unprocessed/{f} /home/estudiante/VoiceContest/back/processed/{f_no_extension}.mp3"
    print(command)
    os.system(command)
    delete_command = f"rm /home/estudiante/VoiceContest/back/unprocessed/{f}"
    os.system(delete_command)