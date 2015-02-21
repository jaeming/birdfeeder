class Feed < ActiveRecord::Base
  belongs_to :hashtags
  after_create :parse_feed

  def parse_feed
    url = self.feed_url
    feeds = Feedjira::Feed.fetch_and_parse url
    feed = feeds.entries.find { |a| a["url"] == self.article_url }
    self.title = feed.title
    self.content = feed.content || feed.summary
    self.published = feed.published
  end

end
