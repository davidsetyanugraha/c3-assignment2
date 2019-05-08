#!/usr/bin/env python3

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
import time

# Listener to catch all stream from Twitter API
class MyStreamListener(tweepy.StreamListener):
    def __init__(self):
        self.last_report_time = time.time()
        self.success_insert = 0
        self.error = 0
        self.duplicate_error = 0
        super(MyStreamListener, self).__init__()

    def on_status(self, status):
        self.insertDB(status)
        if (time.time() - self.last_report_time) > 100:
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
        url = BASE_URL + '/victoria/\"' + str(status.id) + '\"'
        response = db.put(url, data)

        # Catch the error from DB response
        if (response.status_code != 201):
            print(time.strftime("%a, %d %b %Y %H:%M:%S +0000") + " Error in insertDB (" + str(response.status_code) + ") " +
                  str(response.json()) + "[" + str(status.id) + "]")
            if (response.status_code != 201):
                self.duplicate_error += 1
            else:
                self.error += 1
        else:
            self.success_insert += 1
        print(time.strftime("%a, %d %b %Y %H:%M:%S +0000") + " Insert tweet in insertDB (" + str(response.status_code) + ") " +
              str(response.json()) + "[" + str(status.id) + "]")

    def on_error(self, status_code):
        print(time.strftime("%a, %d %b %Y %H:%M:%S +0000") + " on_error message triggered (" + str(status_code) + ")",
              self)
        if status_code == 420:
            return False

    def on_limit(self, track):
        print(time.strftime("%a, %d %b %Y %H:%M:%S +0000") + " Twitter Limit reached! track:", track)
        return False


# Database Connection Configuration
BASE_URL = 'http://172.26.38.57:5984'
USERNAME = 'admin'
PASSWORD = 'password'
db = requests.Session()
db.auth = (USERNAME, PASSWORD)

# API Twitter Configuration
consumer_key = "zUbPyH4bfQ8BC8cOKHBXuFe3S"
consumer_secret = "zh4ioGw7vBWMKJ5E2pfgwcIcqUJezjIjV6UUWmCTAfSy4ki7P2"
access_token = "170182726-U9LBuNEGA1pUDX8XIQBbXjxEgK4TxuUoVTZXFWwc"
access_token_secret = "1RdmAN39YpPNRBZvv0Nfiie0LPxrhEUQHvffzDPqqxkGw"

# Tweepy Initialization
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)
myStream = tweepy.Stream(api.auth, MyStreamListener())

# Run Streaming tweet code for certain GEOBOX
GEOBOX_VICTORIA = [
    140.96190162, -39.19848673,
    150.03328204, -33.98079743,
]

# Run the Streaming
myStream.filter(locations=GEOBOX_VICTORIA)
