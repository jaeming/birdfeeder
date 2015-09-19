class Feed < ActiveRecord::Base
  has_many :stories
  belongs_to :hashtag
  after_create :parse_feed

  def self.find_rss(url)
    begin
      rss = Feedisco.find(url).first
    rescue
      puts "Sorry. Couldn't retrieve a feed on that url"
    end
    rss
  end

  def parse_feed
    begin
      feed = Feedjira::Feed.fetch_and_parse(self.rss)
      create_stories_with(feed.entries) unless feed.blank?
    rescue
      puts "couldn't parse feed"
    end
  end

  def create_stories_with(entries)
    entries.each do |entry|
      @story = Story.find_or_create_by!(title: entry.title)
      unless @story.url
        begin
          @story.feed = self
          @story.url = entry.url
          @story.content = (entry.content || entry.summary)
          @story.published = entry.published
          @story.hashtag = self.hashtag
          @story.content.sanitize!
          @story.save!
        rescue
          @story.destroy!
          puts 'either bad or missing RSS fields'
        end
      end
    end
  end

  def self.update_all_feeds
    feeds = Feed.all
    feeds.each { |f| f.parse_feed }
  end

end
