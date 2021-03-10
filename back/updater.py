import requests

try:
    print("pre")
    r =requests.get('http://18.223.156.195/update-processed')
    print("post")
    print(r)
except:
    print("ERRROR")