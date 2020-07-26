require "bundler/setup"
Bundler.require
# not bundle
# my class
require File.expand_path("../../db/db.rb", __FILE__)

class Biz
    ARGUMENTS="ARGUMENTS".freeze
    NOT_FOUND="NOT_FOUND".freeze
    LOG2ALERT="LOG2ALERT"

    #
    # Member
    #
    def create_member name #=>Member(new)
        raise ARGUMENTS if !name
        Member.create(name: name)
    end
    def update_member id, name #=>nil
        raise ARGUMENTS if !id
        raise ARGUMENTS if !name
        db_member = select_member_by_id(id)
        raise NOT_FOUND if !db_member
        db_member.update(name: name)
        db_member
    end
    def delete_member id #=>nil
        raise ARGUMENTS if !id
        db_member = select_member_by_id(id)
        raise NOT_FOUND if !db_member
        Assign.where(members_id: id).delete_all
        db_member.destroy
        nil
    end
    def select_member_by_id id
        Member.find_by_id(id)
    end
    def select_all_members #=>[Member]
        Member.all
    end
    def select_assigned_members project #=>[Member]
        raise ARGUMENTS if !project
        Member.where(id: Assign.select(:members_id).where(projects_id: project.id))
    end

    #
    # Project
    #
    def create_project name, note, volume, start, last #=>Project(new)
        raise ARGUMENTS if !name
        raise ARGUMENTS if !volume
        raise ARGUMENTS if !start
        raise ARGUMENTS if !last
        raise ARGUMENTS if last < start
        Project.create(name: name, note: note, volume: volume, start: start, last: last)
    end
    def update_project id, name, note, volume, start, last #=>nil
        raise ARGUMENTS if !id
        raise ARGUMENTS if !name
        raise ARGUMENTS if !volume
        raise ARGUMENTS if !start
        raise ARGUMENTS if !last
        raise ARGUMENTS if last < start
        db_project = select_project_by_id(id)
        raise NOT_FOUND if !db_project
        db_project.update(name: name, note: note, volume: volume, start: start, last: last)
        db_project
    end
    def delete_project id #=>nil
        raise ARGUMENTS if !id
        db_project = select_project_by_id(id)
        raise NOT_FOUND if !db_project
        Assign.where(projects_id: id).delete_all
        db_project.destroy
        nil
    end
    def select_project_by_id id
        Project.find_by_id(id)
    end
    def select_all_projects #=>[Project]
       Project.all
    end
    def select_assigned_projects member #=>[Project]
        raise ARGUMENTS if !member
        Project.where(id: Assign.select(:projects_id).where(members_id: member.id))
    end

    #
    # Assign
    #
    def create_assign projects_id, members_id
        raise ARGUMENTS if !projects_id
        raise ARGUMENTS if !members_id
        begin
            Assign.create(projects_id: projects_id, members_id: members_id)
        rescue ActiveRecord::RecordNotUnique
            raise "プロジェクト重複"
        end

    end
    def delete_assign id #=>nil
        raise ARGUMENTS if !id
        db_assign = Assign.find_by_id(id)
        raise NOT_FOUND if !db_assign
        db_assign.destroy
        nil
    end
    def edit_assign delete_list, create_list
        raise ARGUMENTS if !delete_list
        raise ARGUMENTS if !delete_list.instance_of?(Array)
        raise ARGUMENTS if !delete_list.all?{|e| e[:id] ? true : false }
        raise ARGUMENTS if !create_list
        raise ARGUMENTS if !create_list.instance_of?(Array)
        raise ARGUMENTS if !create_list.all?{|e| e[:projects_id] && e[:members_id] ? true : false }
        Db.transaction do
            delete_list.each{|item|
                delete_assign(item[:id])
            }
            create_list.map{|item| #returns created assigns
                create_assign(item[:projects_id], item[:members_id])
            }
        end
    end

    #
    # Mixed
    #
    ## Select between 
    def _select_between_project_id all=true, _start=nil, _last=nil
        start = _start || 7.days.ago
        last = _last || 31.days.after
        raise ARGUMENTS if _start && _last && (_start > _last)
        query = all ? Project : Project.select(:id)
        query.where("? <= last", start).where("start <= ?", last)
    end
    def _select_between_assign_id select=nil, start=nil, last=nil
        query = select ? Assign.select(select) : Assign
        query.where(projects_id: _select_between_project_id(false, start, last))
    end
    def select_between_projects start=nil, last=nil#=>[Project]
        _select_between_project_id true, start, last
    end
    def select_between_assigns start=nil, last=nil#=>[Assign]
        _select_between_assign_id nil, start, last
    end
    def select_between_members start=nil, last=nil#=>[Member]
        Member.where(id: _select_between_assign_id(:members_id, start, last))
    end


end