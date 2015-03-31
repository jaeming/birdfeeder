class RemoveViewedFromStories < ActiveRecord::Migration
  def change
    remove_column :stories, :viewed, :boolean
  end
end
