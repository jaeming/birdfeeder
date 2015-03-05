class SessionsController < ApplicationController

  def show
    if current_user
      @user = current_user
      render json: {id: @user.id, name: @user.name, email: @user.email, avatar: @user.gravatar_url, authenticated: true, token: form_authenticity_token}
    else
      render json: {id: nil, name: "guest", email: nil, avatar: nil, authenticated: false, token: form_authenticity_token}
    end
  end

end
