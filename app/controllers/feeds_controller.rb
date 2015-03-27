class FeedsController < ApplicationController

  def create
    url = feed_params[:url]
    @rss = Feed.find_rss(url)
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

  private
    def feed_params
      params.require(:feed).permit(:url, :hashtag)
    end

end
