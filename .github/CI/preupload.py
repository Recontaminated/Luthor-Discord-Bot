import requests
from requests.structures import CaseInsensitiveDict
from os.path import exists
import os
# NOT FOR RUNNING ON OS, ONLY FOR CI WORKFLOW
if exists(".env"):
    exit()

url = os.environ.get('API_ENDPOINT2')

headers = CaseInsensitiveDict()
headers["Authorization"] = os.environ.get('API_KEY')


resp = requests.get(url, headers=headers)


response = requests.get(resp.json()["attributes"]["url"], headers=headers)
open(".env", "wb").write(response.content)
