class FeedsController < ApplicationController

  def index
    @feeds = Feed.all
    render json: @feeds
  end

  def show
    @feed = Feed.find(params[:id])
    render json: @feed
  end

  def create
    @hashtag = Hashtag.find(params[:id])
    @feed = Feed.create!(feed_params)
  end

  private
    def feed_params
      params.require(:feed).permit(:article_url, :feed_url)
    end

end
