class User < ActiveRecord::Base
  include Gravtastic
  gravtastic
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :confirmable
  has_many :subscriptions
  has_many :favorites
  has_many :views
  has_many :hashtags, through: :subscriptions
  has_many :stories, through: :favorites
  validates :name, uniqueness: { case_sensitive: false }, presence: true
  after_create :subscribe_to_defaults

  def subscribe_to_defaults
    self.hashtags = Hashtag.where(:featured => true)
    self.save!
  end

end
