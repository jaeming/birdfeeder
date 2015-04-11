class ViewsController < ApplicationController

  def create
    @user = current_user
    @story = Story.find(params[:story_id])
    @hashtag = @story.hashtag
    @view = @user.views.find_or_create_by!(story_id: @story.id, hashtag_id: @hashtag.id)
    render json: {viewed: true, id: @story.id, hashtag_id: @hashtag.id}
  end

  def destroy
    @user = current_user
    @story = Story.find(params[:story_id])
    @view = @user.views.find_by(story: @story)
    @view.destroy!
    render json: {viewed: false, id: @story.id}
  end

end
