class AddViewedToStories < ActiveRecord::Migration
  def change
    add_column :stories, :viewed, :boolean, default: false
  end
end
