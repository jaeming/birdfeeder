class RemoveLikesFromStories < ActiveRecord::Migration
  def change
    remove_column :stories, :likes, :integer
  end
end
