"use: strinct;";

(function(g){

    const component = {
        template: '#PROJECT_TABLE_TEMPLATE',
        props: ["project", "basedate", "assigns", "hash_members", "scroll_x"],
        data: function(){
            return {};
        },
        watch: {
            scroll_x: function(present, old){
                const x = (present || 0) * 1;
                const $me = this.$refs.content;
                const $parent = $me.parentElement;
                if(!$parent){ return; }
                const $grand = $parent.parentElement;
                if(!$grand){ return; }
                if(x >= 0){
                    $grand.scrollTo(x, 0);
                }
            },
        },
        computed: {
            assigned_members: function(){
                const self = this;
                const project = this.project;
                const assigns = this.assigns.filter(function(assign){
                    return assign.project_id == project.id;
                })
                const members = assigns.map(function(assign){
                    return self.hash_members[assign.member_id];
                });
                return members;
            },
            project_style: function(){
                const basedate = this.basedate;
                const project = this.project;

                if(!basedate.start || !basedate.last){ return; }
                const app_start = +basedate.start / A_DAY;
                const app_last = +basedate.last / A_DAY;
                const pj_start = +(new Date(project.start)) / A_DAY;
                const pj_last = +(new Date(project.last)) / A_DAY;
                const is_left_over = !!(app_start > pj_start);
                const is_right_over = !!(app_last < pj_last);
                const x1 = is_left_over ? 0 : (pj_start - app_start);
                const x2 = (is_right_over ? app_last : pj_last) - app_start;
                const w = x2 - x1 + 1;
                const radius_left = is_left_over ? REDIUS_ZERO : REDIUS_LARGE;
                const radius_right = is_right_over ? REDIUS_ZERO : REDIUS_LARGE;
                return {
                    "position": "relative",
                    "left": `calc(2rem * ${x1})`,
                    "width": `calc(2rem * ${w})`,
                    "border-radius": `${radius_left} ${radius_right} ${radius_right} ${radius_left}`,
                };

            },
        },
        beforeMount: function(){},
        mounted: function(){},
        methods: {
            assign_member: function(){
                this.$emit("assign", this.project);
            },
        },
    };

    Vue.component('project-table', component);
    
})(this);