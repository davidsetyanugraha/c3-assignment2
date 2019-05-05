#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import tweepy
import couchdb

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

# read unique userid
userid = []
for item in vicview:
    if item.key not in userid:
        userid.append(item.key)

# create database for user timelines        
dbname = "usertimeline"
if dbname in couchserver:
    db = couchserver[dbname]
else:
    db = couchserver.create(dbname)
    
for uniqueid in userid:
    timelines = api.user_timeline(user_id = uniqueid, count = 200, include_rts = True)
    for tweet in timelines:
        tweet = tweet._json
        db[str(tweet['id'])] = tweet