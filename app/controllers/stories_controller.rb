class StoriesController < ApplicationController

  def index
    page = params[:page].try(:to_i) || 1
    @stories = Story.as_viewed_by(current_user || guest_user)
    render json: Story.paginate(@stories, page)
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
    def offset_story(page)
      if page == 0
        15
      else
        page * 14
      end
    end

    def story_params
      params.require(:story).permit(:feed_url, :category)
    end

end
