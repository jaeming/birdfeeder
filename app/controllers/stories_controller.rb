class StoriesController < ApplicationController

  def index
    page = params[:page].try(:to_i) || 1
    si = page - 1
    @stories = Story.includes(:hashtag, :users).limit(25).offset(si * 25)
    puts @stories.to_sql
    render json: @stories
  end

  def show
    @story = Story.find(params[:id])
    render json: @story
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
