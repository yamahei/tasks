#
# RSpecに移行済み、もうメンテしない（でも一応残す
#

cd lib
bundle exec irb


require './biz'

biz = Biz.new

member = biz.create_member("member")
p member
member.name = "MEMBER"
biz.update_member member.id, member.name
biz.select_all_members#=>[member]
member_2 = biz.select_member_by_id(member.id)
p member_2

project_a = biz.create_project("a", nil, 10, Date.new(2020, 6, 10), Date.new(2020, 6, 12))
project_a.name = "A"
biz.update_project project_a.id, project_a.name, project_a.note, project_a.volume, project_a.start, project_a.last
project_a2 = biz.select_project_by_id(project_a.id)

project_b = biz.create_project("b", nil, 10, Date.today - 3, Date.today + 3)
biz.select_all_projects#=>[project_a, project_b]

biz.select_assigned_members project_a#=>[]
biz.select_between_projects #=>[project_b]
biz.select_between_projects Date.new(2020, 6,  8), Date.new(2020, 6, 11) #=>[project_a]
biz.select_between_projects Date.new(2020, 6, 11), Date.new(2020, 6, 16) #=>[project_a]
biz.select_between_projects Date.new(2020, 6,  1), Date.today #=>[project_a, project_b]

biz.create_assign project_a.id, member.id
biz.select_assigned_projects member#=>project_a
biz.select_assigned_members project_a#=>[member]
biz.select_assigned_members project_b#=>[]

p project_a, member
biz.select_between_projects Date.new(2020, 6, 11), Date.new(2020, 6, 16) #=>[project_a]
biz.select_between_members Date.new(2020, 6, 11), Date.new(2020, 6, 16) #=>[member]
assigns = biz.select_between_assigns Date.new(2020, 6, 11), Date.new(2020, 6, 16) #=>[project_a:member]

biz.delete_assign(assigns[0].id)
biz.select_assigned_members project_a#=>[]

biz.batch_assign([], [{projects_id: project_a.id, members_id: member.id}])
biz.select_assigned_members project_a#=>[member]
biz.delete_member member
biz.select_assigned_members project_a#=>[]
biz.select_assigned_members project_b#=>[]



biz.delete_project project_a.id
biz.delete_project project_b.id

