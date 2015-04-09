class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :avatar, :hashtags, :stories
  delegate :current_user, to: :scope

  def avatar
    object.gravatar_url
  end

  def hashtags
    object.hashtag_ids
  end

  def stories
    object.story_ids
  end

end
