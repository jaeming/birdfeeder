class View < ActiveRecord::Base
  belongs_to :user
  belongs_to :story
  belongs_to :hashtag  
end
