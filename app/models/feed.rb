class Feed < ActiveRecord::Base
  belongs_to :hashtag
  after_create :parse_feed

  def parse_feed
    begin
      url = Feedisco.find(self.article_url)
        rss = Feedjira::Feed.fetch_and_parse url.first
        feed = rss.entries.find {|a| a["url"] == self.article_url} || rss.entries.last
        self.feed_url = url
        self.title = feed.title
        self.content = feed.content || feed.summary
        self.published = feed.published
        self.save!
    rescue
      self.destroy!
    end
  end

end
