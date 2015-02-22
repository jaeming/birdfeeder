require 'rails_helper'

RSpec.describe Hashtag, :type => :model do

  it "it discovers relevant urls using twitter search API" do
    hashtag = Hashtag.create(title: "#angular")

    expect(hashtag.url_list).not_to be_nil
  end
end
