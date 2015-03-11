Rails.application.routes.draw do

scope '/api' do
  devise_for :users

  get 'sessions/current' => 'sessions#show'
  post 'hashtags/twitter' => 'hashtags#search_twitter'
  delete '/subscriptions/:hashtag_id' => 'subscriptions#destroy'

  resources :hashtags
  resources :stories
  resources :feeds
  resources :users, except: :destroy
  resources :subscriptions, only: [:create, :destroy]
end

  root 'ember#loader'
  get '/*path' => 'ember#loader'
end
