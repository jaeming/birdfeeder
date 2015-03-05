class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :avatar

  def avatar
    object.gravatar_url
  end

end
