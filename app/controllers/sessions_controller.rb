class SessionsController < ApplicationController

  def show
    return head :unauthorized unless current_user
    render json: current_user
  end

end
