class StorySerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :hashtag, :published_at, :users

  def hashtag
    object.hashtag_id
  end

  def body
    object.content
  end

  def users
    object.user_ids
  end

end
