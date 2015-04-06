  class Hashtag < ActiveRecord::Base
  require 'json'
  has_many :stories
  has_many :feeds
  has_many :subscriptions
  has_many :views
  has_many :users, through: :subscriptions

  def self.search(title)
    search = "%#{title.downcase}%"
    self.where('lower(title) LIKE ?', search)
  end

end
