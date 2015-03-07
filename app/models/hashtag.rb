  class Hashtag < ActiveRecord::Base
  require 'json'
  has_many :stories
  has_many :feeds

  def search_twitter
    client = Twitter::REST::Client.new do |config|
      config.consumer_key    = ENV['TWITTER_KEY'];
      config.consumer_secret = ENV['TWITTER_SECRET'];
      config.bearer_token = ENV['YOUR_BEARER_TOKEN'];
    end
    urls = []
    client.search("#{self.title} -rt", filter: "links", lang: "en").take(10).collect { |tweet| tweet.urls.select { |url| urls << url} }
    urls
  end


  def unshortened(url)
    Unshorten["#{url.expanded_url}"]
  end

end
