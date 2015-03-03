class HashtagSerializer < ActiveModel::Serializer
  attributes :id, :title, :stories

  def stories
    object.story_ids
  end

end
