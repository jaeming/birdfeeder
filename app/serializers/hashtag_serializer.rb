class HashtagSerializer < ActiveModel::Serializer
  embed :ids, include: true

  attributes :id, :title, :subscribed, :subscriptions_count, :stories_count
  has_many :users

  delegate :current_user, to: :scope

  def subscribed
    object.users.include?(current_user)
  end

  def stories_count
    if current_user
      user_viewed = object.views.includes(:user).where(user: current_user)
      (object.stories.count || 0) - (user_viewed.count)
    else
      object.stories.count || 0
    end
  end

end
