class StorySerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :hashtag, :published_at, :users, :favorited, :created_at, :favorites_count, :editable, :viewed
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
    if current_user
      true if current_user.favorites.find_by(story: object)
    else
      false
    end
  end

  def viewed
    if current_user
      true if current_user.views.find_by(story_id: object.id)
    else
      false
    end
  end

  def editable
    true if current_user
  end

end
