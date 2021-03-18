import requests
from dotenv import load_dotenv, find_dotenv

try:
    print("pre")
    r =requests.get(f'http://104.154.109.18/update-processed')
    print("post")
    print(r)
except:
    print("ERRROR")
