class Project < ApplicationRecord
  belongs_to :user
  has_many :tasks, dependent: :destroy
  validates :title, presence: true
  has_rich_text :description

  has_closure_tree(dependent: :destroy)

  after_initialize :set_defaults

  def include_methods
    [:description, :colours, :tasks_count, :projects_count]
  end

  def hierarchy_tasks(include_own: true)
    from_descendents = descendants.where(archived: false).flat_map(&:tasks)

    if include_own
      tasks + from_descendents
    else
      from_descendents
    end
  end

  def breadcrumbs(include_self: false)
    if include_self
      self_and_ancestors.reverse
    elsif parent
      # unpersisted projects can't use ancestors, but their parent can
      parent.self_and_ancestors.reverse
    else
      []
    end
  end

  def path_arguments
    if parent and not persisted?
      [parent, self]
    else
      super
    end
  end

  def paths
    if persisted?
      super().merge({
                      archive: archive_project_path(self),
                      tasks: project_tasks_path(self),
                      move: move_project_path(self)
                    })
    else
      super
    end
  end

  def set_defaults
    self.colour ||= default_colour
  end

  def default_colour
    hue = if title
        spin = 360 / Math.sqrt(2)
        title.sum * spin
      else
        135
      end

    Hsluv.hpluv_to_hex(hue, 100, 82.5)
  end

  def title_colour
    return unless colour

    hsl = colour.paint.hsl
    hsl.s = 1
    hsl.l = 0.15
    Chroma.paint(hsl).to_hex
  end

  def colours
    return unless colour

    {
      base: colour,
      title: title_colour,
      gradient_start: colour.paint.spin(-50).to_hex,
      gradient_end: colour.paint.spin(50).to_hex,
    }
  end

  def tasks_count
    count = hierarchy_tasks.select { |task| !task.completed }.count
    ApplicationController.helpers.pluralize(count, "task") if count.positive?
  end

  def projects_count
    count = descendants.where(archived: false).count
    ApplicationController.helpers.pluralize(count, "subproject") if count.positive?
  end

  def json_tree
    {
      item: self,
      children: children.where(archived: false).map(&:json_tree)
    }
  end
end
