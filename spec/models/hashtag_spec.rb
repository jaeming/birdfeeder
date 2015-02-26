require 'rails_helper'

RSpec.describe Hashtag, :type => :model do

  xit "it discovers relevant feeds using twitter search API" do
    hashtag = Hashtag.create(title: "#angular")

    expect(hashtag.url_list).not_to be_nil
    expect(hashtag.feeds).not_to be_nil
  end
end
