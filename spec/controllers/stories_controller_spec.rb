require 'rails_helper'

RSpec.describe StoriesController, :type => :controller do
  include Devise::TestHelpers

  it "Gets an index of stories" do
  10.times { stories = create(:story) }
    get :index

    expect(response).to be_success
    expect(response).to have_http_status(200)
  end

  it "renders index of stories in JSON" do
    10.times { stories = create(:story) }

    get :index

    expect(response).to have_http_status(:success)
    json = JSON.parse(response.body)
    expect(json['stories'].length).to eq(10)
  end

  it "returns a specific story in JSON" do
    story = create(:story, title: "lolcats")

    get :show, id: story.id

    expect(response).to have_http_status(:success)
    json = JSON.parse(response.body)
    expect(JsonPath.on(json, '$..title')).to eq(["lolcats"])
  end

  it "creates a new story" do
    @user = create(:user)
    sign_in @user
    params = {"story" => {"feed_url" => "http://aspiringwebdev.com/feed/", "category" => "webdev"}}

    post :create, params
    story = Story.last

    expect(story).not_to be_nil
    expect(story.hashtag).to eq('webdev')
  end


end
