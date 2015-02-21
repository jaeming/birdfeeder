FactoryGirl.define do
  factory :user do
    name "Wesley Snipes"
    sequence(:email, 100) { |n| "person#{n}@example.com" }
    password "secretpassword"
    password_confirmation "secretpassword"
    confirmed_at Time.now
  end
end
