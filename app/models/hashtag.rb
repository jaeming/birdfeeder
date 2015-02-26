class Hashtag < ActiveRecord::Base
  require 'json'
  has_many :feeds

  def search_twitter
    client = Twitter::REST::Client.new do |config|
      config.consumer_key    = ENV['TWITTER_KEY'];
      config.consumer_secret = ENV['TWITTER_SECRET'];
      config.bearer_token = ENV['YOUR_BEARER_TOKEN'];
    end

    client.search("#{self.title} -rt", filter: "links", lang: "en").take(10).collect do |tweet|
      tweet.urls.each { |url| self.feeds.find_or_create_by(:article_url => Unshorten["#{url.expanded_url}"]) }
    end
  end

end
