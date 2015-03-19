class AddFeaturedToHashtags < ActiveRecord::Migration
  def change
    add_column :hashtags, :featured, :boolean
  end
end
