class User < ApplicationRecord
  has_secure_password
  has_many :projects

  after_create do
    projects.create(title: "Projects")
  end

  def default_project
    projects.first
  end

  def gravatar
    Gravatar.src email
  end

  def include_methods
    [:gravatar]
  end
end
