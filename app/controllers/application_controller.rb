class ApplicationController < ActionController::Base
  include Webpacker::Helper
  include ActionView::Helpers::AssetUrlHelper

  per_request_react_rails_prerenderer

  def render_component(component, **options)
    html = component.render_in view_context
    render options.reverse_merge({ html: html, layout: true })
  end

  def default_props
    {
      wrapper_props: wrapper_props
    }
  end

  def wrapper_props
    {
      csrf: {
        token: form_authenticity_token,
        param: request_forgery_protection_token
      },
      packs: {
        styles: asset_pack_path('application.css'),
        scripts: asset_pack_path('application.js')
      }
    }
  end
end
