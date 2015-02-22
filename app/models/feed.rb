class Feed < ActiveRecord::Base
  belongs_to :hashtags
  after_create :parse_feed

  def parse_feed
    feeds = Feedjira::Feed.fetch_and_parse self.feed_url
    feed = feeds.entries.find { |a| a["url"] == self.article_url }
    self.title = feed.title
    self.content = feed.content || feed.summary
    self.published = feed.published
  end

end
