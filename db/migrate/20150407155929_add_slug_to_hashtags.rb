class AddSlugToHashtags < ActiveRecord::Migration
  def change
    add_column :hashtags, :slug, :string
  end
end

