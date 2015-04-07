class StorySerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :hashtag, :published_at, :users, :favorited, :created_at, :favorites_count, :editable, :viewed, :url
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
    current_user.favorites.exists?(story: object) if current_user
  end

  def viewed
    current_user.views.exists?(story: object) if current_user
  end

  def editable
    true if current_user
  end

end
