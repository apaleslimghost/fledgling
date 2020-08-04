Rails.application.routes.draw do
  get 'home/index'
  get 'projects/new'
  root 'home#index'
  resources :projects
end
