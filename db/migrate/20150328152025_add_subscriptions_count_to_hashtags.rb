class AddSubscriptionsCountToHashtags < ActiveRecord::Migration
  def change
    add_column :hashtags, :subscriptions_count, :integer
  end
end
