class FeedsController < ApplicationController

  def create
    @rss = Feed.find_rss(feed_params[:url])
    unless @rss.blank?
      @feed = Feed.new(url: feed_params[:url], rss: @rss)
      @feed.hashtag = Hashtag.find_or_create_by!(title: feed_params[:hashtag].capitalize!)
      @feed.save!
      current_user.subscriptions.find_or_create_by!(hashtag: @feed.hashtag)
      render json: {title: @feed.hashtag.title}
    else
      render json: {error: "Sorry, couldn't retrieve a RSS Feed on that url. You can  also try pasting the RSS feed url directly or ask the website owner if they supply a RSS feed for their readers."}, :status => 400
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
