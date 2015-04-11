class FavoritesController < ApplicationController

  def create
    @story = Story.find(params[:story_id])
    @favorite = current_user.favorites.find_or_create_by! story: @story
    render json: @story
  end

  def destroy
    @story = Story.find(params[:story_id])
    @favorite = current_user.favorites.find_by(story: @story)
    @favorite.destroy!
    render json: @story
  end

end
