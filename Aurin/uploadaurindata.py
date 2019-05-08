
import json
import string
import couchdb



# Database Configuration
COUCH_IP = '172.26.38.57'
BASE_URL = 'http://172.26.38.57:5984' #to be dynamically set
USERNAME = 'admin'
PASSWORD = 'password'
#couch = couchdb.Server(BASE_URL)
couch = couchdb.Server("http://%s:%s@%s:5984/" % (USERNAME, PASSWORD, COUCH_IP))

dbname = 'lga_vic_crime_stats_2008_2017'

if dbname in couch:
    db = couch[dbname]
else:
    db = couch.create(dbname)

filepath = "/Volumes/GoogleDrive/My Drive/UniMelb/Semester_1_2019/COMP90024_CCC/Assignment/Assignment2/c3-assignment2/"
filepath += "Aurin/dataset/LGA_Number_of_Offences_in_Victoria_by_Offence_Type_2008_-_2017/data6044373292158139311.json"

with open(filepath, "r") as read_file:
    data = json.load(read_file)
    for doc in data["features"]:
        if id in doc["properties"].keys():
            doc["properties"].pop("id")
        doc.update(doc["properties"])
        doc.pop("properties")
        db[doc["id"]] = doc