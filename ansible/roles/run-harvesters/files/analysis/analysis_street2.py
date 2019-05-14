#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
import couchdb
import requests
 
from math import radians, sin, cos, acos   


###################################### CONFIGURATION ######################################

# Database Configuration
IP = '172.26.38.57'
BASE_URL = 'http://172.26.38.57:5984'
USERNAME = 'admin'
PASSWORD = 'password'
db = requests.Session()
db.auth = (USERNAME, PASSWORD)

couchserver = couchdb.Server(BASE_URL)
couchserver = couchdb.Server("http://%s:%s@%s:5984/" % (USERNAME, PASSWORD, IP))

# grab the view from usertimeline which only contain tweet has coordinate
# this view stores tweet create time, coordinate, and tweet text
# tweethist = couchserver['usertimeline_feed']
# tweethistview = tweethist.view('_design/timeline/_view/view')

url = BASE_URL + '/analysis_extended/_design/summary/_view/inside_victoria?group=true'
response = db.get(url)

data = response.json()

# database to store the output
dboutput = "analysis_street"

print("configuration")


startlon = []
startlat = []
endlon = []
endlat = []
start_city = []
end_city = []
count = []
for rec in data['rows']:
    values = rec['key']
    startlon.append(values[0])
    startlat.append(values[1])
    endlon.append(values[2])
    endlat.append(values[3])
    start_city.append(values[4])
    end_city.append(values[5])
    count.append(rec['value'])

print(len(startlon))


# geojson of victoria streets   
geojson2 = 'street_addresses.geojson'

# read the geojson of Victoria Street
filename2 = os.path.join(os.path.dirname(os.path.realpath('__file__')), geojson2)
suburb_id = []
suburb_name = []
street_id = []
street_no = []
street_name = []
street_lat = []
street_lon = []
point_coor = []
with open(filename2, encoding="utf8") as jsonfile:
    raw_grid = json.load(jsonfile)
    for teritory in raw_grid["features"]:
        suburb_id.append(teritory["properties"]["suburb_id"])
        suburb_name.append(teritory["properties"]["suburb"])
        street_id.append(teritory["properties"]["street_id"])
        street_no.append(teritory["properties"]["street_no"])
        street_name.append(teritory["properties"]["str_name"])
        street_lat.append(teritory["properties"]["latitude"])
        street_lon.append(teritory["properties"]["longitude"])
        point_coor.append(teritory["geometry"]['coordinates'])

print(len(suburb_id))        
        
# get the closest_street
start_closest_streetname = []
start_closest_streetno = []
start_dist_fromstreet = []

for i in range(len(startlon)):
    if start_city[i] != 'Outside Victoria':
        mindist = 1000000000
        index = ''
        for j in range(len(street_lon)):
            slon = radians(float(street_lon[j]))
            slat = radians(float(street_lat[j]))  
            elon = radians(float(startlon[i]))     
            elat = radians(float(startlat[i]))  
            dist = 6371.01 * acos(sin(slat)*sin(elat) + cos(slat)*cos(elat)*cos(slon - elon))
            if dist < mindist:
                mindist = dist
                index = j    
        if index != '':
            start_closest_streetname.append(street_name[index])
            start_closest_streetno.append(street_no[index])
            start_dist_fromstreet.append(mindist)
        else:
            start_closest_streetname.append('')
            start_closest_streetno.append('')
            start_dist_fromstreet.append('')
    else:
        start_closest_streetname.append('')
        start_closest_streetno.append('')
        start_dist_fromstreet.append('')    
        
print(len(start_closest_streetname))



db = couchserver.create(dboutput)
output = {}
for i in range(len(start_city)):
    output[i] = {'start_city' : start_city[i], \
                   'end_city' : end_city[i], \
                   'start_closest_streetname' : start_closest_streetname[i], \
                   'start_closest_streetno' : start_closest_streetno[i], \
                   'start_dist_fromstreet' : start_dist_fromstreet[i], \
                   'count' : count[i]
                  }
    doc_id, doc_rev = db.save(output[i])
    
print("finish")
    
    