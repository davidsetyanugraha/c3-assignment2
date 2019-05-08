#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import tweepy
import couchdb
import time

def mprint(msg):
    print(time.strftime("%a, %d %b %Y %H:%M:%S +0000") + " " + msg)

# Database Configuration
IP = '172.26.38.57'
BASE_URL = 'http://172.26.38.57:5984'
USERNAME = 'admin'
PASSWORD = 'password'

couchserver = couchdb.Server(BASE_URL)
couchserver = couchdb.Server("http://%s:%s@%s:5984/" % (USERNAME, PASSWORD, IP))

# API Twitter Configuration
consumer_key = "zUbPyH4bfQ8BC8cOKHBXuFe3S"
consumer_secret = "zh4ioGw7vBWMKJ5E2pfgwcIcqUJezjIjV6UUWmCTAfSy4ki7P2"
access_token = "170182726-U9LBuNEGA1pUDX8XIQBbXjxEgK4TxuUoVTZXFWwc"
access_token_secret = "1RdmAN39YpPNRBZvv0Nfiie0LPxrhEUQHvffzDPqqxkGw"

# Tweepy Initialization
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)

# read victoria view
vic = couchserver['victoria']
vicview = vic.view('_design/uniqueUserWithCoords/_view/uniqueUserWithCoordsDoc')
vicviewchanges = vic.changes(include_docs=True, filter="_view", view="uniqueUserWithCoords/uniqueUserWithCoordsDoc")


# create database for user timelines
dbname = "usertimeline_feed"
if dbname in couchserver:
    db = couchserver[dbname]
else:
    db = couchserver.create(dbname)


mprint("Initial data fetch...")
#store the userid of already fetched timelines
processeduserid = []
while True:
    lastvicviewseq = vicviewchanges["last_seq"]
    mprint("Changed data fetched... lastvicviewseq " + lastvicviewseq)

    # read unique userid
    userid = []
    for item in vicviewchanges["results"]:
        usr = item["doc"]["user"]["id"]
        if usr not in userid+processeduserid:
            userid.append(usr)

    #for item in vicview:
    #    if item.key not in userid:
    #        userid.append(item.key)

    
    for uniqueid in userid:
        timelines = api.user_timeline(user_id=uniqueid, count=200, include_rts=True)

        #used Cursor to fetch more data 3200 supported by twitter
        for tweet in tweepy.Cursor(api.user_timeline, user_id=uniqueid, include_rts=True, tweet_mode="extended").items():
        #    print(status.full_text)
        #for tweet in timelines:
            tweet = tweet._json
            if str(tweet['id']) not in db:  # check to avoid duplicates
                #this extra key swap done because noticed this API replace "text" with "full_text" so changed the lable to match other interfaces
                if "text" not in tweet.keys():
                    tweet["text"] = tweet["full_text"]
                    tweet.pop("full_text")
                db[str(tweet['id'])] = tweet
        # Add user to already processed list
        processeduserid.append(uniqueid)
        time.sleep(100)  # Sleep for 100 seconds, may increase if needed to avoid twitter block

    mprint("Done with processing vicviewchanges... lastvicviewseq "+lastvicviewseq +
           ", number of unique userid timeline fetched "+len(userid) +
           " ... Fetching next changes.")
    vicviewchanges = vic.changes(since=lastvicviewseq, include_docs=True, filter="_view",
                                 view="uniqueUserWithCoords/uniqueUserWithCoordsDoc")

    mprint("Next changes received... Processing")
    time.sleep(200)
