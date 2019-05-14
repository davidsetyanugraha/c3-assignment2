# Title: The Seven Deadly Sins in Social Media Case Study in Victoria Cities
# Team Name: Team 14
# Team Members:
#   Dading Zainal Gusti (1001261)
#   David Setyanugraha (867585)
#   Ghawady Ehmaid (983899)
#   Indah Permatasari (929578)
#   Try Ajitiono (990633)

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
