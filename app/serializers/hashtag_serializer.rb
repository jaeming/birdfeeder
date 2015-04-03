class HashtagSerializer < ActiveModel::Serializer
  attributes :id, :title, :stories, :users, :subscribed, :subscriptions_count, :stories_count
  delegate :current_user, to: :scope

  def stories
    object.story_ids
  end

  def users
    object.user_ids
  end

  def subscribed
    object.users.include?(current_user)
  end

  def stories_count
    if current_user
      user_viewed = object.views.includes(:user).where(user: current_user)
      (object.stories_count || 0) - (user_viewed.count)
    else
      object.stories_count || 0
    end
  end

end
