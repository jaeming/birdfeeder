class Hashtag < ActiveRecord::Base
  require 'json'
  has_many :feeds
  serialize :url_list, Array
  after_create :find_urls

  def find_urls
    client = Twitter::REST::Client.new do |config|
      config.consumer_key    = ENV['TWITTER_KEY'];
      config.consumer_secret = ENV['TWITTER_SECRET'];
      config.bearer_token = ENV['YOUR_BEARER_TOKEN'];
    end

    client.search("#{self.title} -rt", filter: "links").take(20).collect do |tweet|
      tweet.urls.each { |url| self.url_list << "#{url.expanded_url}" }
    end
  end

end
