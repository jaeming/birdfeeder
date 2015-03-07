Rails.application.routes.draw do

scope '/api' do
  devise_for :users
  get 'sessions/current' => 'sessions#show'
  post 'hashtags/twitter' => 'hashtags#search_twitter'
  resources :hashtags
  resources :stories
  resources :feeds
end

  root 'ember#loader'
  get '/*path' => 'ember#loader'
end
