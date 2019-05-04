#!/usr/bin/env python3

# Tips:
# We can run this harvest.py in the background, use this command:
# nohup python3 ./harvest.py &
#
# Notes: Don't forget add '&' in the end of command to make sure it run in background
# To check background process
# ps aux | grep harvest.py

import tweepy
import requests
import json


# Listener to catch all stream from Twitter API
class MyStreamListener(tweepy.StreamListener):

    def on_status(self, status):
        self.insertDB(status)

    def insertDB(self, status):
        data = json.dumps(status._json)

        # Insert Document to Tweets database
        url = BASE_URL+'/victoria/' + str(status.id)
        response = db.put(url, data)

        # Catch the error from DB response
        if (response.status_code != 201):
            print("(" + str(response.status_code) + ") " +
                  str(response.json()) + "[" + str(status.id)+"]")

    def on_error(self, status_code):
        if status_code == 420:
            return False


# Database Connection Configuration
BASE_URL = 'http://172.26.38.57:5984'
USERNAME = 'admin'
PASSWORD = 'password'
db = requests.Session()
db.auth = (USERNAME, PASSWORD)

# API Twitter Configuration
consumer_key = "NKplhMO19jOi5KwnR3QlUJnUx"
consumer_secret = "MEQx2FmsOjbaxxm0CeE9u9OHNqQ0xIqFul30tIfkFHRCF7oy6j"
access_token = "156224585-C6LFHPJjxlVNu5QXfTnTwW2Z7Ka7ZoqDSi8ly5JV"
access_token_secret = "mQXX1pVixM3GfRYI3YVXH7f9669SUnTtaJMcyHIR2MWmE"

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
