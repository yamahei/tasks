require "active_record"
require "yaml"

#
# Activerecord without Rails
# https://gist.github.com/schickling/6762581
#
namespace :db do

    db_dir = File.expand_path("../db", __FILE__)
    env = ENV["ENV"] || "development"
    db_config = YAML.load_file(File.join(db_dir, "db.config.yaml"))[env]
    migration_dir = File.join(db_dir, "migrate")

    desc "Migrate the database"
    task :migrate do
        ActiveRecord::Base.establish_connection(db_config)
        schema_migration = ActiveRecord::Base.connection.schema_migration
        ActiveRecord::MigrationContext.new(migration_dir, schema_migration).migrate
        Rake::Task["db:schema"].invoke
        puts "Database migrated."
    end

    desc 'Create a db/schema.rb file that is portable against any DB supported by AR'
    task :schema do
        ActiveRecord::Base.establish_connection(db_config)
        require 'active_record/schema_dumper'
        filename = File.join(db_dir, "schema.rb")
        File.open(filename, "w:utf-8") do |file|
            ActiveRecord::SchemaDumper.dump(ActiveRecord::Base.connection, file)
        end
    end

end
