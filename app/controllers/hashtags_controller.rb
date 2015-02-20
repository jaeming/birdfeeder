class HashtagsController < ApplicationController

  def index
    @hashtags = Hashtag.all
    render json: @hashtags
  end

  def show
    @hashtag = Hashtag.find(params[:id])
    render json: @hashtag
  end

end
