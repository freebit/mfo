Rails.application.routes.draw do

  get 'reports/fetch_report'

  # get 'order/index'
  # get 'order/new'
  # get 'order/edit'

  resources :orders

  #match '/orders', to: 'orders#create',          via: 'post'




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


  #get 'reports/index'

  resources :reports

  match '/report', to:"reports#fetch_report",   via: 'post'

  root 'welcome#index'

end
