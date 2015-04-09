class LoginsController < Devise::SessionsController

  def create
    self.resource = warden.authenticate!(auth_options)
    sign_in(resource_name, resource)
    yield resource if block_given?
    render json: {user: {id: @user.id, name: @user.name, email: @user.email, avatar: @user.gravatar_url, authenticated: true, token: form_authenticity_token}}
  end


end
