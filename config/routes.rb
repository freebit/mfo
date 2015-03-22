Rails.application.routes.draw do

  get 'users/index'
  get 'users/show'
  get 'users/new'
  get 'users/edit'


  root 'welcome#index'


  resources :users
  resources :sessions, only: [:new, :create, :destroy]

  match '/signup',  to: 'users#new',            via: 'get'
  match '/signin',  to: 'sessions#new',         via: 'get'
  match '/signout', to: 'sessions#destroy',     via: 'delete'

  match '/uzel', to:"users#ajax_uzel",          via: 'post'

end
