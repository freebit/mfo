# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150323125139) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "bank_accounts", force: :cascade do |t|
    t.string   "account_number"
    t.integer  "organization_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "bank_accounts", ["organization_id"], name: "index_bank_accounts_on_organization_id", using: :btree

  create_table "banks", force: :cascade do |t|
    t.string   "name"
    t.string   "korr_number"
    t.string   "bik"
    t.string   "inn"
    t.string   "city"
    t.string   "address"
    t.integer  "bank_account_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "banks", ["bank_account_id"], name: "index_banks_on_bank_account_id", using: :btree

  create_table "documents", force: :cascade do |t|
    t.string   "type_d"
    t.string   "file"
    t.integer  "order_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "documents", ["order_id"], name: "index_documents_on_order_id", using: :btree

  create_table "founders", force: :cascade do |t|
    t.string   "name"
    t.float    "share"
    t.string   "pass_data_ogrn"
    t.integer  "organization_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "founders", ["organization_id"], name: "index_founders_on_organization_id", using: :btree

  create_table "individuals", force: :cascade do |t|
    t.string   "fullname"
    t.date     "birthday"
    t.string   "pass_serial_number"
    t.date     "pass_issue_date"
    t.string   "pass_issued"
    t.string   "pass_issued_code"
    t.string   "old_pass_serial_number"
    t.date     "old_pass_issue_date"
    t.string   "old_pass_issued"
    t.string   "old_pass_issued_code"
    t.string   "birth_place"
    t.string   "citizenship"
    t.string   "reg_place"
    t.string   "curr_place"
    t.string   "phone"
    t.string   "email"
    t.integer  "organization_id"
    t.integer  "order_id"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "individuals", ["order_id"], name: "index_individuals_on_order_id", using: :btree
  add_index "individuals", ["organization_id"], name: "index_individuals_on_organization_id", using: :btree

  create_table "orders", force: :cascade do |t|
    t.string   "platform"
    t.string   "number"
    t.string   "number_mfo"
    t.date     "create_date"
    t.float    "summa"
    t.date     "submission_deadline"
    t.string   "number_data_protocol"
    t.string   "personal_number"
    t.string   "agent"
    t.string   "agent_name"
    t.float    "agent_summa"
    t.string   "status"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
  end

  create_table "organizations", force: :cascade do |t|
    t.string   "type_o"
    t.string   "name"
    t.string   "fullname"
    t.string   "inn"
    t.string   "kpp"
    t.string   "ogrn"
    t.string   "address_legal"
    t.string   "address_actual"
    t.string   "head_position"
    t.date     "reg_date"
    t.string   "attachable_type"
    t.integer  "order_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "organizations", ["order_id"], name: "index_organizations_on_order_id", using: :btree

  create_table "platforms", force: :cascade do |t|
    t.string   "name"
    t.float    "rate_1"
    t.float    "rate_2"
    t.float    "ast_rate_1"
    t.float    "ast_rate_2"
    t.float    "max"
    t.float    "min"
    t.boolean  "active"
    t.integer  "orders_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "number"
  end

  add_index "platforms", ["orders_id"], name: "index_platforms_on_orders_id", using: :btree

  create_table "roles", force: :cascade do |t|
    t.string   "name"
    t.string   "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "roles", ["name"], name: "index_roles_on_name", unique: true, using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.datetime "last_visit"
    t.boolean  "active"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "password_digest"
    t.string   "remember_token"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["remember_token"], name: "index_users_on_remember_token", using: :btree

  create_table "users_roles", force: :cascade do |t|
    t.integer  "role_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "user_id"
  end

  add_index "users_roles", ["role_id"], name: "index_users_roles_on_role_id", using: :btree
  add_index "users_roles", ["user_id"], name: "index_users_roles_on_user_id", using: :btree

  add_foreign_key "users_roles", "roles"
  add_foreign_key "users_roles", "users"
end
