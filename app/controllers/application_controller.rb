class ApplicationController < ActionController::Base
  include Webpacker::Helper
  include ActionView::Helpers::AssetUrlHelper

  layout false
  per_request_react_rails_prerenderer

  def default_props(props)
    {
      wrapper_props: wrapper_props(props)
    }
  end

  def wrapper_props(*)
    {
      csrf: {
        token: form_authenticity_token,
        param: request_forgery_protection_token
      },
      packs: {
        styles: asset_pack_path('application.css'),
        scripts: asset_pack_path('application.js')
      },
      user: current_user
    }
  end

  def current_user
    if session[:user_id]
      User.find(session[:user_id])
    end
  end
end
