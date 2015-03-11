class SubscriptionsController < ApplicationController

  def create
    @hashtag = Hashtag.find(params[:hashtag_id])
    @subscription = current_user.subscriptions.create! hashtag: @hashtag
    render json: @hashtag
  end

  def destroy
    @hashtag = Hashtag.find(params[:hashtag_id])
    current_user.hashtags.delete(@hashtag)
    head :no_content
  end

end
