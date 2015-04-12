class AddViewedByUsersToStories < ActiveRecord::Migration
  def change
    add_column :stories, :viewed_by_users, :text
  end
end
