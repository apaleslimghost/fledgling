class Project < ApplicationRecord
  has_many :tasks
  validates :title, presence: true

  has_closure_tree

  after_initialize :set_defaults

  def include_methods
    [:colours]
  end

  def hierarchy_tasks
    self_and_descendants.flat_map(&:tasks)
  end

  def breadcrumbs
    ancestors.reverse
  end

  def path_arguments
    if parent and not persisted?
      [parent, self]
    else
      super
    end
  end

  def set_defaults
    self.colour ||= default_colour
  end

  def default_colour
    return unless title

    spin = 360 / Math.sqrt(2)
    hue = title.sum * spin
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
end
