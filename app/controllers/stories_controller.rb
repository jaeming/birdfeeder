class StoriesController < ApplicationController

  def index
    @stories = Story.includes(:hashtag, :users).all
    render json: @stories
  end

  def show
    @story = Story.find(params[:id])
    render json: @story
  end

  private
    def story_params
      params.require(:story).permit(:feed_url, :category)
    end

end
