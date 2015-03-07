class Feed < ActiveRecord::Base
  has_many :stories
  belongs_to :hashtag
  after_create :parse_feed

  def self.find_rss(url)
    begin
      rss = Feedisco.find(url).first
    rescue
      render json: "Sorry. Couldn't retrieve a feed on that url"
    end
    rss
  end

  def parse_feed
    feed_url = self.rss
    begin
      feed = Feedjira::Feed.fetch_and_parse feed_url
      entries = feed.entries
    rescue
      puts "couldn't parse feed"
    end
    create_stories_with(entries) unless feed.blank?
  end

  def create_stories_with(entries)
    entries.each do |feed|
      @story = Story.new(feed: self)
      @story.title = feed.title
      @story.content = (feed.content || feed.summary).sanitize
      @story.published = feed.published
      @story.hashtag = self.hashtag
      @story.save!
    end
  end

end
