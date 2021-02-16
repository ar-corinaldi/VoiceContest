from celery import Celery
import os
import sys


app = Celery( 'processor' , broker = 'redis://localhost:6379/0' )


# Creamos una tarea llamada sumar_numeros usando el decorador @app.task

# Se imprime un mensaje con la fecha simulando un LOG

@app.task

def process_audio():

    print("empecé")
    try:
        command= f"ffmpeg -i original/all-my-life.wav processed/all-my-life.mp3"
        os.system(command)
    except:
        print("error?")
    print("terminé")

process_audio()









