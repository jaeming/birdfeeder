class ViewsController < ApplicationController

  def create
    @story = Story.find(params[:story_id])
    @view = current_user.views.create! story_id: @story.id
    render json: {viewed: true, id: @story.id}
  end

  def destroy
    @story = Story.find(params[:story_id])
    @view = current_user.views.find_by(story: @story)
    @view.destroy!
    render json: {viewed: false, id: @story.id}
  end

end
