Rails.application.routes.draw do

scope '/api' do
  devise_for :users

  get 'sessions/current' => 'sessions#show'
  get 'users/default_user' => 'users#default_user'
  post 'hashtags/twitter' => 'hashtags#search_twitter'
  post 'feeds/update' => 'feeds#update_feed'
  delete '/subscriptions/:hashtag_id' => 'subscriptions#destroy'
  delete '/favorites/:story_id' => 'favorites#destroy'
  delete '/views/:story_id' => 'views#destroy'

  get "hashtags" => "hashtags#search",
    :constraints => lambda { |request| request.params[:title] }

  get 'hashtags' => 'hashtags#subscribed_hashtags',
    :constraints => lambda { |request| request.params[:subscribed] == "true"}

  get 'stories' => 'stories#subscribed_stories',
    :constraints => lambda { |request| request.params[:subscribed] == "true"}

  get 'stories' => 'stories#favorite',
    :constraints => lambda { |request| request.params[:favorite] == "true"}

  resources :hashtags
  resources :stories
  resources :feeds
  resources :users, except: :destroy
  resources :subscriptions, only: :create
  resources :favorites, only: :create
  resources :views, only: :create
end

  root 'ember#loader'
  get '/*path' => 'ember#loader'
end
