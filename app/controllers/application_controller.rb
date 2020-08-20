class ApplicationController < ActionController::Base
  def default_props
    {
      csrf: {
        token: form_authenticity_token,
        param: request_forgery_protection_token
      }
    }
  end
end
