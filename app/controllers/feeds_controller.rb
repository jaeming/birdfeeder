class FeedsController < ApplicationController

  def create
    @rss = Feed.find_rss(feed_params[:url])
    unless @rss.blank?
      @feed = Feed.new(url: feed_params[:url], rss: @rss)
      @feed.hashtag = Hashtag.find_or_create_by!(title: feed_params[:hashtag].capitalize!)
      @feed.save!
      current_user.hashtags | [@feed.hashtag]
      render json: @feed.hashtag.id
    else
      render json: "No Feeds found"
    end
  end

  def update_feed
    @hashtag = Hashtag.find(params[:hashtag_id])
    @hashtag.feeds.each { |f| f.parse_feed }
    @stories = @hashtag.stories.includes(:users)
    render json: @stories, root: :stories
  end

  private
    def feed_params
      params.require(:feed).permit(:url, :hashtag)
    end

end
