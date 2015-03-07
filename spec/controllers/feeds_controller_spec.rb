require 'rails_helper'

RSpec.describe FeedsController, :type => :controller do
  include Devise::TestHelpers

  it "creates a new feed" do
    @user = create(:user)
    sign_in @user
    params = {"feed" => {"url" => "http://aspiringwebdev.com", "hashtag" => "webdev"}}

    post :create, params
    feed = Feed.last
    hashtag = feed.hashtag

    expect(feed).not_to be_nil
    expect(feed.rss).not_to be_nil
    expect(hashtag.title).to eq('webdev')
  end


end
