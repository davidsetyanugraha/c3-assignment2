
# %%
# keys for twitter
consumer_key = "NKplhMO19jOi5KwnR3QlUJnUx"
consumer_secret = "MEQx2FmsOjbaxxm0CeE9u9OHNqQ0xIqFul30tIfkFHRCF7oy6j"
access_token = "156224585-C6LFHPJjxlVNu5QXfTnTwW2Z7Ka7ZoqDSi8ly5JV"
access_token_secret = "mQXX1pVixM3GfRYI3YVXH7f9669SUnTtaJMcyHIR2MWmE"

APP_KEY = '0onV5a9xzDHocYrgC8inDnwKm'
APP_SECRET = 'tr5SbtR3ykQL4VGq5GNL0RvBb2hO3aTcPaLd2ZeOafxuJfAW49'
ACCESS_TOKEN = "AAAAAAAAAAAAAAAAAAAAADqf1AAAAAAAexVfvZEL5yUZpylOfS53RCf98dg%3D0WCTV4bBwKX8ANceSFg2cOZjllXcMiVTJblOL7Wot0LraNsZQs"

# %%
# below us the direct search API
from twython import Twython

# twitter = Twython(APP_KEY, APP_SECRET, oauth_version=2)
twitter = Twython(APP_KEY, access_token=ACCESS_TOKEN)

results = twitter.cursor(twitter.search, q='hate', result_type='popular')
for result in results:
    #print(result)
    test_data = bag_of_words(CleanTweetList([result['text']])[0])
    nb_classifier.classify(test_data)

# %%

# %%
# try with streaming
from twython import Twython
from twython import TwythonStreamer

twitter = Twython(APP_KEY, APP_SECRET)
auth = twitter.get_authentication_tokens()
OAUTH_TOKEN = auth['oauth_token'] #"2hO6twAAAAAA1J86AAABaoftL9A"  # auth['oauth_token']
OAUTH_TOKEN_SECRET = auth['oauth_token_secret'] #"AC8uOoHsogCy08CzeyCVbvfdmCWfwyEn"  # auth['oauth_token_secret']


class MyStreamer(TwythonStreamer):
    def on_success(self, data):
        if 'text' in data:
            testdata = bag_of_words(CleanTweetList([data['text']])[0])
            print(nb_classifier.classify(testdata), "-", data['text'])
            self.disconnect()

    def on_error(self, status_code, data):
        print(status_code)
        print(data)
        self.disconnect()


stream = MyStreamer(APP_KEY, APP_SECRET, OAUTH_TOKEN, OAUTH_TOKEN_SECRET)
stream.statuses.filter(track='twitter')
