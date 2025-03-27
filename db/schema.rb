# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2025_03_27_041815) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "color_posts", force: :cascade do |t|
    t.bigint "color_id", null: false
    t.bigint "post_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["color_id", "post_id"], name: "index_color_posts_on_color_id_and_post_id", unique: true
    t.index ["color_id"], name: "index_color_posts_on_color_id"
    t.index ["post_id"], name: "index_color_posts_on_post_id"
  end

  create_table "color_suggestions", force: :cascade do |t|
    t.string "color_combination"
    t.bigint "post_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_color_suggestions_on_post_id"
  end

  create_table "colors", force: :cascade do |t|
    t.string "hex_code", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "likes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "post_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_likes_on_post_id"
    t.index ["user_id", "post_id"], name: "index_likes_on_user_id_and_post_id", unique: true
    t.index ["user_id"], name: "index_likes_on_user_id"
  end

  create_table "posts", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.integer "color_count"
    t.integer "status"
    t.integer "views_count"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_posts_on_user_id"
  end

  create_table "profile_icons", force: :cascade do |t|
    t.string "name"
    t.text "svg_data"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tag_posts", force: :cascade do |t|
    t.bigint "tag_id", null: false
    t.bigint "post_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_tag_posts_on_post_id"
    t.index ["tag_id", "post_id"], name: "index_tag_posts_on_tag_id_and_post_id", unique: true
    t.index ["tag_id"], name: "index_tag_posts_on_tag_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_colors", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "color_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["color_id"], name: "index_user_colors_on_color_id"
    t.index ["user_id"], name: "index_user_colors_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "profile_icon_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["profile_icon_id"], name: "index_users_on_profile_icon_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "color_posts", "colors"
  add_foreign_key "color_posts", "posts"
  add_foreign_key "color_suggestions", "posts"
  add_foreign_key "likes", "posts"
  add_foreign_key "likes", "users"
  add_foreign_key "posts", "users"
  add_foreign_key "tag_posts", "posts"
  add_foreign_key "tag_posts", "tags"
  add_foreign_key "user_colors", "colors"
  add_foreign_key "user_colors", "users"
  add_foreign_key "users", "profile_icons"
end
