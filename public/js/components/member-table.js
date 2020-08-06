"use: strinct;";

(function(g){

    const component = {
        template: '#MEMBER_TABLE_TEMPLATE',
        props: ["member", "basedate", "assigns", "hash_projects", "scroll_x", "a_day_width"],
        data: function(){
            return {};
        },
        watch: {
            scroll_x: function(present, old){//TODO: xxx-table.jsみんな同じ
                const x = (present || 0) * 1;
                const $me = this.$refs.content;
                const $parent = $me.parentElement;
                if(!$parent){ return; }
                const $grand = $parent.parentElement;
                if(!$grand){ return; }
                const scrollLeft = $grand.scrollLeft;
                if(x != scrollLeft){
                    $grand.scrollTo(x, 0);
                }
            },
        },
        computed: {
            assigned_projects: function(){
                const self = this;
                const member = this.member;
                const assigns = this.assigns.filter(function(assign){
                    return assign.members_id == member.id;
                })
                const projects = assigns.map(function(assign){
                    return self.hash_projects[assign.projects_id];
                }).sort(function(a, b){
                    const start = (+new Date(a.start)) - (+new Date(b.start));
                    const last = (+new Date(a.last)) - (+new Date(b.last));
                    return start || last || 0;
                });
                return projects;
            },
        },
        beforeMount: function(){},
        mounted: function(){},
        methods: {
            assign_member: function(project){
                this.$emit("assign", project);
            },
            get_project_style: function(project){
                //TODO: project-tableもほぼ同じ
                const basedate = this.basedate;

                if(!basedate.start || !basedate.last){ return; }
                const app_start = +basedate.start / A_DAY_MSEC;
                const app_last = +basedate.last / A_DAY_MSEC;
                const pj_start = +(new Date(project.start)) / A_DAY_MSEC;
                const pj_last = +(new Date(project.last)) / A_DAY_MSEC;
                const is_left_over = !!(app_start > pj_start);
                const is_right_over = !!(app_last < pj_last);
                const x1 = is_left_over ? 0 : (pj_start - app_start);
                const x2 = (is_right_over ? app_last : pj_last) - app_start;
                const w = x2 - x1 + 1;
                return {
                    "position": "relative",
                    "left": `calc(${this.a_day_width} * ${x1})`,
                    "width": `calc(${this.a_day_width} * ${w})`,
                };
            },
            get_project_class: function(project){
                //TODO: project-tableもほぼ同じ
                const basedate = this.basedate;

                if(!basedate.start || !basedate.last){ return; }
                const app_start = +basedate.start / A_DAY_MSEC;
                const app_last = +basedate.last / A_DAY_MSEC;
                const pj_start = +(new Date(project.start)) / A_DAY_MSEC;
                const pj_last = +(new Date(project.last)) / A_DAY_MSEC;
                const is_left_over = !!(app_start > pj_start);
                const is_right_over = !!(app_last < pj_last);
                return {
                    "arrow-left": !is_left_over,
                    "arrow-right": !is_right_over,
                };
            },

        },
    };

    Vue.component('member-table', component);
    
})(this);