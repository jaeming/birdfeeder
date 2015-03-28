class Subscription < ActiveRecord::Base
  belongs_to :user
  belongs_to :hashtag, counter_cache: true 
end
