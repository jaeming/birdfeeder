class StoriesController < ApplicationController

  def index
    page = params[:page].try(:to_i) || 1
    story_index = page - 1
    # stories_not_viewed = Story.all.reject { |s| s.viewed_by_users.include?(current_user) }
    @stories = Story.includes(:users).limit(15).offset(story_index * 15)
    puts @stories.to_sql
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
