#TOPICS
featured_topics = ["Technology", "Music", "Culture", "Random", "Science"]
featured_topics.each do |topic|
  Hashtag.create(title: topic, featured: true)
end

topics = ["Entertainment", "Funny", "WebDesign", "News", "Life", "NewZealand", "Gaming"]
topics.each do |topic|
  Hashtag.create(title: topic)
end

subscribed_topics = Hashtag.where(:featured => true)
topics = Hashtag.all

#FEEDS
gizmodo = {topic: "Technology", rss_url: "http://feeds.gawker.com/gizmodo/full", url: "http://gizmodo.com/"}
arstechnica = {topic: "Technology", rss_url: "http://feeds.arstechnica.com/arstechnica/index", url: "http://arstechnica.com/"}
makeuseof = {topic: "Technology", rss_url: "http://feeds.feedburner.com/Makeuseof", url: "http://www.makeuseof.com/"}
pitchfork = {topic: "Music", rss_url: "http://pitchfork.com/rss/news/", url: "http://pitchfork.com/"}
ninety = {topic: "Culture", rss_url: "http://99u.com/feed", url: "http://99u.com/"}
slate = {topic: "Culture", rss_url: "http://www.slate.com/all.fulltext.all.rss", url: "http://www.slate.com/"}
boingboing = {topic: "Random", rss_url: "http://feeds.boingboing.net/boingboing/iBag", url: "http://boingboing.net/"}
smosh = {topic: "Funny", rss_url: "http://www.smosh.com/rss.xml", url: "http://www.smosh.com/"}
chive = {topic: "Random", rss_url: "http://feeds.feedburner.com/feedburner/ZdSV", url: "http://thechive.com/"}
awesomer = {topic: "Random", rss_url: "http://theawesomer.com/feed/", url: "http://theawesomer.com/"}
lifehacker = {topic: "Life", rss_url: "http://feeds.gawker.com/lifehacker/full", url: "http://lifehacker.com/"}
billfold = {topic: "Entertainment", rss_url: "http://feeds.feedburner.com/TheBillfold", url: "http://thebillfold.com/"}
science = {topic: "Science", rss_url: "http://www.popsci.com/rss.xml", url: "http://www.popsci.com/"}
kotaku = {topic: "Gaming", rss_url: "http://feeds.kotaku.com.au/KotakuAustralia", url: "http://www.kotaku.com/"}
nz = {topic: "NewZealand", rss_url: "http://www.reddit.com/r/newzealand/.rss", url: "http://www.reddit.com/r/newzealand/"}
random = {topic: "Random", rss_url: "http://www.reddit.com/.rss", url: "http://www.reddit.com/"}
news = {topic: "News", rss_url: "http://rss.cnn.com/rss/cnn_topstories.rss", url: "http://cnn.com/"}
codrops = {topic: "WebDesign", rss_url: "http://feeds.feedburner.com/tympanus", url: "http://tympanus.net/codrops/"}
designshack = {topic: "WebDesign", rss_url: "http://feedpress.me/designshack", url: "http://designshack.net/"}

selected_feeds = [gizmodo, arstechnica, makeuseof, pitchfork, ninety, slate, boingboing, smosh, chive, awesomer, lifehacker, billfold, science, kotaku, nz, random, news, codrops, designshack]

selected_feeds.each do |f|
  feed = Feed.new(url: f[:url], rss: f[:rss_url])
  feed.hashtag = Hashtag.find_by!(title: f[:topic])
  feed.save!
end

feeds = Feed.all

#USER
password = Devise.friendly_token[0,8]
user = User.new(name: "guest", email: "guest@bluebird.space",password: password, password_confirmation: password)
user.skip_confirmation!
user.save!

default_user = User.find_by(name: "guest")

stories = Story.all


puts "Generated a user: #{default_user.name}."
puts "Generated #{subscribed_topics.size} featured topics and #{topics.size} total topics."
puts "Generated #{feeds.size} Feeds."
puts "Generated #{stories.size} Stories."
