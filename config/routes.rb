Rails.application.routes.draw do
  get 'home/index'
  root 'home#index'

  resources :projects do
    resources :tasks
    resources :projects, only: [:new, :create]
  end

  resources :users, only: [:new, :edit, :create, :update]
  resources :sessions, only: [:new, :create, :update]

  get 'log-in', to: 'sessions#new', as: 'login'
  get 'log-out', to: 'sessions#destroy', as: 'logout'
end
