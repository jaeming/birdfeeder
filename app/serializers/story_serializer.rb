class StorySerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :hashtag, :published_at

  def hashtag
    object.hashtag_id
  end

  def body
    object.content
  end

end
