# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_08_16_123943) do

  create_table "actions", force: :cascade do |t|
    t.string "title"
    t.boolean "done"
    t.integer "project_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["project_id"], name: "index_actions_on_project_id"
  end

  create_table "projects", force: :cascade do |t|
    t.text "title"
    t.text "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "parent_id"
    t.index ["parent_id"], name: "index_projects_on_parent_id"
  end

  create_table "relations", force: :cascade do |t|
    t.integer "from_id", null: false
    t.integer "to_id", null: false
    t.integer "count"
    t.integer "hierarchy"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["from_id"], name: "index_relations_on_from_id"
    t.index ["to_id"], name: "index_relations_on_to_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.string "title"
    t.integer "project_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["project_id"], name: "index_tasks_on_project_id"
  end

  add_foreign_key "actions", "projects"
  add_foreign_key "relations", "froms"
  add_foreign_key "relations", "tos"
  add_foreign_key "tasks", "projects"
end
