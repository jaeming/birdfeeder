Rails.application.routes.draw do

scope '/api' do
  resources :hashtags
end

  root 'ember#loader'
  get '/*path' => 'ember#loader'
end
