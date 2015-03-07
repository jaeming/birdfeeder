class StoriesController < ApplicationController

  def index
    @stories = Story.all
    render json: @stories
  end

  def show
    @story = Story.find(params[:id])
    render json: @story
  end

  def create
    begin
    url = Feedisco.find("#{params[:feed_url]}")
    rss = Feedjira::Feed.fetch_and_parse url.first
    # @hashtag = Hashtag.find_or_create_by(title: params[:category])
    rss.entries.each do |feed|
      @story = Story.new
      @story.feed_url = url
      @story.title = feed.title
      @story.content = (feed.content || feed.summary).sanitize
      @story.published = feed.published
      # @story.hashtag = @hashtag
      @story.save!
      head :no_content
    end
    rescue
      puts "no feed found!"
      render json: "Sorry, couldn't find a rss feed on that url"
    end
  end

  private
    def story_params
      params.require(:story).permit(:feed_url)
    end

end