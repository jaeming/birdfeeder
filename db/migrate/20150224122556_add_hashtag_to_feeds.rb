class AddHashtagToFeeds < ActiveRecord::Migration
  def change
    add_column :feeds, :hashtag_id, :integer
    add_index :feeds, :hashtag_id
  end
end
