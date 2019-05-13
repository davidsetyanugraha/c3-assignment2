# %%
import json
import re
import nltk
import pandas as pd
from nltk.tokenize import WordPunctTokenizer
from nltk.stem import WordNetLemmatizer
import string
import collections


# %%


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
    ###Below will not work, need to add it on top to make sense
    capital_word_count=0
    rep = 0
    for w in words:
        if w.isupper():
            capital_word_count += 1
        m = MaxRepeatingCharCount(w)
        if m > rep:
            rep = m
    features[capital_word_count] = True  # Number of All Captalized words
    #features[rep] = True #the length of maximum repeated letter, usually angry ppl repeat
    return features


tweets = []
labels = []
biggestrepeatcharcount = []
with open("Dataset for Detection of Cyber-Trolls.json") as train_file:
    # print("inline")
    for line in train_file:
        # print("read", line)
        entry = json.loads(line)
        # print("contestn")
        tweets.append(entry["content"])
        labels.append(entry["annotation"]["label"][0])
        biggestrepeatcharcount.append(MaxRepeatingCharCount(entry["content"]))  # this give indication of angry person or excited if theeeeeeeey repeat chars

# %%
print(len(tweets))
cleantweetlist = CleanTweetList(tweets)

#%%
dataset = zip(cleantweetlist, labels)
#dataset = zip(cleantweetlist+biggestrepeatcharcount, labels)
print(len(labels))
# Create new list for modeling
finalData = []
for t, l in dataset:
    finalData.append((bag_of_features(t), l))

#shuffle the data to pick training & test set
#import random
#random.shuffle(finalData)
#print(len(finalData))

#%%
#used initially for testing performance
#train_set, test_set = finalData[0:14000], finalData[14000:]

#refsets = collections.defaultdict(set)
#testsets = collections.defaultdict(set)

#nb_classifier = nltk.NaiveBayesClassifier.train(train_set)

#For testing only not to be used in final
#for i, (feats, label) in enumerate(test_set):
#    refsets[label].add(i)
#    observed = nb_classifier.classify(feats)
#    testsets[observed].add(i)

#from nltk.metrics.scores import (accuracy, precision, recall, f_measure)
#print("Accuracy:", nltk.classify.accuracy(nb_classifier, test_set))
#print('Aggressive recall:', recall(testsets['1'], refsets['1']))
#print('Non-Aggressive recall:', recall(testsets['0'], refsets['0']))

#%%
#pure bag of words
#Accuracy: 0.7440426595567405
#Aggressive recall: 0.6244700181708056
#Non-Aggressive recall: 0.890329751759911

#After adding the cap letter count
#Accuracy: 0.7382102982836194
#Aggressive recall: 0.6175863086456181
#Non-Aggressive recall: 0.8947166921898928

#%%
train_set = finalData
nb_classifier = nltk.NaiveBayesClassifier.train(train_set)

print(nb_classifier.show_most_informative_features(n=10))

# %%
test_data = bag_of_features(CleanTweetList(["This is mean"])[0])
print(test_data)
print(nb_classifier.classify(test_data))

# %%
# test with twitter
import tweepy

# Tweepy Configuration
consumer_key = "NKplhMO19jOi5KwnR3QlUJnUx"
consumer_secret = "MEQx2FmsOjbaxxm0CeE9u9OHNqQ0xIqFul30tIfkFHRCF7oy6j"
access_token = "156224585-C6LFHPJjxlVNu5QXfTnTwW2Z7Ka7ZoqDSi8ly5JV"
access_token_secret = "mQXX1pVixM3GfRYI3YVXH7f9669SUnTtaJMcyHIR2MWmE"
# %%
import time
class MyStreamListener(tweepy.StreamListener):

    def __init__(self, time_limit=60, sleep_time=60):
        self.start_time = time.time()
        self.limit = time_limit
        self.sleep_time = sleep_time
        super(MyStreamListener, self).__init__()

    def on_status(self, status):
        if (time.time() - self.start_time) < self.limit:
            #print(status)
            data = status._json
            #print("data=",type(data),type(status._json),data)
            #print("text=",data["text"])
            testdata =bag_of_features(CleanTweetList([data['text']])[0])
            print(nb_classifier.classify(testdata), "-",data['created_at'], data['user']['screen_name'],data['user']['location'],data['text'],'cleaned=',testdata)
            return True
        else:
            return False

    def on_exception(self, exc_info):
        print(exc_info)

    def on_limit(self, track):
        #Called when a limitation notice arrives
        print('Limit reached, sleeping for [%s]', self.sleep_time)
        time.sleep(self.sleep_time)
        print("Twitter Limit reached!", track)


auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth)

# Run Streaming tweet code for certain GEOBOX
GEOBOX_VICTORIA = [
    140.96190162, -39.19848673,
    150.03328204, -33.98079743,
]
myStream = tweepy.Stream(api.auth, MyStreamListener(time_limit=2000))

myStream.filter(locations=GEOBOX_VICTORIA)

#bully=api.search("angry", count=5)

