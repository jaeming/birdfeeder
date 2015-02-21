Rails.application.routes.draw do

scope '/api' do
  resources :hashtags
  resources :feeds
  devise_for :users
  get 'sessions/current' => 'sessions#show'
end

  root 'ember#loader'
  get '/*path' => 'ember#loader'
end
