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

  def path_to
    if parent and not persisted?
      polymorphic_path([parent, self])
    else
      super
    end
  end

  def set_defaults
    self.colour ||= default_colour
  end

  def default_colour
    spin = 360 / Math.sqrt(2)
    hue = title.hash * spin
    Hsluv.hpluv_to_hex(hue, 100, 82.5)
  end

  def title_colour
    hsl = colour.paint.hsl
    hsl.s = 1
    hsl.l = 0.15
    Chroma.paint(hsl).to_hex
  end

  def colours
    {
      base: colour,
      title: title_colour,
      gradient_start: colour.paint.spin(-50).to_hex,
      gradient_end: colour.paint.spin(50).to_hex,
    }
  end
end
