class ConfirmationsController < Devise::ConfirmationsController

  def new
    super
  end

  def create
    super
  end

  def show
    self.resource = resource_class.confirm_by_token(params[:confirmation_token])

    if resource.errors.empty?
      sign_in(resource_name, resource)
      redirect_to root_path
    else
      respond_with resource.errors
    end
  end

  private
    def after_confirmation_path_for(resource_name, resource)
      redirect_to root_path
    end

end