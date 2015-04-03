class AddHashtagToViews < ActiveRecord::Migration
  def change
    add_column :views, :hashtag_id, :integer
    add_index :views, :hashtag_id
  end
end
