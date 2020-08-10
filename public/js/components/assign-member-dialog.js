"use: strinct;";

(function(g){

    const component = {
        template: '#ASSIGN_MEMBER_DIALOG_TEMPLATE',
        props: ["visible", "project", "members", "hash_assigned_members"],
        data: function(){
            return {
                list: [],//{ id, name, checked }
            };
        },
        watch: {
            visible: function(present, old){
                if(present){
                    const self = this;
                    this.list.splice(0);
                    const assigned_members = this.hash_assigned_members[this.project.id];
                    const list = this.members.map(function(member){
                        const assigned = !!assigned_members.find(function(m){
                            return member.id === m.id;
                        });
                        return {
                            id: member.id,
                            name: member.name,
                            assigned: assigned,
                        };
                    });
                    this.list.splice(0, 0, ...list);
                }
            },
        },
        computed: {
            show_dialog: function(){ return !!this.visible; },
        },

        beforeMount: function(){},
        mounted: function(){},
        methods: {
            cancel: function(){ this.$emit("cancel"); },
            ok: function(){
                const self = this;
                const assigned_members = this.members.filter(function(member){
                    return !!self.list.find(function(m){
                        return member.id == m.id && m.assigned;
                    });
                });
                const obj = { project: this.project, assigns: assigned_members };
                this.$emit("regist", obj);
            },
        },
    };

    Vue.component('assign-member-dialog', component);
    
})(this);