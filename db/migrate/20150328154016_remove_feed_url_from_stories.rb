class RemoveFeedUrlFromStories < ActiveRecord::Migration
  def change
    remove_column :stories, :feed_url, :string
  end
end
