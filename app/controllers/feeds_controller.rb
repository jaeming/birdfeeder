class FeedsController < ApplicationController

  def create
    url = feed_params[:url]
    @rss = Feed.find_rss(url)
    unless @rss.blank?
      @feed = Feed.new(url: feed_params[:url], rss: @rss)
      @feed.hashtag = Hashtag.find_or_create_by!(title: feed_params[:hashtag])
      @feed.save!
      head :no_content
    end
  end

  private
    def feed_params
      params.require(:feed).permit(:url, :hashtag)
    end

end
