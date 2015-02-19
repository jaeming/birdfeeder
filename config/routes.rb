Rails.application.routes.draw do
  root 'ember#loader'
  get '/path' => 'ember#loader'
end
