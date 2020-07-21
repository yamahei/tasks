require "bundler/setup"
Bundler.require
require File.expand_path("../lib/biz.rb", __FILE__)

# cleaner
EM::defer do
    biz = Biz.new
    loop do
        begin
            #biz.cleaning
            #sleep 15 * 60
        rescue
            #sleep 5 * 60
        end
    end
end

# server
class MyApp < Sinatra::Base

    UUID_FORMAT = /^[0-9a-zA-Z\-]{36}$/
    DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/

    configure do
        set :bind, '0.0.0.0'
        enable :sessions
        use Rack::PostBodyContentTypeParser
        register Sinatra::Validation
        set :show_exceptions, :after_handler# in development, false or :after_handler
    end
    helpers do
        def biz
            @biz ||= Biz.new
        end
    end
    error 500 do
        p e = env['sinatra.error']
        status 500
        {:message => e.message}.to_json
    end

    # 
    # APP
    # 
    get '/' do
        redirect '/index.html'
    end
    # get '/app' do
    #     erb :app
    # end
    # get '/app/:plan_id' do
    #     validates {
    #         required(:plan_id).filled(:string).format?(UUID_FORMAT)
    #     }
    #     erb :app
    # end

    #
    # API
    #

    # Members
    put '/api/members' do # Create => Member
        validates{ params{
            required(:name).filled(:string)
        }}
        biz.create_member(params[:name]).to_json
    end
    post '/api/members' do # Update => Member
        validates{ params{
            required(:id).filled(:integer)
            required(:name).filled(:string)
        }}
        biz.update_member(params[:id], params[:name]).to_json
    end
    delete '/api/members' do # Delete => nil
        validates{ params{
            required(:id).filled(:integer)
        }}
        biz.delete_member(params[:id])
        200
    end

    get '/api/members/all' do # Read => [Member]
        biz.select_all_members().to_json
    end


    # Projects
    put '/api/projects' do # Create => Project
        validates{ params{
            required(:name).filled(:string)
            optional(:note).maybe(:string)
            required(:volume).filled(:integer)
            required(:start).filled(:string, format?: DATE_FORMAT)
            required(:last).filled(:string, format?: DATE_FORMAT)
        }}
        name, note, volume, start, last = params[:name], params[:note], params[:volume], params[:start], params[:last]
        biz.create_project(name, note, volume, Date.parse(start), Date.parse(last)).to_json
    end
    post '/api/projects' do # Update => Project
        validates{ params{
            required(:id).filled(:integer)
            required(:name).filled(:string)
            optional(:note).maybe(:string)
            required(:volume).filled(:integer)
            required(:start).filled(:string, format?: DATE_FORMAT)
            required(:last).filled(:string, format?: DATE_FORMAT)
        }}
        id, name, note, volume, start, last = params[:id], params[:name], params[:note], params[:volume], params[:start], params[:last]
        biz.update_project(id, name, note, volume, Date.parse(start), Date.parse(last)).to_json
    end
    delete '/api/projects' do # Delete => nil
        validates{ params{
            required(:id).filled(:integer)
        }}
        biz.delete_project(params[:id])
        200
    end

    get '/api/projects/all' do # Read => [Project]
        biz.select_all_projects().to_json
    end
    get '/api/projects/relation' do # Read => {[Project], [Assign], [Member]}
        validates{ params{
            required(:start).filled(:string, format?: DATE_FORMAT)
            required(:last).filled(:string, format?: DATE_FORMAT)
        }}
        start, last = Date.parse(params[:start]), Date.parse(params[:last])
        {
            projects: biz.select_between_projects(start, last),
            assigns: biz.select_between_assigns(start, last),
            members: biz.select_between_members(start, last),
        }.to_json
    end

    # assign
    put '/api/assigns' do
        validates{ params{
            required(:project_id).filled(:integer)
            required(:member_id).filled(:integer)
        }}
        biz.create_assign(params[:project_id], params[:member_id]).to_json
    end
    delete '/api/assigns' do
        validates{ params{
            required(:id).filled(:integer)
        }}
        biz.delete_assign(params[:id])
        200
    end
    post '/api/assigns/edit' do#=>[Assign] *created
        assign_type = Dry::Schema.Params do
            optional(:id).maybe(:integer)
            required(:project_id).filled(:integer)
            required(:member_id).filled(:integer)
        end
        validates{ params{
            required(:delete_list).value(:array).each(assign_type)
            required(:create_list).value(:array).each(assign_type)
        }}
        biz.edit_assign(params[:delete_list], params[:create_list]).to_json
    end

end

if $0 == __FILE__ then
   MyApp.run! :host => 'localhost'
end
