class AddDefaultValueToFeaturedAttribute < ActiveRecord::Migration
  def change
    change_column :hashtags, :featured, :boolean, :default => false
  end
end
