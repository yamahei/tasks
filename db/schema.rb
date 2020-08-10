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

ActiveRecord::Schema.define(version: 20200809) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "assigns", force: :cascade do |t|
    t.bigint "projects_id", null: false
    t.bigint "members_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.date "start"
    t.date "last"
    t.boolean "sync", default: true, null: false
    t.index ["members_id"], name: "index_assigns_on_members_id"
    t.index ["projects_id", "members_id"], name: "index_assigns_on_projects_id_and_members_id", unique: true
    t.index ["projects_id"], name: "index_assigns_on_projects_id"
  end

  create_table "members", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "projects", force: :cascade do |t|
    t.string "name", null: false
    t.string "note"
    t.integer "volume", null: false
    t.date "start", null: false
    t.date "last", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "assigns", "members", column: "members_id"
  add_foreign_key "assigns", "projects", column: "projects_id"
end
