FactoryGirl.define do
  factory :hashtag do
    sequence(:title, 100) { |n| "meme#{n}" }
  end
end
