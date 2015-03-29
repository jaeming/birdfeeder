class FixStoryMigration < ActiveRecord::Migration
  def change
    add_column :stories, :url, :string
  end
end
