class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :avatar, :hashtags

  def avatar
    object.gravatar_url
  end

  def hashtags
    object.hashtag_ids
  end

end
