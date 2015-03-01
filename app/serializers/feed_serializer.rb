class FeedSerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :hashtag

  def hashtag
    object.hashtag_id
  end

  def body
    object.content
  end

end
