class Project < ApplicationRecord
  belongs_to :user
  has_many :tasks
  validates :title, presence: true

  has_closure_tree

  after_initialize :set_defaults

  def include_methods
    [:colours, :tasks_count, :projects_count]
  end

  def hierarchy_tasks
    self_and_descendants.where(archived: false).flat_map(&:tasks)
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
    count = hierarchy_tasks.count
    ApplicationController.helpers.pluralize(count, "task") if count.positive?
  end

  def projects_count
    count = descendants.where(archived: false).count
    ApplicationController.helpers.pluralize(count, "subproject") if count.positive?
  end
end
