require 'rails_helper'

RSpec.describe HashtagsController, :type => :controller do
  include Devise::TestHelpers

  it "Gets an index of hashtags" do
  10.times { hashtags = create(:hashtag) }
    get :index

    expect(response).to be_success
    expect(response).to have_http_status(200)
  end

  it "renders index of hashtags in JSON" do
    10.times { hashtags = create(:hashtag) }

    get :index

    expect(response).to have_http_status(:success)
    json = JSON.parse(response.body)
    expect(json['hashtags'].length).to eq(10)
  end

  it "returns a specific hashtag in JSON" do
    hashtag = create(:hashtag, title: "lolcats")

    get :show, id: hashtag.id

    expect(response).to have_http_status(:success)
    json = JSON.parse(response.body)
    expect(JsonPath.on(json, '$..title')).to eq(["lolcats"])
  end

  it "creates a new hashtag" do
    @user = create(:user)
    sign_in @user
    params = {"hashtag" => {"title" => "programming"}}

    post :create, params

    expect(Hashtag.last[:title]).to eq("programming")
  end

end
