require 'rails_helper'

RSpec.describe SubscriptionsController, :type => :controller do
  include Devise::TestHelpers

  it "subscribes a user to a hashtag" do
    user = create(:user)
    user.reload
    sign_in user
    hashtag1 = create(:hashtag, title: "Ruby")
    hashtag2 = create(:hashtag, title: "Cobol")

    post :create, hashtag_id: hashtag1.id

    expect(user.hashtags).to eq([hashtag1])
    expect(user.hashtags).not_to eq([hashtag2])
  end

  it "unsubscribes a user to a hashtag" do
    user = create(:user)
    user.reload
    sign_in user
    hashtag1 = create(:hashtag, title: "Ruby")
    hashtag2 = create(:hashtag, title: "Cobol")
    hashtag1.users << user
    hashtag2.users << user

    delete :destroy, hashtag_id: hashtag2.id
    hashtag1.reload
    hashtag2.reload

    expect(user.hashtags).to include(hashtag1)
    expect(user.hashtags).not_to include(hashtag2)
    expect(hashtag1.users).to include(user)
    expect(hashtag2.users).not_to include(user)
  end

end
