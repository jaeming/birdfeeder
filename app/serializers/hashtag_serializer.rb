class HashtagSerializer < ActiveModel::Serializer
  attributes :id, :title, :stories, :users, :subscribed, :subscriptions_count
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

  def subscriptions_count
    object.subscriptions.count
  end

end
