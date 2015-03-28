class RemoveArticleUrlFromStories < ActiveRecord::Migration
  def change
    remove_column :stories, :article_url, :string
  end
end
