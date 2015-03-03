class RenameFeedsToStories < ActiveRecord::Migration
  def change
    rename_table :feeds, :stories
  end
end
