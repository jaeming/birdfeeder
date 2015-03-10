class Story < ActiveRecord::Base
  belongs_to :hashtag
  belongs_to :feed
  has_many :favorites
  has_many :users, through: :favorites

  default_scope -> {order('published DESC')}

  def published_at
    self.published || self.created_at
  end

end
