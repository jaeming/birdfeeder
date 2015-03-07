class AddHashtagToFeeds < ActiveRecord::Migration
  def change
    add_column :feeds, :hashtag_id, :integer
  end
end
