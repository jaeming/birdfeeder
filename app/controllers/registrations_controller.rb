class RegistrationsController < Devise::RegistrationsController
  before_action :authenticate_user!, except: [:show, :create]

  def update
    @user = current_user
    if @user.update_attributes(edit_account_params)
      sign_in @user, :bypass => true
      render json: {user: {id: @user.id, name: @user.name, email: @user.email, avatar: @user.gravatar_url, authenticated: true, token: form_authenticity_token}}
    else
      render :json => { :errors => @user.errors }, :status => :unprocessable_entity
    end
  end

  def create
    build_resource(sign_up_params)

    resource.save
    yield resource if block_given?
    if resource.persisted?
      if resource.active_for_authentication?
        set_flash_message :notice, :signed_up if is_flashing_format?
        sign_up(resource_name, resource)
        render json: {user: {id: @user.id, name: @user.name, email: @user.email, avatar: @user.gravatar_url, authenticated: true, token: form_authenticity_token}}
      else
        set_flash_message :notice, :"signed_up_but_#{resource.inactive_message}" if is_flashing_format?
        expire_data_after_sign_in!
        respond_with resource, location: after_inactive_sign_up_path_for(resource)
      end
    else
      clean_up_passwords resource
      set_minimum_password_length
      respond_with resource
    end
  end


  private
    def edit_account_params
      params.require(:user).permit(:email, :password, :password_confirmation, :name)
    end

end
