require "bundler/setup"
Bundler.require
# not bundle
# my class
require File.expand_path("../db.rb", __FILE__)

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
        Assign.where(member_id: id).delete_all
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
        Member.where(id: Assign.select(:member_id).where(project_id: project.id))
    end

    #
    # Project
    #
    def create_project name, note, volume, start, last #=>Project(new)
        raise ARGUMENTS if !name
        raise ARGUMENTS if !volume
        raise ARGUMENTS if !start
        raise ARGUMENTS if !last
        Project.create(name: name, note: note, volume: volume, start: start, last: last)
    end
    def update_project id, name, note, volume, start, last #=>nil
        raise ARGUMENTS if !id
        raise ARGUMENTS if !name
        raise ARGUMENTS if !volume
        raise ARGUMENTS if !start
        raise ARGUMENTS if !last
        db_project = select_project_by_id(id)
        raise NOT_FOUND if !db_project
        db_project.update(name: name, note: note, volume: volume, start: start, last: last)
        db_project
    end
    def delete_project id #=>nil
        raise ARGUMENTS if !id
        db_project = select_project_by_id(id)
        raise NOT_FOUND if !db_project
        Assign.where(project_id: id).delete_all
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
        Project.where(id: Assign.select(:project_id).where(member_id: member.id))
    end

    #
    # Assign
    #
    def create_assign project_id, member_id
        raise ARGUMENTS if !project_id
        raise ARGUMENTS if !member_id
        begin
            Assign.create(project_id: project_id, member_id: member_id)
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

    #
    # Mixed
    #
    ## Select between 
    def _select_between_project_id all=true, _start=nil, _last=nil
        start = _start || 7.days.ago
        last = _last || 31.days.after
        raise ARGUMENTS if _start && _last && (_start > _last)
        if all then
            Project.where("? <= last", start).where("start <= ?", last)
        else
            Project.select(:id).where("? <= last", start).where("start <= ?", last)
        end
    end
    def _select_between_assign_id select=nil, start=nil, last=nil
        if !select then
            Assign.where(project_id: _select_between_project_id(false, start, last))
        else
            Assign.select(select).where(project_id: _select_between_project_id(false, start, last))
        end
    end
    def select_between_projects start=nil, last=nil#=>[Project]
        _select_between_project_id true, start, last
    end
    def select_between_assigns start=nil, last=nil#=>[Assign]
        _select_between_assign_id nil, start, last
    end
    def select_between_members start=nil, last=nil#=>[Member]
        Member.where(id: _select_between_assign_id(:member_id, start, last))
    end


end