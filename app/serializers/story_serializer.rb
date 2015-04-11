class StorySerializer < ActiveModel::Serializer
  embed :ids, include: true

  attributes :id, :title, :body, :published_at, :favorited, :created_at, :favorites_count, :editable, :viewed, :url, :hashtag_id, :user_ids, :long_article

  delegate :current_user, to: :scope

  def body
    object.content.truncate(3500, separator: '<')
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

  def long_article
    object.content.size > 3500
  end

end
