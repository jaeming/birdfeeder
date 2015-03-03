require 'rails_helper'

RSpec.describe Story, :type => :model do

  xit "it assigns Story attributes from a RSS/Atom url" do
    story = Story.create(article_url: "http://aspiringwebdev.com/mailchimp-and-active-job-on-rails-4-adding-users-to-your-mailing-list-in-the-background/", feed_url: "http://aspiringwebdev.com/feed/")

    expect(story.title).not_to be_nil
  end
end
