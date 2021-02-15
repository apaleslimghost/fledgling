Rails.application.routes.draw do
  get "home/index"
  root "home#index"

  resources :projects do
    resources :tasks do
      get "move", on: :member, to: "tasks#move"
    end

    resources :projects, only: [:new, :create]
    get "archive", on: :member, to: "projects#archive"
    get "move", on: :member, to: "projects#move"
  end

  resources :users, only: [:new, :edit, :create, :update]
  resources :sessions, only: [:new, :create, :update]

  get "log-in", to: "sessions#new", as: "login"
  get "log-out", to: "sessions#destroy", as: "logout"
end
