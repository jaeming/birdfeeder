class StoriesController < ApplicationController

  def index
    @stories = Story.includes(:hashtag, :users).all
    render json: @stories
  end

  def show
    @story = Story.find(params[:id])
    render json: @story
  end

  def favorite
    @favorites = current_user.stories
    render json: @favorites
  end

  def subscribed_stories
    @subscriptions = Subscription.where(user: current_user || guest_user)
    @stories = []
    @subscriptions.each { |s| @stories |= s.hashtag.stories }
    render json: @stories
  end

  private
    def story_params
      params.require(:story).permit(:feed_url, :category)
    end

end
