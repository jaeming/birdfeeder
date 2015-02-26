require 'rails_helper'

RSpec.describe Feed, :type => :model do

  xit "it assigns Feed attributes from a RSS/Atom url" do
    feed = Feed.create(article_url: "http://aspiringwebdev.com/mailchimp-and-active-job-on-rails-4-adding-users-to-your-mailing-list-in-the-background/", feed_url: "http://aspiringwebdev.com/feed/")

    expect(feed.title).not_to be_nil
  end
end
