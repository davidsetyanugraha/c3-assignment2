#!/usr/bin/env python3

# Title: The Seven Deadly Sins in Social Media Case Study in Victoria Cities
# Team Name: Team 14
# Team Members:
#   Dading Zainal Gusti (1001261)
#   David Setyanugraha (867585)
#   Ghawady Ehmaid (983899)
#   Indah Permatasari (929578)
#   Try Ajitiono (990633)

# Tips:
# We can run this harvest.py in the background, use this command:
# nohup python3 ./harvest.py &
# To save output to file, use this command:
# nohup python3 ./harvest.py &> harvestlog.log &
#
# Notes: Don't forget add '&' in the end of command to make sure it run in background
# To check background process
# ps aux | grep harvest.py

import tweepy
import requests
import json
import time, os
from queue import Queue
from threading import Thread

# Listener to catch all stream from Twitter API
class MyStreamListener(tweepy.StreamListener):
    def __init__(self, q = Queue()):
        self.last_report_time = time.time()
        self.success_insert = 0
        self.error = 0
        self.duplicate_error = 0
        # Below added to resolve the "Connection broken: IncompleteRead" exception that kept occuring from time to time
        # based on online search disconnect could be due to network issues or a client reading too slowly, to avoid
        # the slow processing/not keeping up with the stream following the suggested answer in below thread
        # https://stackoverflow.com/questions/48034725/tweepy-connection-broken-incompleteread-best-way-to-handle-exception-or-can
        self.q = q
        super(MyStreamListener, self).__init__()
        for i in range(4):
            t = Thread(target=self.process_q)
            t.daemon = True
            t.start()

    def process_q(self):
        while True:
            self.q.get()
            self.q.task_done()


    def on_status(self, status):
        self.insertDB(status)
        if (time.time() - self.last_report_time) > 600:
            print(time.strftime("%a, %d %b %Y %H:%M:%S +0000")+" Statistics from last report time: "
                  + str(self.success_insert)+" Tweets Added, "+str(self.duplicate_error)+" Reject Duplicate, "
                  + str(self.error)+" Rejected due to error.")
            # Resit counters
            self.last_report_time = time.time()
            self.success_insert = 0
            self.error = 0
            self.duplicate_error = 0

    def insertDB(self, status):
        data = json.dumps(status._json)

        # Insert Document to Tweets database
        url = BASE_URL + '/'+DATABASENAME+'/\"' + str(status.id) + '\"'
        response = db.put(url, data)

        # Catch the error from DB response
        if (response.status_code != 201):
            print(time.strftime("%a, %d %b %Y %H:%M:%S +0000") + " Error in insertDB (" + str(response.status_code) + ") " +
                  str(response.json()) + "[" + str(status.id) + "]")
            if (response.status_code == 409):
                self.duplicate_error += 1
            else:
                self.error += 1
        else:
            self.success_insert += 1
        #print(time.strftime("%a, %d %b %Y %H:%M:%S +0000") + " Insert tweet in insertDB (" + str(response.status_code) + ") " +
        #      str(response.json()) + "[" + str(status.id) + "]")

    def on_error(self, status_code):
        print(time.strftime("%a, %d %b %Y %H:%M:%S +0000") + " on_error message triggered (" + str(status_code) + ")",
              self)
        if status_code == 420:
            return False

    def on_limit(self, track):
        print(time.strftime("%a, %d %b %Y %H:%M:%S +0000") + " Twitter Limit reached! track:", track)
        return False


# read absulte path as required in ansible
harvestconfigfilepath = os.path.join(os.path.dirname(os.path.realpath(__file__)), "harvestconfig.json")

with open(harvestconfigfilepath, "r") as read_file:
    harvestconfig = json.load(read_file)

# Database Connection Configuration
#BASE_URL = 'http://172.26.38.57:5984'
BASE_URL = harvestconfig["couchdb"]["baseurl"]
USERNAME = harvestconfig["couchdb"]["user"]
PASSWORD = harvestconfig["couchdb"]["password"]
DATABASENAME = harvestconfig["couchdb"]["databasename"]
db = requests.Session()
db.auth = (USERNAME, PASSWORD)

# API Twitter Configuration
consumer_key = harvestconfig["twitterapi"]["consumer_key"]
consumer_secret = harvestconfig["twitterapi"]["consumer_secret"]
access_token = harvestconfig["twitterapi"]["access_token"]
access_token_secret = harvestconfig["twitterapi"]["access_token_secret"]

# Tweepy Initialization
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)
myStream = tweepy.Stream(api.auth, MyStreamListener())

# Run Streaming tweet code for certain GEOBOX
GEOBOX = harvestconfig["twitterapi"]["geobox_coordinates"]
#[
#    140.96190162, -39.19848673,
#    150.03328204, -33.98079743,
#]

# Run the Streaming continuously and reattempt incase of exception
while True:
    try:
        myStream.filter(locations=GEOBOX)
    except Exception as ex:
        print(time.strftime("%a, %d %b %Y %H:%M:%S +0000") + " Exception in stream filter, retrying")
        print(ex)
        #there will be some missing tweets between recornnect, but this is not critical for this implementation
        time.sleep(100)
        continue
