class FeedsController < ApplicationController

  def index
    @feeds = Feed.all
    render json: @feeds
  end

  def show
    @feed = Feed.find(params[:id])
    render json: @feed
  end

end
