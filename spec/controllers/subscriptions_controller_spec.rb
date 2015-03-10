require 'rails_helper'

RSpec.describe SubscriptionsController, :type => :controller do
  include Devise::TestHelpers

  it "subscribes a user to a hashtag" do
    user = create(:user)
    sign_in user
    hashtag1 = create(:hashtag, title: "Ruby")
    hashtag2 = create(:hashtag, title: "Cobol")

    post :create, hashtag_id: hashtag1.id

    expect(user.hashtags).to eq([hashtag1])
    expect(user.hashtags).not_to eq([hashtag2])
  end

  it "unsubscribes a user to a hashtag" do
    user = create(:user)
    sign_in user
    hashtag1 = create(:hashtag, title: "Ruby", users: [user])
    hashtag2 = create(:hashtag, title: "Cobol", users: [user])

    delete :destroy, hashtag_id: hashtag2.id

    expect(user.hashtags).to eq([hashtag1])
    expect(user.hashtags).not_to eq([hashtag2])
  end


end
