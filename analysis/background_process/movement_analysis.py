#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os
import csv
import nltk
import re
import string
import couchdb
import datetime
from datetime import datetime
from datetime import timedelta
from shapely.geometry import Polygon
from shapely.geometry import Point
from nltk.tokenize import WordPunctTokenizer
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
from nltk.tag import pos_tag
# nltk.download('punkt')
# nltk.download('averaged_perceptron_tagger')
from math import radians, sin, cos, acos   
lemmatizer = nltk.stem.wordnet.WordNetLemmatizer()
punctuation = list(set(string.punctuation))

###################################### CONFIGURATION ######################################

# Database Configuration
IP = '172.26.38.57'
BASE_URL = 'http://172.26.38.57:5984'
USERNAME = 'admin'
PASSWORD = 'password'

couchserver = couchdb.Server(BASE_URL)
couchserver = couchdb.Server("http://%s:%s@%s:5984/" % (USERNAME, PASSWORD, IP))

# grab the view from usertimeline which only contain tweet has coordinate
# this view stores tweet create time, coordinate, and tweet text
tweethist = couchserver['usertimeline_feed']
tweethistview = tweethist.view('_design/timeline/_view/view')

# database to store the output
dboutput = "dashboard_source1"

print("configuration")
###################################### READ DATABASE ######################################
            
# convert month from string to decimal
def convertmonth(month):
    if month == 'Jan':
        return '01'
    elif month == 'Feb': 
        return '02'    
    elif month == 'Mar':
        return '03'
    elif month == 'Apr':
        return '04'
    elif month == 'May':
        return '05'
    elif month == 'Jun':
        return '06'
    elif month == 'Jul': 
        return '07'
    elif month == 'Aug':
        return '08'
    elif month == 'Sep':
        return '09'
    elif month == 'Oct':
        return '10'    
    elif month == 'Nov':
        return '11'
    elif month == 'Dec':
        return '12'

# store all the value from the view to lists
userid = []
postmonth = []
postdate = []
postyear = []
posttime = []
longitude = []
latitude = []
tweet = []
for item in tweethistview:
    userid.append(item.key)
    postmonth.append(convertmonth(item.value[0].split()[1]))
    postdate.append(item.value[0].split()[2])
    postyear.append(item.value[0].split()[5])
    posttime.append(item.value[0].split()[3])
    longitude.append(item.value[1][0])
    latitude.append(item.value[1][1])
    tweet.append(item.value[2])


print("read database")
###################################### FILES NEEDED ######################################


# country bounding box file
countries = "country-boundingboxes.csv"

# geojson of victoria
geojson = "../geojson-files/LGA_GeoData.json"

# geojson of victoria streets   
# from https://data.melbourne.vic.gov.au/Property-Planning/Street-addresses/a7rp-xtya
geojson2 = '../geojson-files/street_addresses.geojson'

# tweet food hashtag
foodtag = "food_hashtag.txt"

# wrath training set
trainfile = "wrath_trainingset.json"

###################################### ALL CLASSES ######################################

class VicArea:
    def __init__(self, geojson):
        self.geojson = geojson
        self.teritories = {}
        self.centers = {}
        self.area_names = {}
        
        with open(self.geojson, encoding="utf8") as jsonfile:
            raw_grid = json.load(jsonfile)
            for teritory in raw_grid["features"]:
                k = teritory["properties"]["lga_code"]
                if k not in self.teritories:
                    self.teritories[k] = []
                self.area_names[k] = teritory["properties"]["lga_name"]
                for poly in teritory["geometry"]["coordinates"][0]:
                    polygon = Polygon(poly)
                    self.teritories[k].append(polygon)               
                self.area_names[k] = teritory["properties"]["lga_name"]
        
        for t in self.teritories:
            if len(self.teritories[t]) > 1:
                self.teritories[t].sort(key=lambda x:x.area, reverse=True)
            self.centers[t] = self.teritories[t][0].centroid        
    
    def tag(self, x, y):
        # returns empty string if location is outside the whole grids
        # returns area label in LGA format
        test_point = Point(x, y)
        tag = ""
        for ter in self.teritories:
            for t in self.teritories[ter]:
                if test_point.within(t):
                    return ter
        return tag
    
    def name(self, tag):
        try:
            return self.area_names[tag]
        except KeyError:
            return "Outside Victoria"

print("all class needed")

###################################### ADD FEATURES ######################################
#################################     TIME_RANGE                ##########################
#################################     START_COUNTRY             ##########################
#################################     END_COUNTRY               ##########################
#################################     START_CITY_CODE           ##########################
#################################     START_CITY                ##########################
#################################     END_CITY                  ##########################         
#################################     START_CLOSEST_STREETNAME  ##########################
#################################     START_CLOSEST_STREETNO    ##########################
#################################     START_DIST_FROMSTREET     ##########################
#################################     END_CLOSEST_STREETNAME    ##########################
#################################     END_CLOSEST_STREETNO      ##########################
#################################     END_DIST_FROMSTREET       ##########################
#################################     DISTANCE                  ##########################
#################################     TIME_DIFF                 ##########################
##########################################################################################    

# combine year, month, date
create = []
for i in range(len(userid)):
    create.append(postyear[i]+postmonth[i]+postdate[i])

# create time category
time_range = []
for t in posttime:
    time = int(t.split(':')[0])
    if time >= 5 and time <= 8:
        timecat = 'Early morning'
    elif time >= 9 and time <= 10:
        timecat = 'Morning'
    elif time == 11:
        timecat = 'Late Morning'
    elif time >= 12 and time <= 15:
        timecat = 'Early Afternoon'
    elif time >= 16 and time <= 17:
        timecat = 'Late Afternoon'
    elif time >= 18 and time <= 19:
        timecat = 'Early Evening'
    elif time >= 20 and time <= 21:
        timecat = 'Evening'
    else:
        timecat = 'Night'
    time_range.append(timecat)

# find the country of each point
filename = os.path.join(os.path.dirname(os.path.realpath('__file__')), countries)
country_name = []
longmin = []
latmin = []
longmax = []
latmax = []
with open(filename, "r") as txtfile:
    textfile = csv.reader(txtfile)
    next(textfile)
    for line in textfile:
        country_name.append(line[0]) 
        longmin.append(line[2])
        latmin.append(line[3])
        longmax.append(line[4])
        latmax.append(line[5])

# get the country
start_country = []
for i in range(len(longitude)):
    for j in range(len(country_name)):
        if float(longitude[i]) >= float(longmin[j]) and float(longitude[i]) <= float(longmax[j]) and \
           float(latitude[i]) >= float(latmin[j]) and float(latitude[i]) <= float(latmax[j]) :
            country = country_name[j]
            break
    start_country.append(country)

print("get country")

# get the polygon of victoria
filename = os.path.join(os.path.dirname(os.path.realpath('__file__')), geojson)
victoria = VicArea(filename)

# get the city
start_city_code = []
start_city = []
for i in range(len(longitude)):
    suburb = victoria.tag(longitude[i], latitude[i])
    start_city_code.append(suburb)
    start_city.append(victoria.name(suburb))

print("get city")

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
 
# get distance and time difference for tweet with the same user at the same day
endlon= longitude[1:]
endlon.append(longitude[-1])
endlat= latitude[1:]
endlat.append(latitude[-1])

endtime = posttime[1:]
endtime.append(posttime[-1])

distance = []
time_diff = []
end_country = []
end_city = []


FMT = '%H:%M:%S'
for i in range(len(userid)-1):
    if userid[i] == userid[i+1] and create[i] == create[i+1]:
        tdelta = datetime.strptime(endtime[i], FMT) - datetime.strptime(posttime[i], FMT)
        if tdelta.days < 0:
            tdelta = timedelta(days=0,seconds=tdelta.seconds, microseconds=tdelta.microseconds)
        delta = tdelta.seconds
        
        try:
            slon = radians(float(longitude[i]))
            slat = radians(float(latitude[i]))  
            elon = radians(float(endlon[i]))     
            elat = radians(float(endlat[i]))  
            dist = 6371.01 * acos(sin(slat)*sin(elat) + cos(slat)*cos(elat)*cos(slon - elon))           
        except:
            dist = 0
            endlon[i] = ''
            endlat[i] = ''
            
        ecnty = start_country[i+1]
        ecity = start_city[i+1]
        
    else:
        dist = ''
        delta = ''
        endlon[i] = ''
        endlat[i] = ''
        ecnty = ''
        ecity = ''
        
    distance.append(dist)
    time_diff.append(delta)
    end_country.append(ecnty)
    end_city.append(ecity)
    
distance.append('')
time_diff.append('')
end_country.append('')
end_city.append('')

print("get end areas")  

###################################### SINS DETECTION ######################################

######################################    GLUTTONY    ######################################

food_hashtag = os.path.join(os.path.dirname(os.path.realpath('__file__')), foodtag)
gluttonytag = []
with open(food_hashtag, "r") as txtfile:
    for line in txtfile:
        gluttonytag.append(line.strip())    

        
######################################     WRATH     ######################################
        
def MaxRepeatingCharCount(str):
    n = len(str)
    count = 0
    cur_count = 1

    # Traverse string except
    # last character
    for i in range(n):
        # If current character
        # matches with next
        if (i < n - 1 and str[i] == str[i + 1]):
            cur_count += 1

        # If doesn't match, update result
        # (if required) and reset count
        else:
            if cur_count > count:
                count = cur_count
            cur_count = 1
    return count

def CleanTweetList(tweetlist):
    TweetTokenList = []
    for text in tweetlist:
        text = text.translate(str.maketrans('', '', string.punctuation))
        tweetWords = WordPunctTokenizer().tokenize(text.lower())
        # remove punctuations and stop words
        english_stops = set(nltk.corpus.stopwords.words('english'))
        characters_to_remove = ["''", '``', "rt", "https", "http", "’", "“", "”", "\u200b", "--", "n't", "'s", "...",
                                "//t.c"]
        tweetWords = [tw for tw in tweetWords if tw not in english_stops]
        tweetWords = [tw for tw in tweetWords if tw not in set(characters_to_remove)]
        # lematize
        wnl = WordNetLemmatizer()
        TweetTokenList.append([wnl.lemmatize(tw) for tw in tweetWords])
    return TweetTokenList

def bag_of_features(words):
    features = dict([(word, True) for word in words])
    capital_word_count = 0
    for w in words:
        if w.isupper():
            capital_word_count += 1
    return features

def trainclassifier(trainingdatafilepath):
    tweets = []
    labels = []
    biggestrepeatcharcount = []
    with open(trainingdatafilepath) as train_file:
        # print("inline")
        for line in train_file:
            entry = json.loads(line)
            tweets.append(entry["content"])
            labels.append(entry["annotation"]["label"][0])
            biggestrepeatcharcount.append(MaxRepeatingCharCount(entry["content"]))  # this give indication of angry person or excited if theeeeeeeey repeat chars

    cleantweetlist = CleanTweetList(tweets)
    dataset = zip(cleantweetlist, labels)
    #the performance reduced when adding the reapeated letter length so removed
    #dataset = zip(cleantweetlist+biggestrepeatcharcount, labels)

    # Create new list for modeling
    finalData = []
    for t, l in dataset:
        finalData.append((bag_of_features(t), l))

    train_set = finalData
    nb_classifier = nltk.NaiveBayesClassifier.train(train_set)
    return nb_classifier

def wrathflag(text, classifier):
    features = bag_of_features(CleanTweetList([text])[0])
    if classifier.classify(features) == '1':
        return 1
    else:
        return 0



trainfilepath = os.path.join(os.path.dirname(os.path.realpath('__file__')), trainfile)

nb_classifier = trainclassifier(trainfilepath)


###################################### SLOTH & GREED #####################################

sloth = []
greed = []
for d in distance:
    if d != '':
        if d <= 3:
            sloth.append(1)
        else:
            sloth.append(0)
        if d >= 5000:
            greed.append(1)
        else:
            greed.append(0)
    else:
        sloth.append(0)
        greed.append(0)
        
print("get sloth and greed")  
        
####################################    OTHER SINS    ####################################


def check_keyword(text,keys):
    flag = 0
    for key in keys:
        if key in text.lower():
            flag = 1
    return flag  

def check_tags(tags,keys):
    flag = 0
    for tag in tags:
        if tag in keys:
            flag = 1
    return flag  

def find_tag(text):
    tags = nltk.word_tokenize(text)
    tags = nltk.pos_tag(tags)
    tag_order = []
    for tag in tags:
        tag_order.append(tag[1])
    return tag_order

def check_tag(text,taglist):
    texttag = find_tag(text)
    flag = 0
    for i in range(len(texttag)):   
        trigram = texttag[i:i+3]
        if trigram == taglist:
            flag = 1
    return flag


lust_key = ['sex','sexual','passion','sexy','intimate','lust','sensual','passionate']
envy_key = ['wish','need','want','desire']
pride_tag = ['DT', 'JJ', 'NN']

gluttony = []        
wrath = []
lust = []
envy = []
pride = []
for text in tweet:
    tags = [h.lower() for h in re.findall(r"#(\w+)", text)] 
        
    flag_gluttony = check_tags(tags,gluttonytag)
    gluttony.append(flag_gluttony)
    
    flag_wrath = wrathflag(text, nb_classifier)
    wrath.append(flag_wrath)

    flag_lust = check_keyword(text,lust_key)
    lust.append(flag_lust)    

    flag_envy = check_keyword(text,envy_key)
    envy.append(flag_envy)    
    
    flag_pride = check_tag(text,pride_tag)
    pride.append(flag_pride)   
    
print("get other sins")  

##################################### WRITE DATABASE  #####################################

db = couchserver.create(dboutput)
output = {}
for i in range(len(userid)):
    output[i] = {'userid' : userid[i], \
                   'create' : create[i], \
                   'startlon' : longitude[i], \
                   'startlat' : latitude[i], \
                   'endlon' : endlon[i], \
                   'endlat' : endlat[i], \
                   'start_country' : start_country[i], \
                   'end_country' : end_country[i], \
                   'start_city_code' : start_city_code[i], \
                   'start_city' : start_city[i], \
                   'end_city' : end_city[i], \
                   'distance' : distance[i], \
                   'time_diff' : time_diff[i], \
                   'time_range' : time_range[i], \
                   'sloth' : sloth[i], \
                   'greed' : greed[i], \
                   'gluttony' : gluttony[i], \
                   'wrath' : wrath[i], \
                   'lust' : lust[i], \
                   'envy' : envy[i], \
                   'pride' : pride[i], \
                   'tweet' : tweet[i]
                  }
    doc_id, doc_rev = db.save(output[i])
print("finish")