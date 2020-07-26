class CreateFirstTables < ActiveRecord::Migration[6.0]
    def self.up
        create_table :members do |t|
            t.string  :name, :null => false
            t.timestamps  # => add created_at, updated_at
        end
        create_table :projects do |t|
            t.string  :name,   :null => false
            t.string  :note,   :null => true
            t.integer :volume, :null => false
            t.date    :start,  :null => false
            t.date    :last,   :null => false
            t.timestamps  # => add created_at, updated_at
        end
        create_table :assigns do |t|
            t.references :projects, foreign_key: true, :null => false
            t.references :members, foreign_key: true, :null => false
            t.timestamps  # => add created_at, updated_at
        end
        add_index  :assigns, [:projects_id, :members_id], unique: true
    end

    def self.down
        drop_table :assigns
        drop_table :projects
        drop_table :members
    end
end