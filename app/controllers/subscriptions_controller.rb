class SubscriptionsController < ApplicationController

  def create
    @hashtag = Hashtag.find(params[:hashtag_id])
    @subscription = current_user.subscriptions.create! hashtag: @hashtag
    render json: @subscription
  end

  def destroy
    @hashtag = Subscription.find(params[:hashtag_id])
    current_user.subscriptions.delete(@hashtag)
    head :no_content
  end

end
