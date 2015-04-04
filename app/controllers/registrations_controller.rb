class RegistrationsController < Devise::RegistrationsController

  def update
    @user = current_user
    if @user.update_attributes(edit_account_params)
      sign_in @user, :bypass => true
      render json: {user: {id: @user.id, name: @user.name, email: @user.email, avatar: @user.gravatar_url, authenticated: true, token: form_authenticity_token}}
    else
      render :json => { :errors => @user.errors }, :status => :unprocessable_entity
    end

  end

  private
    def edit_account_params
      params.require(:user).permit(:email, :password, :password_confirmation, :name)
    end

end
