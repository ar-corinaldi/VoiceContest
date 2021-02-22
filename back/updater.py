import requests

try:
    r =requests.get('http://172.24.98.143/update-processed')
    print(r)
except:
    print("Error")