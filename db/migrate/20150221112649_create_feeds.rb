class CreateFeeds < ActiveRecord::Migration
  def change
    create_table :feeds do |t|
      t.string :feed_url
      t.string :article_url
      t.string :title
      t.text :content
      t.datetime :published
      t.integer :likes
      t.timestamps null: false
    end
  end
end
