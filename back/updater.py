import requests

try:
    r =requests.get('http://172.24.98.143:5000/update-processed')
    print(r)
    print("Voices updates and mail sent")
except:
    print("Error")