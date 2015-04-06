class ApplicationController < ActionController::Base
  respond_to :html, :json
  protect_from_forgery with: :exception
  before_action :configure_permitted_parameters, if: :devise_controller?
  serialization_scope :view_context




  protected
    def configure_permitted_parameters
      devise_parameter_sanitizer.for(:sign_up) << :name
    end

  private
    def guest_user
      unless user = User.find_by(name: "guest")
        password = Devise.friendly_token[0,8]
        user = User.new(name: "guest", email: "guest@bluebird.space", password: password, password_confirmation: password)
        user.skip_confirmation!
        user.save!
      end
      user
    end

end
