class SessionsController < ApplicationController

  def show
    render json: current_user
  end

end
