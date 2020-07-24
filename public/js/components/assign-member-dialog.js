"use: strinct;";

(function(g){

    const component = {
        template: '#ASSIGN_MEMBER_DIALOG_TEMPLATE',
        props: ["visible", "project", "members", "assigns"],
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
                    const list = this.members.map(function(member){
                        const assigned = !!self.assigns.find(function(assign){
                            return member.id === assign.member_id && self.project.id === assign.project_id;
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
                const assigns = this.members.filter(function(member){
                    return !!self.list.find(function(m){
                        return member.id == m.id && m.assigned;
                    });
                });
                const obj = { project: this.project, assigns: assigns };
                this.$emit("regist", obj);
            },
        },
    };

    Vue.component('assign-member-dialog', component);
    
})(this);