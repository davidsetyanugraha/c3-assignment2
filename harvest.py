import tweepy


class MyStreamListener(tweepy.StreamListener):
    def on_status(self, status):
        print(status.text)


consumer_key = "NKplhMO19jOi5KwnR3QlUJnUx"
consumer_secret = "MEQx2FmsOjbaxxm0CeE9u9OHNqQ0xIqFul30tIfkFHRCF7oy6j"
access_token = "156224585-C6LFHPJjxlVNu5QXfTnTwW2Z7Ka7ZoqDSi8ly5JV"
access_token_secret = "mQXX1pVixM3GfRYI3YVXH7f9669SUnTtaJMcyHIR2MWmE"

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth)

auth = api.auth
l = MyStreamListener()

myStream = tweepy.Stream(auth, l)

myStream.filter(track=['jokowi'])
