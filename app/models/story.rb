class Story < ActiveRecord::Base
  belongs_to :hashtag
  after_create :parse_feed


  default_scope -> {order('published DESC')}

  def published_at
    self.published || self.created_at
  end


  def parse_feed
    begin
      url = Feedisco.find(self.article_url)
      self.destroy! if url.blank?
      rss = Feedjira::Feed.fetch_and_parse url.first
      rss.entries.each do |feed|
        self.feed_url = url
        self.title = feed.title
        self.content = (feed.content || feed.summary).sanitize
        self.published = feed.published
        self.save!
      end
    rescue
      self.destroy!
    end
  end

end
