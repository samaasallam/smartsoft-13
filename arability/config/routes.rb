Arability::Application.routes.draw do
  root :to => 'pages#home'  

  scope "(:locale)", :locale => /en|ar/ do

    #here only two languages are accepted: english and arabic

    # required for routing by the devise module(gem)
    devise_for :gamers, :controllers => { :omniauth_callbacks => "gamers/omniauth_callbacks" } do
       get 'gamers/sign_in', :to => 'devise/sessions#new', :as => :new_gamer_session
       get 'gamers/sign_out', :to => 'devise/sessions#destroy', :as => :destroy_gamer_session
    end

    get "admin/index"

    get "admin/login"

    get "admin/login"
    get "admin/logout"

    post "admin/wordadd"

  
    post "admin/login"

    get "admin/import_csv"

    post "admin/upload"

    post "admin/addword"

    post "admin/addtrophy"

    post "admin/addprize"

    get "admin/deletetrophy"

    get "admin/deleteprize"

    match '/game' => 'games#game'

    post "games/vote" 

    post "games/record_vote"

    get 'games/getnewwords'

    get "games/getprizes"

    post "games/vote_errors"

    post "games/record_synonym"

    # required for routing by the devise module(gem)
    devise_for :gamers do
       get '/gamers/sign_out' => 'devise/sessions#destroy'
    end

    scope "developers/" do 
      match "/" => "backend#home", :as => "backend_home"

      match "projects/remove_developer_from_project" => "developer#remove_developer_from_project", :via => :get
      #get "projects/remove_developer_from_project"
      
      

      #puts "developers/projects/share_project_with_developer"
      match "projects/share_project_with_developer" => "developer#share_project_with_developer", :via => :put
      
      get "projects/update"

      match '/my_subscriptions/pick' => "my_subscription#pick"
      match '/projects/:project_id/add_word' => "projects#add_word", :as => "projects_add_word"
      match '/projects/:project_id/remove_word' => "projects#remove_word", :as => "projects_remove_word"
      match '/projects/:project_id/export_csv' => "projects#export_to_csv", :as => "projects_export"
      resources :projects
      match "projects/:id/share" => "projects#share", :as => "share_project"

			get "projects/remove_developer_from_project"
  		match "projects/share_project_with_developer" => "projects#share_project_with_developer", :via => :put

      match '/my_subscriptions/choose_sub' => "my_subscription#choose_sub", :as => :choose_sub
  		
      match '/projects/:id/edit' => "projects#edit", :as => "edit_project"

      match '/projects/:id/edit' => "projects#edit", :as => "edit_project"

      match "follow/:keyword_id" => "follow#follow", :as => "follow_word"

      match "unfollow/:keyword_id" => "follow#unfollow", :as => "unfollow_word"

      match "followed" => "follow#list_followed", :as => "list_followed_words"

      match '/projects/:id/import_csv' => "projects#import_csv", :as => :import_csv_project


      match '/projects/:id/choose_keywords' => "projects#choose_keywords", :as => :choose_keywords_project

  
  post "keywords/create"


      put '/projects/:id/add_from_csv_keywords' => "projects#add_from_csv_keywords", :as => :add_from_csv_keywords_project

      match "/projects/upload" => "projects#upload", :as => :upload_csv_project

      get "keywords/new"

      post "keywords/create"

      get "keywords/suggest_add"

      match "keywords" => "keywords#viewall"

      match 'search' => 'search#search'

      match '/new' => "developer#new", :as => :developers_new
      match '/developers/create' => "developer#create"
      match '/my_subscriptions/new' => "my_subscription#new"
      match '/my_subscriptions/create' => "my_subscription#create"
      match '/my_subscriptions/choose_sub' => "my_subscription#choose_sub"
      match '/my_subscriptions/pick' => "my_subscription#pick"
    end
  end
  # The priority is based upon order of creation:
  # first created -> highest priority.
  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => "admin#import_csv"

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
