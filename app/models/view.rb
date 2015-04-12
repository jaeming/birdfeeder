class View < ActiveRecord::Base
  belongs_to :user
  belongs_to :story
  belongs_to :hashtag
  after_create :serialize_viewed

  def serialize_viewed
    story = Story.find(self.story_id)
    story.viewed_by_users << self.user_id
    story.save!
  end

end
