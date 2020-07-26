require "spec_helper"
require "biz"

describe "Biz" do
  before do
    @biz = Biz.new
  end


  context "Members" do

    it "CRUD" do

      # Create
      member = @biz.create_member "hoge"
      expect{ @biz.create_member nil }.to raise_error(Biz::ARGUMENTS)
      expect(member).to be_a Member

      # Update
      member.name = "MEMBER"
      expect{ @biz.update_member(nil, member.name) }.to raise_error(Biz::ARGUMENTS)
      expect{ @biz.update_member(nil, nil) }.to raise_error(Biz::ARGUMENTS)
      expect{ @biz.update_member(-1, "a") }.to raise_error(Biz::NOT_FOUND)
      u_member = @biz.update_member(member.id, member.name)
      expect(u_member).to be_a Member
      expect(u_member.id).to eq member.id
      expect(u_member.name).to eq "MEMBER"

      #Read
      r_member = @biz.select_member_by_id(member.id)
      # expect(@biz.select_member_by_id(member)).to eq nil#=>通る：ActiveRecordの不思議
      expect(@biz.select_member_by_id(nil)).to eq nil
      expect(r_member).to be_a Member
      expect(r_member.id).to eq member.id

      #Delete
      expect{ @biz.delete_member(nil) }.to raise_error(Biz::ARGUMENTS)
      expect{ @biz.delete_member(-1) }.to raise_error(Biz::NOT_FOUND)
      # expect{ @biz.delete_member(member) }.to raise_error(Biz::NOT_FOUND)#=>通る：ActiveRecordの不思議
      expect(@biz.delete_member(member.id)).to eq nil
      expect(@biz.select_member_by_id(member.id)).to eq nil

    end

  end

  context "Projects" do

    it "CRUD" do

      #Create
      project = @biz.create_project("a", nil, 10, Date.new(2020, 6, 10), Date.new(2020, 6, 12))
      expect{ @biz.create_project(nil, nil, 10,  Date.new(2020, 6, 10), Date.new(2020, 6, 12)) }.to raise_error(Biz::ARGUMENTS)
      expect{ @biz.create_project("a", nil, nil, Date.new(2020, 6, 10), Date.new(2020, 6, 12)) }.to raise_error(Biz::ARGUMENTS)
      expect{ @biz.create_project("a", nil, 10,  nil,                   Date.new(2020, 6, 12)) }.to raise_error(Biz::ARGUMENTS)
      expect{ @biz.create_project("a", nil, 10,  Date.new(2020, 6, 10), nil) }.to raise_error(Biz::ARGUMENTS)
      expect{ @biz.create_project(nil, nil, 10,  Date.new(2020, 6, 12), Date.new(2020, 6, 10)) }.to raise_error(Biz::ARGUMENTS)
      expect(project).to be_a Project

      #Update
      project.name = "A"
      project.note = "project"
      project.volume = 3
      project.start = Date.new(1976, 7, 3)
      project.last = Date.new(1976, 8, 5)
      expect{ @biz.update_project(project.id, nil, nil, 10,  Date.new(2020, 6, 10), Date.new(2020, 6, 12)) }.to raise_error(Biz::ARGUMENTS)
      expect{ @biz.update_project(project.id, "a", nil, nil, Date.new(2020, 6, 10), Date.new(2020, 6, 12)) }.to raise_error(Biz::ARGUMENTS)
      expect{ @biz.update_project(project.id, "a", nil, 10,  nil,                   Date.new(2020, 6, 12)) }.to raise_error(Biz::ARGUMENTS)
      expect{ @biz.update_project(project.id, "a", nil, 10,  Date.new(2020, 6, 10), nil) }.to raise_error(Biz::ARGUMENTS)
      expect{ @biz.update_project(project.id, nil, nil, 10,  Date.new(2020, 6, 12), Date.new(2020, 6, 10)) }.to raise_error(Biz::ARGUMENTS)
      expect{ @biz.update_project(-1, "1", "1", 1, 1, 1) }.to raise_error(Biz::NOT_FOUND)
      u_project = @biz.update_project(project.id, project.name, project.note, project.volume, project.start, project.last)
      expect(u_project).to be_a Project
      expect(u_project.id).to eq project.id
      expect(u_project.name).to eq "A"

      #Read
      r_project = @biz.select_project_by_id(project.id)
      #expect(@biz.select_project_by_id(project)).to eq nil#=>通る：ActiveRecordの不思議
      expect(@biz.select_project_by_id(nil)).to eq nil
      expect(r_project).to be_a Project
      expect(r_project.id).to eq project.id

      #Delete
      expect{ @biz.delete_project(nil) }.to raise_error(Biz::ARGUMENTS)
      expect{ @biz.delete_project(-1) }.to raise_error(Biz::NOT_FOUND)
      #expect{ @biz.delete_project(project) }.to raise_error(Biz::NOT_FOUND)#=>通る：ActiveRecordの不思議
      expect(@biz.delete_project(project.id)).to eq nil
      expect(@biz.select_project_by_id(project.id)).to eq nil

    end

  end

  context "Assigns" do
    before do
      @m1 = @biz.create_member "m1"
      @m2 = @biz.create_member "m2"
      @p1 = @biz.create_project("p1", nil, 10, Date.new(2000, 1, 1), Date.new(2000, 2, 28))
      @p2 = @biz.create_project("p2", nil, 10, Date.new(2000, 2, 1), Date.new(2000, 3, 30))
    end
    after do
      @biz.delete_member(@m1.id)
      @biz.delete_member(@m2.id)
      @biz.delete_project(@p1.id)
      @biz.delete_project(@p2.id)
    end

    it "CRUD" do

      #Create
      assign = @biz.create_assign @p1.id, @m1.id
      expect{ @biz.create_assign nil, 1 }.to raise_error(Biz::ARGUMENTS)
      expect{ @biz.create_assign 1, nil }.to raise_error(Biz::ARGUMENTS)
      expect(assign).to be_a Assign

      #Edit(create and Delete)
      delete_list = [assign]
      create_list = [{ projects_id: @p2.id, members_id: @m2.id }]
      expect{ @biz.edit_assign nil, [] }.to raise_error(Biz::ARGUMENTS)
      expect{ @biz.edit_assign nil, [{}] }.to raise_error(Biz::ARGUMENTS)
      expect{ @biz.edit_assign [], nil }.to raise_error(Biz::ARGUMENTS)
      expect{ @biz.edit_assign [{}], nil }.to raise_error(Biz::ARGUMENTS)
      created_list = @biz.edit_assign delete_list, create_list
      expect(created_list).to be_a Array
      expect(created_list[0]).to be_a Assign
      e_assign = created_list[0]
      expect(e_assign.projects_id).to eq @p2.id
      expect(e_assign.members_id).to eq @m2.id

      #Delete
      expect{ @biz.delete_assign(nil) }.to raise_error(Biz::ARGUMENTS)
      expect{ @biz.delete_assign(-1) }.to raise_error(Biz::NOT_FOUND)
      #expect{ @biz.delete_assign(e_assign) }.to raise_error(Biz::NOT_FOUND)#=>通る：ActiveRecordの不思議
      expect(@biz.delete_assign(e_assign.id)).to eq nil
      # select_assign_by_idはない

    end

  end

  context "Mixed" do
    before do
      @m1 = @biz.create_member "m1"
      @m2 = @biz.create_member "m2"
      @p1 = @biz.create_project("p1", nil, 10, Date.new(2000, 1, 1), Date.new(2000, 2, 28))
      @p2 = @biz.create_project("p2", nil, 10, Date.new(2000, 2, 1), Date.new(2000, 3, 30))
      @a11 = @biz.create_assign @p1.id, @m1.id
      @a22 = @biz.create_assign @p2.id, @m2.id
    end
    after do
      @biz.delete_member(@m1.id)
      @biz.delete_member(@m2.id)
      @biz.delete_project(@p1.id)
      @biz.delete_project(@p2.id)
    end

    it "assigned objects" do
      
      expect{ @biz.select_assigned_members(nil) }.to raise_error(Biz::ARGUMENTS)
      assigns_p1 = @biz.select_assigned_members(@p1) #=> [@m1]
      expect(assigns_p1).to be_kind_of Enumerable # ActiveRecord::Relation is not Array
      expect(assigns_p1.length).to eq 1
      expect(assigns_p1[0]).to be_a Member
      expect(assigns_p1[0].id).to eq @m1.id
      assigns_p2 = @biz.select_assigned_members(@p2) #=> [@m2]
      expect(assigns_p2[0].id).to eq @m2.id

      expect{ @biz.select_assigned_projects(nil) }.to raise_error(Biz::ARGUMENTS)
      assigns_m1 = @biz.select_assigned_projects(@m1) #=> [@p1]
      expect(assigns_m1).to be_kind_of Enumerable # ActiveRecord::Relation is not Array
      expect(assigns_m1.length).to eq 1
      expect(assigns_m1[0]).to be_a Project
      expect(assigns_m1[0].id).to eq @p1.id
      assigns_m2 = @biz.select_assigned_projects(@m2) #=> [@p2]
      expect(assigns_m2[0].id).to eq @p2.id

    end

    it "between objects" do
      # Project1(@p1)  <1/1--------2/28>        assignes Member1(@m1)
      # Project2(@p2)        <2/1---------3/30> assignes Member2(@m2)
      d_1_01 = Date.new(2000, 1,  1)# p1
      d_1_31 = Date.new(2000, 1, 31)# p1
      d_2_01 = Date.new(2000, 2,  1)# p1 p2
      d_2_28 = Date.new(2000, 2, 28)# p1 p2
      d_3_01 = Date.new(2000, 3,  1)#    p2
      d_3_30 = Date.new(2000, 3, 30)#    p2

      # p1: m1
      projects_p1 = @biz.select_between_projects d_1_01, d_1_31
      assigns_p1 = @biz.select_between_assigns d_1_01, d_1_31
      members_p1 = @biz.select_between_members d_1_01, d_1_31
      expect(projects_p1).to be_kind_of Enumerable # ActiveRecord::Relation is not Array
      expect(projects_p1.length).to eq 1
      expect(projects_p1[0]).to be_a Project
      expect(projects_p1[0].id).to eq @p1.id
      expect(assigns_p1).to be_kind_of Enumerable # ActiveRecord::Relation is not Array
      expect(assigns_p1.length).to eq 1
      expect(assigns_p1[0]).to be_a Assign
      expect(assigns_p1[0].id).to eq @a11.id
      expect(members_p1).to be_kind_of Enumerable # ActiveRecord::Relation is not Array
      expect(members_p1.length).to eq 1
      expect(members_p1[0]).to be_a Member
      expect(members_p1[0].id).to eq @m1.id

      # p2: m2
      projects_p2 = @biz.select_between_projects d_3_01, d_3_30
      assigns_p2 = @biz.select_between_assigns d_3_01, d_3_30
      members_p2 = @biz.select_between_members d_3_01, d_3_30
      expect(projects_p2).to be_kind_of Enumerable # ActiveRecord::Relation is not Array
      expect(projects_p2.length).to eq 1
      expect(projects_p2[0]).to be_a Project
      expect(projects_p2[0].id).to eq @p2.id
      expect(assigns_p2).to be_kind_of Enumerable # ActiveRecord::Relation is not Array
      expect(assigns_p2.length).to eq 1
      expect(assigns_p2[0]).to be_a Assign
      expect(assigns_p2[0].id).to eq @a22.id
      expect(members_p2).to be_kind_of Enumerable # ActiveRecord::Relation is not Array
      expect(members_p2.length).to eq 1
      expect(members_p2[0]).to be_a Member
      expect(members_p2[0].id).to eq @m2.id

      # p1: m1 and p2: m2
      projects_px = @biz.select_between_projects d_2_01, d_2_28
      assigns_px = @biz.select_between_assigns d_2_01, d_2_28
      members_px = @biz.select_between_members d_2_01, d_2_28
      expect(projects_px.length).to eq 2
      expect(assigns_px.length).to eq 2
      expect(members_px.length).to eq 2

    end

  end
      ###
      # TODO:
      #   select_all_members
      #   select_all_projects

end