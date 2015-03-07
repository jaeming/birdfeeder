class HashtagsController < ApplicationController

  def index
    @hashtags = Hashtag.all
    render json: @hashtags
  end

  def show
    @hashtag = Hashtag.find(params[:id])
    render json: @hashtag
  end

  def create
    @hashtag = Hashtag.create!(hashtag_params)
    render json: @hashtag
  end

  # def search_twitter
  #   @hashtag = Hashtag.find_or_create_by(hashtag_params)
  #   tweets = @hashtag.search_twitter
  #   tweets.each { |url| @hashtag.stories.find_or_create_by(:article_url => @hashtag.unshortened(url))}
  #   render json: @hashtag
  # end

  private
    def hashtag_params
      params.require(:hashtag).permit(:title)
    end
end
