  class Hashtag < ActiveRecord::Base
  require 'json'
  has_many :stories
  has_many :feeds
  has_many :subscriptions
  has_many :views
  has_many :users, through: :subscriptions
  extend FriendlyId
  friendly_id :title, use: :slugged
  after_create :title_safe_slugs

  def self.search(title)
    search = "%#{title.downcase}%"
    self.where('lower(title) LIKE ?', search)
  end

  def title_safe_slugs
    self.slug = self.title
    self.save
  end

end
