class SubscriptionsController < ApplicationController

  def create
    @hashtag = Hashtag.find(params[:hashtag_id])
    @subscription = current_user.subscriptions.find_or_create_by! hashtag: @hashtag
    render json: @hashtag
  end

  def destroy
    @hashtag = Hashtag.find(params[:hashtag_id])
    @subscription = current_user.subscriptions.find_by(hashtag: @hashtag)
    @subscription.destroy!
    head :no_content
  end

end
