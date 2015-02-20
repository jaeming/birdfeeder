require 'faker'

20.times do
  hashtag = Hashtag.new(
    title:  Faker::Hacker.noun,
  )
  hashtag.save!
end
hashtags = Hashtag.all


p "#{hashtags.size} Hashtags created."