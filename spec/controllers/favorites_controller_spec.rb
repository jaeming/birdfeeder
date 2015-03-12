require 'rails_helper'

RSpec.describe FavoritesController, type: :controller do
  include Devise::TestHelpers

    it "allows a user to favorite a story" do
      user = create(:user)
      sign_in user
      story1 = create(:story, title: "awesome story")
      story2 = create(:story, title: "lame story")

      post :create, story_id: story1.id

      expect(user.stories).to eq([story1])
      expect(user.stories).not_to eq([story2])
      expect(story1.users).to eq([user])
    end

    it "allows a user to unfavorite a story" do
      user = create(:user)
      sign_in user
      story1 = create(:story, title: "awesome story", users: [user])
      story2 = create(:story, title: "lame story", users: [user])

      delete :destroy, story_id: story2.id
      story1.reload
      story2.reload

      expect(user.stories).to include(story1)
      expect(user.stories).not_to include(story2)
      expect(story1.users).to eq([user])
      expect(story2.users).not_to include(user)
    end
end
