class AddFeedToHashtags < ActiveRecord::Migration
  def change
    add_column :hashtags, :feed_id, :integer
    add_index :hashtags, :feed_id
  end
end
