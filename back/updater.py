import requests

try:
    print("pre")
    r =requests.get('http://172.24.98.143/update-processed')
    print("post")
    print(r)
except:
    print("ERRROR")