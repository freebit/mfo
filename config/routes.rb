Rails.application.routes.draw do

  get 'reports/fetch_report'

  resources :orders


  get 'users/index'
  get 'users/show'
  get 'users/new'
  get 'users/edit'

  resources :users

  match '/signup',  to: 'users#new',            via: 'get'
  match '/signin',  to: 'sessions#new',         via: 'get'
  match '/signout', to: 'sessions#destroy',     via: 'delete'

  match '/uzel', to:"users#ajax_uzel",          via: 'post'



  resources :sessions, only: [:new, :create, :destroy]


  resources :reports

  match '/report', to:"reports#fetch_report",   via: 'post'

  root 'orders#index'

end
