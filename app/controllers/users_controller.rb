class UsersController < ApplicationController
  respond_to :json
  before_action :authenticate_user!, except: [:create, :show, :default_user]

  def index
    @users = User.includes(:hashtags, :stories).all
    render json: @users
  end

  def show
    @user = User.find(params[:id])
    render json: @user
  end

  def update
    if current_user.update_attributes(user_params)
      render json: current_user
    else
      render json: {success: "false", message: "Sign in first"}
    end
  end

  def default_user
    @user = current_user || guest_user
    render json: @user
  end

  private
    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation, :name)
    end

    def guest_user
      unless user = User.find_by(name: "guest")
        password = Devise.friendly_token[0,8]
        user = User.new(name: "guest", email: "guest@bluebirdreader.com", password: password, password_confirmation: password)
        user.skip_confirmation!
        user.save!
      end
      user
    end

end
