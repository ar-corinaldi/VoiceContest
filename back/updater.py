import requests

try:
    print("pre")
    r =requests.get('http://172.24.98.143/update-processed')
    print("post")
except:
    print("ERRROR FEtiDO")