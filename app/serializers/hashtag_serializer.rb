class HashtagSerializer < ActiveModel::Serializer
  attributes :id, :title, :feeds

  def feeds
    object.feed_ids
  end

end
