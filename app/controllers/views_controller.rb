class ViewsController < ApplicationController

  def create
    @user = current_user
    @story = Story.find(params[:story_id])
    @view = @user.views.create!(story_id: @story.id, hashtag_id: @story.hashtag.id)
    render json: {viewed: true, id: @story.id}
  end

  def destroy
    @user = current_user
    @story = Story.find(params[:story_id])
    @view = @user.views.find_by(story: @story)
    @view.destroy!
    render json: {viewed: false, id: @story.id}
  end

end
