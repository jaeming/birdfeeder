class AddUrlListToHashtag < ActiveRecord::Migration
  def change
    add_column :hashtags, :url_list, :text
  end
end
