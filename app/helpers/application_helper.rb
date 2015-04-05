module ApplicationHelper

  def is_active?(page_uri)
    "active" if params[:controller]+"/"+params[:action] == page_uri
  end

end