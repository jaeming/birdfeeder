class FavoritesController < ApplicationController

  def create
    @story = Story.find(params[:story_id])
    @favorite = current_user.favorites.create! story: @story
    render json: @story
  end

  def destroy
    @story = Story.find(params[:story_id])
    @favorite = current_user.favorites.find_by(story: @story)
    @favorite.destroy!
    head :no_content
  end

end
