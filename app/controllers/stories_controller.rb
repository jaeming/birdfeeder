class StoriesController < ApplicationController

  def index
    @stories = Story.includes(:users).all
    render json: @stories
  end

  def show
    @story = Story.find(params[:id])
    render json: @story
  end

  def favorite
    @favorites = current_user.stories.includes(:users)
    render json: @favorites
  end

  def subscribed_stories
    @user = current_user || guest_user
    @subscriptions = @user.subscriptions.includes(:hashtag)
    @stories = []
    @subscriptions.find_each { |s| @stories |= s.hashtag.stories.includes(:users) }
    render json: @stories
  end

  private
    def story_params
      params.require(:story).permit(:feed_url, :category)
    end

end
