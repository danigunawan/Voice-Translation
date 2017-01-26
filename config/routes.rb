Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'home#index'

  resources :commands, only: [:create, :destroy]

  get '/translate', to: 'home#translate'
end
