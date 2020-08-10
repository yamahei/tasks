class AlterAssigns < ActiveRecord::Migration[6.0]
    def self.up
        add_column :assigns, :start, :date, { null: true }
        add_column :assigns, :last, :date, { null: true }
        add_column :assigns, :sync, :boolean, { null: false, default: true }
    end

    def self.down
        remove_column :assigns, :start
        remove_column :assigns, :last
        remove_column :assigns, :sync
    end
end