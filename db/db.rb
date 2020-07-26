require "bundler/setup"
Bundler.require


class Db  < ActiveRecord::Base
    self.abstract_class = true
    config = YAML.load_file(
        File.expand_path('../db.config.yaml', __FILE__)
    )
    setting = config[ENV['RACK_ENV'] || 'development']
    p setting
    establish_connection(setting)
end

class Member < Db
    has_many :assigns
    has_many :projects, :through => :assigns
end

class Project < Db
    has_many :assigns
    has_many :Members, :through => :assigns
end

class Assign < Db
    belongs_to :Members
    belongs_to :projects
end
