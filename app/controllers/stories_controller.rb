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
    @hashtag = Hashtag.find(params[:id])
    @story = Story.create!(story_params)
  end

  private
    def story_params
      params.require(:story).permit(:article_url, :feed_url)
    end

end
