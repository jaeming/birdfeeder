class AddFavoritesCountToStories < ActiveRecord::Migration
  def change
    add_column :stories, :favorites_count, :integer
  end
end
