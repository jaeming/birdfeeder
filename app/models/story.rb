class Story < ActiveRecord::Base
  serialize :viewed_by_users, Array
  belongs_to :hashtag, counter_cache: true
  belongs_to :feed
  has_many :favorites
  has_many :views
  has_many :users, through: :favorites

  def published_at
    self.published || self.created_at
  end

  def self.as_viewed_by(user)
    find_by_sql(["select stories.*,
      CASE WHEN views.id is null THEN 0 ELSE 1 END as viewed
      from stories
      left join views
        on(views.story_id = stories.id and views.user_id = ?)
      where true
      group by stories.id, views.id
      order by viewed, stories.id", user.id])
  end

  def self.paginate(stories, page)
    end_index = ((page * 15) - 1)
    start_index = (end_index - 14)
    stories[start_index..end_index]
  end

  def self.remove_old_stories
    @stories = Story.where("created_at > :old", {:old => 40.days.ago})
    @stories.each do |s|
      s.destroy! unless s.favorites.any?
    end
  end

end
