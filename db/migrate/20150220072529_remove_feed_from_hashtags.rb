class RemoveFeedFromHashtags < ActiveRecord::Migration
  def change
    remove_column :hashtags, :feed, :string
  end
end
