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

  def destroy
    @user = User.find(params[:id])
    if current_user == @user
      @user.destroy!
      head :no_content
    else
      render json: {error: "could not delete account."}
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

end
