class AddStoriesCountToHashtags < ActiveRecord::Migration
  def change
    add_column :hashtags, :stories_count, :integer
  end
end
