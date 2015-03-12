class StorySerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :hashtag, :published_at, :users, :favorited
  delegate :current_user, to: :scope
  
  def hashtag
    object.hashtag_id
  end

  def body
    object.content
  end

  def users
    object.user_ids
  end

  def favorited
    object.users.include?(current_user)
  end

end
