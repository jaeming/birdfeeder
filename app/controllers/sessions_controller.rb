class SessionsController < ApplicationController

  def show
    return head :unauthorized unless current_user
    render json: {id: current_user.id, name: current_user.name, email: current_user.email, avatar: current_user.gravatar_url}
  end

end
