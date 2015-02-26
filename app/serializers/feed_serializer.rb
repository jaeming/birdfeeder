class FeedSerializer < ActiveModel::Serializer
  attributes :id, :title, :body

  def body
    object.content
  end

end
