# %%
import json
import nltk
from nltk.tokenize import WordPunctTokenizer
from nltk.stem import WordNetLemmatizer
import string
import time

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
    capital_word_count = 0
    rep = 0
    for w in words:
        if w.isupper():
            capital_word_count += 1
        #Below is commented because it didn't improve the performance
        #m = MaxRepeatingCharCount(w)
        #if m > rep:
        #    rep = m
    #features[capital_word_count] = True  # Number of All Captalized words
    #features[rep] = True #the length of maximum repeated letter, usually angry ppl repeat
    return features

def trainclassifier(trainingdatafilepath):
    tweets = []
    labels = []
    biggestrepeatcharcount = []
    #trainingdatafilepath = "/Volumes/GoogleDrive/My Drive/UniMelb/Semester_1_2019/COMP90024_CCC/Assignment/Assignment2/c3-assignment2/analysis/wrath_analysis/Dataset for Detection of Cyber-Trolls.json"
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

def wrathflag(text, classifier=nb_classifier):
    features = bag_of_features(CleanTweetList([text])[0])
    return classifier.classify(features)


# %%
trainfilepath = "/Volumes/GoogleDrive/My Drive/UniMelb/Semester_1_2019/COMP90024_CCC/Assignment/Assignment2/c3-assignment2/analysis/wrath_analysis/Dataset for Detection of Cyber-Trolls.json"
nb_classifier = trainclassifier(trainfilepath)

#print(nb_classifier.show_most_informative_features(n=10))
twittertext = "Life is great!"
print(twittertext, wrathflag(twittertext, nb_classifier))