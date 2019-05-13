# %%
import json
import re
import nltk
import pandas as pd
from nltk.tokenize import WordPunctTokenizer
from nltk.stem import WordNetLemmatizer
import string
import couchdb


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
    #features[capital_word_count] = True  # Number of All Captalized words
    #features[rep] = True #the length of maximum repeated letter, usually angry ppl repeat
    return features


tweets = []
labels = []
biggestrepeatcharcount = []
trainingdatafilepath = "/Volumes/GoogleDrive/My Drive/UniMelb/Semester_1_2019/COMP90024_CCC/Assignment/Assignment2/c3-assignment2/analysis/wrath_analysis/Dataset for Detection of Cyber-Trolls.json"
with open(trainingdatafilepath) as train_file:
    # print("inline")
    for line in train_file:
        # print("read", line)
        entry = json.loads(line)
        # print("contestn")
        tweets.append(entry["content"])
        labels.append(entry["annotation"]["label"][0])
        biggestrepeatcharcount.append(MaxRepeatingCharCount(entry["content"]))  # this give indication of angry person or excited if theeeeeeeey repeat chars

#trainhatespeechfilepath = "/Volumes/GoogleDrive/My Drive/UniMelb/Semester_1_2019/COMP90024_CCC/Assignment/Assignment2/c3-assignment2/analysis/wrath_analysis/Twitter hate speech Dataset_train_E6oV3lV.csv"
#train_file = pd.read_csv(trainhatespeechfilepath)
#tweets += list(train_file["tweet"])
#labels += list(train_file["label"])

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




# Database Configuration
COUCH_IP = '172.26.38.57'
BASE_URL = 'http://172.26.38.57:5984' #to be dynamically set
USERNAME = 'admin'
PASSWORD = 'password'
#couch = couchdb.Server(BASE_URL)
couch = couchdb.Server("http://%s:%s@%s:5984/" % (USERNAME, PASSWORD, COUCH_IP))

sindbname = 'tweetsins'

if sindbname in couch:
    sindb = couch[sindbname]
else:
    sindb = couch.create(sindbname)

vicdb = couch['victoria']
usertimeline = couch['usertimeline']

vicview = vicdb.view('_design/uniqueUserWithCoords/_view/uniqueUserWithCoordsDoc')
timelinedocs = usertimeline.view('_all_docs', include_docs=True)

for row in vicview.rows:
    dic = row["value"]
    if dic["id_str"] not in sindb:  # Insert new records only
        testdata = bag_of_features(CleanTweetList([dic["text"]])[0])
        wrathflag = nb_classifier.classify(testdata)
        dic["wrathflag"] = wrathflag
        if "_rev" in dic:
            dic.pop("_rev")
        if "_id" in dic:
            dic.pop("_id")
        sindb[dic["id_str"]] = dic


for row in timelinedocs.rows:
    dic = row["doc"]
    if dic["id_str"] not in sindb:
        print('data adding' + str(dic["id"]))
        testdata = bag_of_features(CleanTweetList([dic["text"]])[0])
        wrathflag = nb_classifier.classify(testdata)
        dic["wrathflag"] = wrathflag
        if "_rev" in dic:
            dic.pop("_rev")
        if "_id" in dic:
            dic.pop("_id")
        sindb[dic["id_str"]] = dic


#map_fun = '''function(doc) {
#     if (doc.wrathflag == 0)
#         emit(doc.user, doc.text);
# }'''
#for row in sindb.query(map_fun):
#    print(row.key)

#for row in sindb.query(map_fun, descending=True):
#    print(row.key)
