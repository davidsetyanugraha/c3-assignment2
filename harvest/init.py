# Run this once only to create empty DB
import requests
import json

# Database Connection Configuration
BASE_URL = 'http://172.26.38.57:5984'
USERNAME = 'admin'
PASSWORD = 'password'

# Initialize Request Session with Basic Auth
db = requests.Session()
db.auth = (USERNAME, PASSWORD)

# Create database tweets for victoria
response = db.put(BASE_URL+'/victoria')
print(response.json())
